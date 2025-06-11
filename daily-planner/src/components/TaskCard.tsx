'use client'

import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TaskCard({ task }: { task: any }) {
  const router = useRouter()

  const handleDelete = async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task.id)

    if (error) {
      console.error('Delete error:', error)
    } else {
      router.refresh() // 🔄 Refresh the page to reflect deletion
    }
  }

  const handleToggleComplete = async () => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id)

    if (error) {
      console.error('Update error:', error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-700">{task.description}</p>
      <p className="text-sm text-gray-500">
        Due: {new Date(task.due_date).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">Priority: {task.priority}</p>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleToggleComplete}
          className={`px-3 py-1 rounded text-white ${
            task.is_completed ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        >
          {task.is_completed ? 'Completed' : 'Mark as Done'}
        </button>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
