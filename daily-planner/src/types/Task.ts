export interface Task {
  id: string                 // Unique task ID 
  user_id: string            // Foreign key to the user
  title: string              // Short task title
  description?: string       // Optional detailed notes
  due_date?: string          // Optional date (ISO string)
  completed: boolean         // Status: is task done?
  priority?: 'low' | 'medium' | 'high'  // Optional importance level
  created_at?: string        // Supabase timestamp
}