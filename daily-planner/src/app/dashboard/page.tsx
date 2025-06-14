'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import NewTaskButton from "@/components/NewTaskButton";
import TaskCard from '@/components/TaskCard';
import { getSuggestedTasks } from '@/utils/huggingFaceClient';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
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

  // Callback to add new task to the list
  const handleTaskCreated = (newTask: any) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdate = (updatedTask: any) => {
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    )
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleAddSuggestion = async (title: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ title })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    // push into task list
    setTasks(prev => [...prev, data])

    // remove from suggestions list
    setSuggestions(prev => prev.filter(t => t !== title))
  }

  const askAISuggestions = async (completedTitle: string) => {
    setIsLoadingSuggestions(true)
    const aiList = await getSuggestedTasks(completedTitle)

    // filter out duplicates
    const already = new Set(tasks.map(t => t.title))
    const deduped = aiList.filter(t => !already.has(t))

    setSuggestions(deduped)
    setIsLoadingSuggestions(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
      <NewTaskButton onTaskCreated={handleTaskCreated} />
      
      <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task}
            onTaskUpdated={handleTaskUpdate}
            onTaskDeleted={handleTaskDelete} 
            onTaskCreated={handleTaskCreated}
            askAISuggestions={askAISuggestions}
          />
        ))}
      </div>

      {isLoadingSuggestions && (
        <div className="flex items-center mt-8 text-gray-500 animate-pulse">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" />
            <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" opacity=".75" />
          </svg>
          Generating task suggestions...
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="relative mt-10">
          <h2 className="text-xl font-semibold mb-3">AI Suggested Tasks</h2>
          <div className="text-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 bg-gray-50 border rounded flex flex-col">
                <p className="flex-grow">{s}</p>
                <button
                  onClick={() => handleAddSuggestion(s)}
                  className="mt-4 self-start px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Add to My Tasks
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  )
}
