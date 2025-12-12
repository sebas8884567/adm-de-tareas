import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-58e5341d/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-58e5341d/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: "Missing required fields: name, email, password" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user during signup:', error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email, 
        name: data.user.user_metadata.name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: `Signup failed: ${error}` }, 500);
  }
});

// Get all tasks for authenticated user
app.get("/make-server-58e5341d/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('No access token provided in get tasks request');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error('Authorization error while getting tasks:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('Fetching tasks for user:', user.id);
    const prefix = `user:${user.id}:task:`;
    const taskData = await kv.getByPrefix(prefix);
    
    console.log(`Found ${taskData.length} tasks for user ${user.id}`);
    // getByPrefix already returns the values, no need to map again
    const tasks = taskData.filter(task => task !== null);
    
    return c.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return c.json({ error: `Failed to fetch tasks: ${error}` }, 500);
  }
});

// Create a new task
app.post("/make-server-58e5341d/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('No access token provided in create task request');
      return c.json({ error: 'No authorization token provided' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('Authorization error while creating task:', authError);
      return c.json({ error: `Unauthorized: ${authError.message}` }, 401);
    }

    if (!user?.id) {
      console.error('No user ID found after auth check');
      return c.json({ error: 'Unauthorized: No user found' }, 401);
    }

    const taskData = await c.req.json();
    console.log('Creating task for user:', user.id, 'with data:', taskData);
    
    const taskId = Date.now().toString();
    
    const newTask = {
      ...taskData,
      id: taskId,
      createdAt: new Date().toISOString(),
    };

    const key = `user:${user.id}:task:${taskId}`;
    await kv.set(key, newTask);
    
    console.log('Task created successfully:', newTask);
    return c.json({ task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: `Failed to create task: ${error}` }, 500);
  }
});

// Update a task
app.put("/make-server-58e5341d/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error('Authorization error while updating task:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');
    const taskData = await c.req.json();
    
    const key = `user:${user.id}:task:${taskId}`;
    const existingTask = await kv.get(key);
    
    if (!existingTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    const updatedTask = {
      ...existingTask,
      ...taskData,
      id: taskId,
    };

    await kv.set(key, updatedTask);
    
    return c.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ error: `Failed to update task: ${error}` }, 500);
  }
});

// Delete a task
app.delete("/make-server-58e5341d/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.error('Authorization error while deleting task:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');
    const key = `user:${user.id}:task:${taskId}`;
    
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return c.json({ error: `Failed to delete task: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);