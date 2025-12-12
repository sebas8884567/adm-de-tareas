import { Check, LayoutGrid, BarChart3, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: string;
  userName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navbar({ currentPage, userName, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
              <span className="text-lg text-primary">NexTask</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className={
                  currentPage === 'dashboard'
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Panel
              </Button>

              <Button
                variant={currentPage === 'reports' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('reports')}
                className={
                  currentPage === 'reports'
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Reportes
              </Button>

              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('profile')}
                className={
                  currentPage === 'profile'
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
