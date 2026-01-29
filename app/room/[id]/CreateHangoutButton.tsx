"use client";

import { useState } from "react";
import CreateHangoutModal from "./CreateHangoutModal";

interface CreateHangoutButtonProps {
  roomId: string;
  className?: string;
  children: React.ReactNode;
}

export default function CreateHangoutButton({
  roomId,
  className,
  children,
}: CreateHangoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      <CreateHangoutModal
        roomId={roomId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
