import express, { type Request, Response, NextFunction } from "express";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { registerRoutes } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await connectDB();
    
    registerRoutes(app);

    const server = app.listen({
      port: env.PORT,
      host: "0.0.0.0",
      reusePort: true,
    });

    if (env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    app.use(notFoundHandler);
    app.use(errorHandler);

    log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
