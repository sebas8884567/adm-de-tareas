import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Task } from './Dashboard';

interface ProfileProps {
  user: {
    name: string;
    email: string;
  };
  tasks: Task[];
  onUpdateProfile: (name: string, email: string) => void;
}

export function Profile({ user, tasks, onUpdateProfile }: ProfileProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, email);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      // Aquí iría la lógica para cambiar la contraseña
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Contraseña actualizada correctamente');
    }
  };

  // Filter out any null or invalid tasks
  const validTasks = Array.isArray(tasks) 
    ? tasks.filter(t => t && typeof t === 'object' && t.status) 
    : [];
  
  const totalTasks = validTasks.length;
  const completedTasks = validTasks.filter(t => t.status === 'completed').length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Mi Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu información personal y configuración
          </p>
        </div>

        <Card className="bg-card border-border p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl text-primary uppercase">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl text-foreground mb-1">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tareas totales</p>
              <p className="text-2xl text-foreground">{totalTasks}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completadas</p>
              <p className="text-2xl text-foreground">{completedTasks}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tasa de éxito</p>
              <p className="text-2xl text-primary">{successRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-8">
          <div className="mb-6">
            <h3 className="text-lg text-foreground mb-1">Información Personal</h3>
            <p className="text-sm text-muted-foreground">
              Actualiza tu nombre y correo electrónico
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input border-border"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Guardar Cambios
            </Button>
          </form>
        </Card>

        <Card className="bg-card border-border p-8">
          <div className="mb-6">
            <h3 className="text-lg text-foreground mb-1">Cambiar Contraseña</h3>
            <p className="text-sm text-muted-foreground">
              Actualiza tu contraseña de acceso
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                Contraseña Actual
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-input border-border"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  Nueva Contraseña
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-input border-border"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input border-border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Actualizar Contraseña
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}