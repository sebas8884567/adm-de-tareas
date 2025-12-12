import { useState } from 'react';
import { Plus, Edit2, Trash2, Circle, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

interface DashboardProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function Dashboard({ tasks, onAddTask, onEditTask, onDeleteTask }: DashboardProps) {
  console.log('🎯 Dashboard received tasks:', tasks.length);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    });
    setEditingTask(null);
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      onEditTask({
        ...editingTask,
        ...formData,
      });
    } else {
      onAddTask(formData);
    }
    
    handleCloseDialog();
  };

  // Ensure tasks is always an array and filter out any invalid entries
  const validTasks = Array.isArray(tasks) ? tasks.filter(t => t && typeof t === 'object' && t.status) : [];
  
  const pendingTasks = validTasks.filter(t => t.status === 'pending');
  const inProgressTasks = validTasks.filter(t => t.status === 'in-progress');
  const completedTasks = validTasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl text-foreground mb-1">Panel de Tareas</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona todas tus tareas en un solo lugar
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Circle className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-foreground">Pendientes</h3>
            </div>
            <p className="text-sm text-muted-foreground">{pendingTasks.length} tareas</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="text-foreground">En Progreso</h3>
            </div>
            <p className="text-sm text-muted-foreground">{inProgressTasks.length} tareas</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Completadas</h3>
            </div>
            <p className="text-sm text-muted-foreground">{completedTasks.length} tareas</p>
          </Card>
        </div>

        <Card className="bg-card border-border p-12">
          {validTasks.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-6">No tienes tareas aún</p>
              <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear tu primera tarea
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {validTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {task.status === 'pending' && 'Pendiente'}
                        {task.status === 'in-progress' && 'En Progreso'}
                        {task.status === 'completed' && 'Completada'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(task)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nombre de la tarea"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe la tarea..."
                className="bg-input border-border resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-foreground">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status" className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-foreground">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority" className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-foreground">Fecha de vencimiento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-border"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}