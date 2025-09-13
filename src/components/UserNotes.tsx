import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { USER_NOTES } from '../data/StorageKeys'

interface UserNotesProps {
  className?: string
}

export const UserNotes = ({ className }: UserNotesProps) => {
  const { t } = useTranslation()
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem(USER_NOTES)
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem(USER_NOTES, newNotes)
  }

  return (
    <div className={className}>
      <div className="flex flex-row justify-between gap-4 mb-4">
        <h2>{t('notes.title')}</h2>
      </div>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder={t('notes.placeholder')}
        className="w-full h-32 p-3 bg-zinc-800 border border-zinc-700 rounded-md 
          text-white text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}