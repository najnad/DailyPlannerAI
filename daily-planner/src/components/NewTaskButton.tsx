'use client'

import { useState } from 'react'
import TaskFormModal from './TaskFormModal'
import { Plus } from 'lucide-react'
import { Task } from '@/types/Task';

interface Props {
  onTaskCreated: (task: Task) => void;

}

export default function NewTaskButton({ onTaskCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Add new task"
      >
        <Plus className="w-6 h-6"/>
      </button>
      <TaskFormModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onTaskCreated={onTaskCreated} />
    </>
  )
}