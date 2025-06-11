'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import NewTaskButton from "@/components/NewTaskButton";
import TaskCard from '@/components/TaskCard';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([])
  
  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data,
        error
      } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true })

      if (error) {
        console.error('Error fetching tasks:', error)
      } else {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
      <NewTaskButton />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
    </div>
  )
}
