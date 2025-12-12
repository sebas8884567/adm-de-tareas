import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import { api } from './utils/api';
import { toast } from 'sonner';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { Profile } from './components/Profile';
import type { Task } from './utils/api';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'reports' | 'profile';

interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token && session?.user) {
          const userData: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
            email: session.user.email || '',
          };
          setUser(userData);
          setAccessToken(session.access_token);
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoadingSession(false);
      }
    };

    checkSession();
  }, []);

  // Load tasks when user is authenticated
  useEffect(() => {
    console.log('🔄 useEffect triggered, accessToken:', accessToken ? 'present' : 'null');
    
    const loadTasks = async () => {
      if (!accessToken) {
        return; // Don't clear tasks here to avoid flickering
      }

      setIsLoadingTasks(true);
      try {
        const tasksData = await api.getTasks(accessToken);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Error al cargar las tareas');
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [accessToken]);

  const handleLogin = async (email: string, password: string) => {
    // This is now called after successful login from Login component
    // The session should already be established by signInWithPassword
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data?.session?.access_token && data?.session?.user) {
        console.log('Login successful, setting user and token');
        console.log('User ID:', data.session.user.id);
        const userData: User = {
          id: data.session.user.id,
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'Usuario',
          email: data.session.user.email || '',
        };
        setUser(userData);
        setAccessToken(data.session.access_token);
        setCurrentPage('dashboard');
        
        // Force reload tasks after setting token
        console.log('About to load tasks for user:', data.session.user.id);
      } else {
        console.error('No session found after login');
        toast.error('Error al obtener la sesión');
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      toast.error('Error al procesar el inicio de sesión');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Registration is handled in Register component
    // Just navigate to login after successful registration
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setTasks([]);
      setCurrentPage('home');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!accessToken) {
      toast.error('Debes iniciar sesión para agregar tareas');
      return;
    }

    try {
      console.log('🔵 Creating task...');
      const newTask = await api.createTask(accessToken, taskData);
      console.log('✅ Task created:', newTask);
      
      // Reload tasks from server instead of updating local state
      console.log('🔵 Reloading tasks from server...');
      const updatedTasks = await api.getTasks(accessToken);
      console.log('✅ Tasks reloaded, count:', updatedTasks.length);
      console.log('📋 Tasks data:', updatedTasks);
      
      setTasks(updatedTasks);
      console.log('✅ State updated with', updatedTasks.length, 'tasks');
      
      toast.success('Tarea agregada exitosamente');
    } catch (error) {
      console.error('❌ Error adding task:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar la tarea';
      toast.error(errorMessage);
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    if (!accessToken) {
      toast.error('Debes iniciar sesión para editar tareas');
      return;
    }

    try {
      await api.updateTask(accessToken, updatedTask.id, updatedTask);
      // Reload tasks from server instead of updating local state
      const updatedTasks = await api.getTasks(accessToken);
      setTasks(updatedTasks);
      toast.success('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!accessToken) {
      toast.error('Debes iniciar sesión para eliminar tareas');
      return;
    }

    try {
      await api.deleteTask(accessToken, id);
      // Reload tasks from server instead of updating local state
      const updatedTasks = await api.getTasks(accessToken);
      setTasks(updatedTasks);
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleUpdateProfile = (name: string, email: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    toast.success('Perfil actualizado exitosamente');
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user && currentPage === 'home') {
    return (
      <>
        <Home onNavigateToLogin={() => setCurrentPage('login')} />
        <Toaster />
      </>
    );
  }

  if (!user && currentPage === 'login') {
    return (
      <>
        <Login onLogin={handleLogin} onNavigateToRegister={() => setCurrentPage('register')} />
        <Toaster />
      </>
    );
  }

  if (!user && currentPage === 'register') {
    return (
      <>
        <Register onRegister={handleRegister} onNavigateToLogin={() => setCurrentPage('login')} />
        <Toaster />
      </>
    );
  }

  if (!user) {
    setCurrentPage('home');
    return null;
  }

  return (
    <>
      <Navbar
        currentPage={currentPage}
        userName={user.name}
        onNavigate={(page) => setCurrentPage(page as Page)}
        onLogout={handleLogout}
      />

      {isLoadingTasks && currentPage === 'dashboard' ? (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando tareas...</p>
          </div>
        </div>
      ) : (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentPage === 'reports' && <Reports tasks={tasks} />}

          {currentPage === 'profile' && (
            <Profile user={user} tasks={tasks} onUpdateProfile={handleUpdateProfile} />
          )}
        </>
      )}

      <Toaster />
    </>
  );
}

export default App;