import { Dialog } from '@headlessui/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FloatingInput } from '../controls/FloatingInput'

interface NewPlayerModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialName?: string
  initialDiscord?: string
  initialDiscordId?: string
  onSave: (data: { name: string; discord?: string; discordId?: string }) => void
}

export const EditPlayerModal = ({
  open,
  onClose,
  onSave,
  mode = 'edit',
  initialName,
  initialDiscord,
  initialDiscordId,
}: NewPlayerModalProps) => {
  const { t } = useTranslation()
  const [name, setName] = useState(initialName ?? '')
  const [discord, setDiscord] = useState(initialDiscord ?? '')
  const [discordId, setDiscordId] = useState(initialDiscordId ?? '')

  useEffect(() => {
    if (open) {
      setName(initialName ?? '')
      setDiscord(initialDiscord ?? '')
      setDiscordId(initialDiscordId ?? '')
    }
  }, [open, initialName, initialDiscord, initialDiscordId])

  const resetData = () => {
    setName(initialName ?? '')
    setDiscord(initialDiscord ?? '')
    setDiscordId(initialDiscordId ?? '')
  }

  const handleClose = () => {
    resetData()
    onClose()
  }

  const handleSave = () => {
    onSave({ name, discord: discord || undefined, discordId: discordId || undefined })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-zinc-900 text-white rounded-xl p-6 space-y-4 shadow-xl">
          <Dialog.Title className="text-lg font-semibold">
            <div className={'flex flex-row justify-between'}>
              {mode == 'edit' ? t('modal.editPlayer.title') : t('modal.newPlayer.title')}

              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </Dialog.Title>

          <FloatingInput
            id="player-name"
            label={t('modal.newPlayer.name.label')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FloatingInput
            id="player-discord"
            label={t('modal.newPlayer.discord.label')}
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
          <FloatingInput
            id="player-discord-id"
            label={t('modal.newPlayer.discordId.label')}
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleClose}
              className="text-sm text-zinc-400 hover:text-white transition cursor-pointer"
            >
              {t('modal.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('modal.save')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
