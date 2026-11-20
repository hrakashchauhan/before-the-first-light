import { ArrowRight, MessageCircle } from 'lucide-react'
import { GameDialog } from './GameDialog'
interface Props { speaker: string; text: string; continueLabel: string; onClose: () => void }
export function DialogueBox({ speaker, text, continueLabel, onClose }: Props) {
  return <GameDialog titleId="speaker-name" className="conversation" onClose={onClose}
    onKeyDown={(event) => {
      if (event.key.toLowerCase() === 'e' && !event.repeat) { event.preventDefault(); event.stopPropagation(); onClose() }
    }}>
    <div className="speaker-line"><MessageCircle size={15}/><h2 id="speaker-name">{speaker}</h2></div>
    <p>{text}</p>
    <button className="text-button" autoFocus onClick={onClose}>{continueLabel}<ArrowRight size={15}/></button>
  </GameDialog>
}
