'use client'

import { supabase } from '@/utils/supabaseClient'

interface TaskCardProps {
  task: any
  onTaskUpdated: (task: any) => void
  onTaskDeleted: (taskId: string) => void
}

export default function TaskCard({ task, onTaskUpdated, onTaskDeleted }: TaskCardProps) {

  // Mark task as completed
  const handleComplete = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', task.id)
      .select()
      .single()

    if (error) {
      console.error('Failed to mark complete:', error.message)
    } else {
      onTaskUpdated(data)
    }
  }

  // Delete task
  const handleDelete = async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)

    if (error) {
      console.error('Failed to delete task:', error.message)
    } else {
      onTaskDeleted(task.id)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-2">
      <h3 className="text-lg font-semibold text-black">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500">
        Due: {new Date(task.due_date).toLocaleString()}
      </p>
      <p className="text-sm text-gray-700">
        Priority: {task.priority}
      </p>
      <p className={`text-sm font-semibold ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
        {task.completed ? 'Completed' : 'Incomplete'}
      </p>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {!task.completed && (
          <button
            onClick={handleComplete}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Mark as Done
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
