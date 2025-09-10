import i18n from 'i18next'

import { ArmorSlot } from '../data/AmorSlot'
import { Class, CLASS_ICONS } from '../data/Class'
import { FACTION_ICONS } from '../data/Faction'
import { ROLE_ICONS } from '../data/Roles'
import { Character } from '../models/Character'
import { Player } from '../models/Player'
const groupSizeLabels: Record<number, string> = {
  1: 'SOLO',
  2: 'DUO',
  3: 'TRIO',
  4: 'TEAM TAKE',
}

export class DiscordFormatService {
  static formatScore(score: number): string {
    return (Math.round(score / 100) / 10).toFixed(1) + 'k'
  }

  static formatTeam(
    players: Player[],
    classTranslations: Record<Class, string>,
    armorSlotTranslations: Record<ArmorSlot, string>,
    translateFn: (key: string) => string,
    useDiscordId: boolean = false
  ): string {
    const activePlayers = players.filter((p) => p.characters.filter((c) => c.active).length > 0)
    if (activePlayers.length < 1) {
      return translateFn('no.players.active')
    }

    const header = groupSizeLabels[activePlayers.length]
    let output = `${header} ${activePlayers.length === 1 ? ' ' : '\n\n '}`
    const playerDescriptions = activePlayers
      .map((p, idx) =>
        this.formatPlayer(
          p,
          classTranslations,
          armorSlotTranslations,
          translateFn,
          useDiscordId,
          activePlayers.length === 1 ? undefined : idx + 1
        )
      )
      .join('\n\n')
    output += playerDescriptions + '\n'
    return output
  }

  static formatPlayer(
    player: Player,
    classTranslations: Record<Class, string>,
    armorSlotTranslations: Record<ArmorSlot, string>,
    translateFn: (key: string) => string,
    useDiscordId: boolean = false,
    number?: number
  ): string {
    if (player.characters.length < 1) {
      return ''
    }

    const highestScore = DiscordFormatService.formatScore(
      Math.max(...player.characters.filter((c) => c.active).map((c) => c.rioScore))
    )

    const playerInfo = number ? `Player${number} ` : ''


    let playerDiscord = player.discord !== undefined ? `@${player.discord} ` : `<@${player.discordId}>`

    if (useDiscordId && player.discordId) {
      playerDiscord = `<@${player.discordId}> `
    } else if (player.discord) {
      playerDiscord = `@${player.discord} `
    } 

    const header = `${playerInfo}${playerDiscord}:Raiderio: ${highestScore}`
    const characterLines = player.characters
      .filter((c) => c.active)
      .map((c) =>
        this.formatCharacterLine(c, classTranslations, armorSlotTranslations, translateFn)
      )

    return [header, ...characterLines].join('\n')
  }

  static formatCharacterLine(
    char: Character,
    classTranslations: Record<Class, string>,
    armorSlotTranslations: Record<ArmorSlot, string>,
    translateFn: (key: string) => string
  ): string {
    const classIcon = CLASS_ICONS[char.class] ?? ':question:'
    const faction = FACTION_ICONS[char.faction]
    const dungeon = char.keystone.dungeon
    const armor = char.tradeAllArmor
      ? translateFn('trade.all.armor')
      : `${translateFn('trade.all.armor.except')}${char.cantTrade
          .map((at) => armorSlotTranslations[at])
          .join(', ')}`

    const roleIcons = [...new Set(char.roles)].map((r) => ROLE_ICONS[r])

    const classWidth = 40
    const dungeonWidth = 25
    const ilvlWidth = 12

    return roleIcons
      .map((role) => {
        const roleCol = role
        const classCol = (classIcon + ' ' + classTranslations[char.class]).padEnd(classWidth, ' ')
        const factionCol = faction

        const keystone = char.keystoneAvailable
          ? `:Keystone: +${char.keystone.level} ${dungeon}`
          : `:Keystone: ${translateFn('keystone.not.available')}`
        const dungeonCol = keystone.padEnd(dungeonWidth, '  ')
        const ilvlCol = `:gear: ${char.iLvl}`.padEnd(ilvlWidth, ' ')
        const armorCol = `:Armor: ${armor}`
        const rioCol = `:Raiderio: ${this.formatScore(char.rioScore)}`

        return `${roleCol} ${factionCol}${classCol} ${dungeonCol} ${ilvlCol} ${rioCol} ${armorCol}`
      })
      .join('\n')
  }
}

export const KEYS_FOR_MARKING = [
  i18n.t('trade.all.armor'),
  i18n.t('trade.all.armor.except'),
  i18n.t('no.players.active'),
  i18n.t('keystone.not.available'),
]
