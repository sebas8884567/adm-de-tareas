import { Check, CheckCircle, BarChart3, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface HomeProps {
  onNavigateToLogin: () => void;
}

export function Home({ onNavigateToLogin }: HomeProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" strokeWidth={3} />
              </div>
              <span className="text-lg text-primary">NexTask</span>
            </div>

            <Button
              onClick={onNavigateToLogin}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 border-2 border-primary rounded-2xl flex items-center justify-center">
              <Check className="w-12 h-12 text-primary" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-4xl text-foreground mb-4">
            Bienvenido a <span className="text-primary">NexTask</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La aplicación de gestión de tareas diseñada para aumentar tu productividad
          </p>
          <div className="mt-8">
            <Button
              onClick={onNavigateToLogin}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white h-12 px-8"
            >
              Comenzar ahora
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <Card className="bg-card border-border p-8 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg text-foreground mb-2">Organiza tus tareas</h3>
            <p className="text-sm text-muted-foreground">
              Gestiona todas tus tareas en un solo lugar de manera eficiente
            </p>
          </Card>

          <Card className="bg-card border-border p-8 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg text-foreground mb-2">Analiza tu progreso</h3>
            <p className="text-sm text-muted-foreground">
              Visualiza estadísticas detalladas y reportes de rendimiento
            </p>
          </Card>

          <Card className="bg-card border-border p-8 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg text-foreground mb-2">Datos seguros</h3>
            <p className="text-sm text-muted-foreground">
              Tu información se almacena de forma segura y privada
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
