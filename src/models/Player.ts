import { Character } from './Character'

export interface Player {
  id: number
  name: string
  discord?: string
  discordId?: string
  characters: Character[]
}
