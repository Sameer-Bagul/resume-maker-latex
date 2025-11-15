import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "register";
}

export function AuthDialog({ open, onOpenChange, defaultMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const { loginAsync, registerAsync, isLoginLoading, isRegisterLoading } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginAsync(data);
      toast({
        title: "Success!",
        description: "You've been logged in successfully.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await registerAsync(data);
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoginLoading || isRegisterLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-auth">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Sign in to continue building your resume"
              : "Sign up to start building your professional resume"}
          </DialogDescription>
        </DialogHeader>

        {mode === "login" ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                data-testid="input-login-email"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                data-testid="input-login-password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit-login"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-primary hover:underline"
                data-testid="button-switch-register"
              >
                Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="register-firstName">First Name</Label>
                <Input
                  id="register-firstName"
                  type="text"
                  placeholder="John"
                  data-testid="input-register-firstName"
                  {...registerForm.register("firstName")}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-lastName">Last Name</Label>
                <Input
                  id="register-lastName"
                  type="text"
                  placeholder="Doe"
                  data-testid="input-register-lastName"
                  {...registerForm.register("lastName")}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                data-testid="input-register-email"
                {...registerForm.register("email")}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                data-testid="input-register-password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit-register"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary hover:underline"
                data-testid="button-switch-login"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
