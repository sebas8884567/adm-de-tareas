import { Card } from './ui/card';
import { Task } from './Dashboard';
import { Circle, Clock, CheckCircle, BarChart3, TrendingUp, AlertCircle, Flag } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ReportsProps {
  tasks: Task[];
}

export function Reports({ tasks }: ReportsProps) {
  // Filter out any null or invalid tasks
  const validTasks = Array.isArray(tasks) 
    ? tasks.filter(t => t && typeof t === 'object' && t.status && t.priority && t.createdAt && t.dueDate) 
    : [];
  
  const totalTasks = validTasks.length;
  const pendingTasks = validTasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = validTasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = validTasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusData = [
    { name: 'Pendientes', value: pendingTasks, color: '#8b949e' },
    { name: 'En Progreso', value: inProgressTasks, color: '#f59e0b' },
    { name: 'Completadas', value: completedTasks, color: '#10b981' },
  ].filter(item => item.value > 0);

  const priorityData = [
    { 
      name: 'Alta', 
      cantidad: validTasks.filter(t => t.priority === 'high').length,
      completadas: validTasks.filter(t => t.priority === 'high' && t.status === 'completed').length,
    },
    { 
      name: 'Media', 
      cantidad: validTasks.filter(t => t.priority === 'medium').length,
      completadas: validTasks.filter(t => t.priority === 'medium' && t.status === 'completed').length,
    },
    { 
      name: 'Baja', 
      cantidad: validTasks.filter(t => t.priority === 'low').length,
      completadas: validTasks.filter(t => t.priority === 'low' && t.status === 'completed').length,
    },
  ];

  const statusBarData = [
    { name: 'Pendientes', cantidad: pendingTasks, fill: '#8b949e' },
    { name: 'En Progreso', cantidad: inProgressTasks, fill: '#f59e0b' },
    { name: 'Completadas', cantidad: completedTasks, fill: '#10b981' },
  ];

  // Datos de tendencia por fecha de creación
  const tasksByMonth = validTasks.reduce((acc, task) => {
    const date = new Date(task.createdAt);
    const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.mes === monthKey);
    
    if (existing) {
      existing.creadas += 1;
      if (task.status === 'completed') existing.completadas += 1;
    } else {
      acc.push({ 
        mes: monthKey, 
        creadas: 1,
        completadas: task.status === 'completed' ? 1 : 0
      });
    }
    
    return acc;
  }, [] as { mes: string; creadas: number; completadas: number }[]);

  const highPriorityTasks = validTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  const overdueTasks = validTasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== 'completed';
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Reportes y Estadísticas</h1>
          <p className="text-sm text-muted-foreground">
            Analiza el progreso y rendimiento de tus tareas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm text-muted-foreground">Total de Tareas</h3>
            </div>
            <p className="text-3xl text-foreground">{totalTasks}</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-sm text-muted-foreground">Tasa de Completación</h3>
            </div>
            <p className="text-3xl text-primary">{completionRate}%</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flag className="w-5 h-5 text-red-500" />
              <h3 className="text-sm text-muted-foreground">Alta Prioridad</h3>
            </div>
            <p className="text-3xl text-red-500">{highPriorityTasks}</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm text-muted-foreground">Vencidas</h3>
            </div>
            <p className="text-3xl text-yellow-500">{overdueTasks}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg text-foreground mb-1">Estado de Tareas</h3>
              <p className="text-sm text-muted-foreground">
                Distribución por estado actual
              </p>
            </div>

            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#c9d1d9',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg text-foreground mb-1">Tareas por Estado</h3>
              <p className="text-sm text-muted-foreground">
                Comparativa de tareas por estado
              </p>
            </div>

            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#c9d1d9',
                    }}
                  />
                  <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg text-foreground mb-1">Tareas por Prioridad</h3>
              <p className="text-sm text-muted-foreground">
                Distribución según nivel de prioridad
              </p>
            </div>

            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#c9d1d9',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#3b82f6" name="Total" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completadas" fill="#10b981" name="Completadas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </Card>

          {tasksByMonth.length > 0 && (
            <Card className="bg-card border-border p-6">
              <div className="mb-6">
                <h3 className="text-lg text-foreground mb-1">Tendencia Mensual</h3>
                <p className="text-sm text-muted-foreground">
                  Tareas creadas vs completadas por mes
                </p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tasksByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis 
                    dataKey="mes" 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#8b949e"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      color: '#c9d1d9',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="creadas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Creadas"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completadas"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Completadas"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {tasks.length > 0 && (
          <Card className="bg-card border-border p-6">
            <div className="mb-6">
              <h3 className="text-lg text-foreground mb-1">Resumen de Productividad</h3>
              <p className="text-sm text-muted-foreground">
                Estadísticas detalladas de tu desempeño
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tareas Activas</p>
                <p className="text-2xl text-foreground">{pendingTasks + inProgressTasks}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? ((pendingTasks + inProgressTasks) / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl text-foreground">{pendingTasks}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500 transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl text-foreground">{inProgressTasks}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl text-primary">{completedTasks}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {tasks.length === 0 && (
          <Card className="bg-card border-border p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg text-foreground mb-2">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground">
                Crea algunas tareas para ver estadísticas y reportes detallados
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}