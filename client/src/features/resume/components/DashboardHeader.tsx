import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">ResumeCraft</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Avatar className="h-9 w-9" data-testid="avatar-user">
              <AvatarImage
                src={user?.profileImageUrl || ''}
                alt={user?.firstName || 'User'}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="hover-elevate active-elevate-2"
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
