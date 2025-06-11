'use client'

import { useState } from 'react'
import TaskFormModal from './TaskFormModal'

export default function NewTaskButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + New Task
      </button>
      <TaskFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}