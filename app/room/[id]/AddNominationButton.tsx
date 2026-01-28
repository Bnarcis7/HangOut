'use client'

import { useState } from 'react'
import AddNominationModal from './AddNominationModal'

interface AddNominationButtonProps {
  roomId: string
  roomType: string
  nominationLabel: string
  className?: string
  children: React.ReactNode
}

export default function AddNominationButton({
  roomId,
  roomType,
  nominationLabel,
  className,
  children,
}: AddNominationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>
      <AddNominationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        roomId={roomId}
        roomType={roomType}
        nominationLabel={nominationLabel}
      />
    </>
  )
}
