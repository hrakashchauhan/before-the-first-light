import { useEffect } from 'react'
import { MessageSquare, ArrowRight } from 'lucide-react'

interface DialogueBoxProps {
  speaker: string
  text: string
  onClose: () => void
}

export function DialogueBox({ speaker, text, onClose }: DialogueBoxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e' || e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="dialogue-backdrop" onClick={onClose}>
      <div className="dialogue-card" onClick={(e) => e.stopPropagation()}>
        <div className="dialogue-speaker-badge">
          <MessageSquare size={14} />
          <span>{speaker}</span>
        </div>
        <p className="dialogue-text">{text}</p>
        <button type="button" className="dialogue-continue-btn" onClick={onClose}>
          <span>Continue</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
