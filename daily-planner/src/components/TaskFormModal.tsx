'use client'

import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;

}

export default function TaskFormModal({ isOpen, onClose, onTaskCreated }: TaskFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
    data: { user },
    error: userError,
    } = await supabase.auth.getUser()

    if (!user || userError) {
      alert('You must be logged in to create a task.')
      return
    }

    const { data, error } = await supabase.from('tasks').insert([
      {
        title,
        description,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        user_id: user.id,
      }
    ]).select().single()

    if (error) {
      console.error('Error creating task:', error.message)
      alert('Failed to create task.')
      return
    } else {
      onTaskCreated(data);
    }

    // Reset and close modal
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <Dialog.Panel className="bg-white rounded-lg p-6 z-10 w-full max-w-md mx-auto">
        <Dialog.Title className="text-xl text-black font-semibold mb-4">Create New Task</Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded text-black"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded text-black"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full border p-2 rounded text-black"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded text-black"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Task
            </button>
            
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  )
}