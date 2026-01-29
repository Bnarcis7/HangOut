'use client'

import { useState } from 'react'
import AddNominationModal from './AddNominationModal'

interface AddNominationButtonProps {
  hangoutId: string
  hangoutType: string
  nominationLabel: string
  className?: string
  children: React.ReactNode
}

export default function AddNominationButton({
  hangoutId,
  hangoutType,
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
        hangoutId={hangoutId}
        hangoutType={hangoutType}
        nominationLabel={nominationLabel}
      />
    </>
  )
}
