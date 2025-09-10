import { Pencil, Trash, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Character } from '../../models/Character'
import { Player } from '../../models/Player'
import { ConfirmModal } from '../modals/ConfirmModal'
import { EditCharacterModal } from '../modals/EditCharacterModal'
import { EditPlayerModal } from '../modals/EditPlayerModal'
import { AddNewCharacterCard } from './AddNewCharacterCard'
import { CharacterCard } from './CharacterCard'

type PlayerCardProps = {
  player: Player
  onUpdatePlayer: () => void
  onDeletePlayer: () => void
}

export const PlayerCard = ({ player, onUpdatePlayer, onDeletePlayer }: PlayerCardProps) => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false)
  const [editPlayerModalOpen, setEditPlayerModalOpen] = useState(false)

  const handleAddCharacter = (char: Character) => {
    player.characters = [...player.characters, char]
    onUpdatePlayer()
  }

  return (
    <div className={'card'}>
      <div className={'flex flex-col gap-4'}>
        <div className={'flex flex-row justify-between gap-2'}>
          <div className={'flex flex-row gap-2'}>
            <UserRound className="w-6 h-6" />
            <h2 className="text-sm font-medium">{player.name}</h2>
          </div>
          <div className={'flex flex-row items-center gap-1'}>
            <button
              onClick={() => setEditPlayerModalOpen(true)}
              className="p-1 h-5 w-5 rounded hover:text-white text-zinc-400 hover:bg-zinc-700 transition cursor-pointer"
              title={t('tooltip.editCharacter')}
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDeleteConfirmationModalOpen(true)}
              className="p-1 h-5 w-5 rounded hover:text-white text-zinc-400 hover:bg-red-900 transition cursor-pointer"
              title={t('tooltip.deletePlayer')}
            >
              <Trash className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className={'flex flex-col gap-2'}>
          {player.characters.map((char, idx) => (
            <CharacterCard
              key={idx}
              char={char}
              onUpdateChar={(char) => {
                player.characters[idx] = char
                onUpdatePlayer()
              }}
              onToggleActive={() => {
                player.characters[idx].active = !player.characters[idx].active
                onUpdatePlayer()
              }}
              onDeleteChar={() => {
                player.characters.splice(idx, 1)
                onUpdatePlayer()
              }}
            />
          ))}
          <AddNewCharacterCard onClick={() => setShowModal(true)} />
          <EditCharacterModal
            mode={'create'}
            open={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleAddCharacter}
          />
          <EditPlayerModal
            open={editPlayerModalOpen}
            mode={'edit'}
            initialName={player.name}
            initialDiscord={player.discord}
            initialDiscordId={player.discordId}
            onClose={() => setEditPlayerModalOpen(false)}
            onSave={({ name, discord, discordId }) => {
              player.name = name
              player.discord = discord
              player.discordId = discordId
              onUpdatePlayer()
            }}
          />
          <ConfirmModal
            open={deleteConfirmationModalOpen}
            onClose={() => setDeleteConfirmationModalOpen(false)}
            onSave={onDeletePlayer}
            title={t('confirm.modal.delete.player.title')}
            bodyText={t('confirm.modal.delete.player.description')}
            yesLabel={t('confirm.modal.delete.player.delete')}
            noLabel={t('confirm.modal.delete.player.cancel')}
            yesBtnClassNames={'bg-red-900 hover:bg-red-700'}
          />
        </div>
      </div>
    </div>
  )
}
