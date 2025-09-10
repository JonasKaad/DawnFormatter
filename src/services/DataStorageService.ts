import { CURRENT_TEAM, TEAMS, USE_DISCORD_ID } from '../data/StorageKeys'
import { Teams } from '../data/Teams'

export interface StoredTeamsData {
  teams: Teams
  currentTeam: string
}

export class DataStorageService {
  static NEW_TEAM_NAME = 'New Team'
  static loadTeamsFromLocalStorage(): StoredTeamsData {
    const teamDataString = localStorage.getItem(TEAMS)
    const loadedTeams: Teams = teamDataString ? JSON.parse(teamDataString) : []
    return this.loadTeamAndCurrentWithFallback(loadedTeams, localStorage.getItem(CURRENT_TEAM))
  }

  static loadTeamAndCurrentWithFallback(
    loadedTeams: Teams,
    possibleCurrentTeam: string | null
  ): StoredTeamsData {
    let currentTeam = DataStorageService.NEW_TEAM_NAME

    try {
      const teamKeys = Object.keys(loadedTeams ?? {})

      const firstLocalTeamKey = teamKeys.length > 0 ? teamKeys[0] : null
      if (possibleCurrentTeam && !teamKeys.some((k) => k === possibleCurrentTeam)) {
        possibleCurrentTeam = firstLocalTeamKey
      }
      currentTeam = possibleCurrentTeam || firstLocalTeamKey || DataStorageService.NEW_TEAM_NAME
    } catch (e) {
      console.error(e)
      loadedTeams = {}
      currentTeam = DataStorageService.NEW_TEAM_NAME
    }

    const teamKeys = Object.keys(loadedTeams)
    if (teamKeys.length <= 0) {
      loadedTeams[DataStorageService.NEW_TEAM_NAME] = []
    }
    if (!teamKeys.some((k) => k == currentTeam)) {
      currentTeam = DataStorageService.NEW_TEAM_NAME
    }

    return {
      teams: loadedTeams,
      currentTeam: currentTeam,
    }
  }

  static saveTeams(teams: Teams): void {
    localStorage.setItem(TEAMS, JSON.stringify(teams))
  }

  static saveCurrentTeamKey(currentTeamKey: string): void {
    localStorage.setItem(CURRENT_TEAM, currentTeamKey)
  }

  static saveUseDiscordId(useDiscordId: boolean): void {
    localStorage.setItem(USE_DISCORD_ID, String(useDiscordId))
  }

  static loadUseDiscordIdFromLocalStorage(): boolean {
    const savedValue = localStorage.getItem(USE_DISCORD_ID)
    return savedValue === 'true'
  }
}
