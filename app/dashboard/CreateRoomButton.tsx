'use client'

import { useState } from 'react'
import CreateRoomModal from './CreateRoomModal'

interface CreateRoomButtonProps {
  children: React.ReactNode
  className?: string
}

export default function CreateRoomButton({ children, className }: CreateRoomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children}
      </button>
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
