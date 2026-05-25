import { Modal, Button } from '../ui'

export default function ResumeSprintModal({ isOpen, onResume, onDiscard, subject, elapsed, duration }) {
  const remainingMin = Math.ceil((duration * 60 - elapsed) / 60)

  return (
    <Modal isOpen={isOpen} onClose={onDiscard} title="Sessão em andamento">
      <p className="text-sm text-foreground-secondary">
        Encontramos um sprint salvo localmente
        {subject ? ` (${subject})` : ''}. Faltam ~{remainingMin} min. Deseja retomar?
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onDiscard}>
          Descartar
        </Button>
        <Button className="flex-1" onClick={onResume}>
          Retomar
        </Button>
      </div>
    </Modal>
  )
}
