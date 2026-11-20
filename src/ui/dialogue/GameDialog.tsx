import { useEffect, useRef, type ReactNode, type KeyboardEvent } from 'react'
interface Props {
  titleId: string
  className?: string
  onClose: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void
  children: ReactNode
}
export function GameDialog({ titleId, className = '', onClose, onKeyDown, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return <dialog ref={dialogRef} className={`game-dialog ${className}`} aria-labelledby={titleId} aria-modal="true"
    onKeyDown={onKeyDown} onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => {
      if (event.target !== event.currentTarget) return
      const box = event.currentTarget.getBoundingClientRect()
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
    }}>{children}</dialog>
}
