'use client'

import { supabase } from '@/utils/supabaseClient'
import { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { Trash } from 'lucide-react'
import { Task } from '@/types/Task'


interface TaskCardProps {
  task: Task
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
  onTaskCreated: (task: Task) => void
  askAISuggestions: (completedTitle: string) => void
}

export default function TaskCard({ task, onTaskUpdated, onTaskDeleted, onTaskCreated, askAISuggestions}: TaskCardProps) {
  const [pendingDone, setPendingDone] = useState(false)
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const hasDueDate = !!task.due_date;

  // Mark task as completed
  const handleComplete = () => {
    setPendingDone(true)

    const timeout = setTimeout(async () => {
      const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', task.id)
      .select()
      .single()

      if (error || !updatedTask) {
        console.error('Error marking task as completed:', error)
        setPendingDone(false)
        setUndoTimeout(null)
        return
      }

      onTaskUpdated(updatedTask)
      setPendingDone(false)
      setUndoTimeout(null)

      askAISuggestions(updatedTask.title)

    }, 1000)

    setUndoTimeout(timeout)
  }

  const handleUndo = () => {
    if (undoTimeout) {
      clearTimeout(undoTimeout)
      setUndoTimeout(null)
    }
    setPendingDone(false)
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
    <div className="relative bg-white p-4 rounded shadow h-full flex flex-col">
      
      <button
          onClick={() => setIsConfirmOpen(true)}
          className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <Trash size={18} />
      </button>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-black">{task.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-3">{task.description}</p>
        {hasDueDate && (
          <p className="text-sm text-gray-500 mb-2">
            Due: {task.due_date && new Date(task.due_date).toLocaleString()}
          </p>
        )}
        <p className="text-sm text-gray-700">
          Priority: {task.priority}
        </p>
        <p className={`text-sm font-semibold ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
          {task.completed ? 'Completed' : 'Incomplete'}
        </p>
      </div>
      
      {!task.completed && (
        <div className="pt-2">
          {pendingDone ? (
            <button
              onClick={handleUndo}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Undo
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mark as Done
            </button>
          )}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />

    </div>

  )
}
