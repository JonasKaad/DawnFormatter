export enum Class {
  DeathKnight = 'death-knight',
  DemonHunter = 'demon-hunter',
  Druid = 'druid',
  Evoker = 'evoker',
  Hunter = 'hunter',
  Mage = 'mage',
  Monk = 'monk',
  Paladin = 'paladin',
  Priest = 'priest',
  Rogue = 'rogue',
  Shaman = 'shaman',
  Warlock = 'warlock',
  Warrior = 'warrior',
}

export function useClassTranslations(t: (key: string) => string): Record<Class, string> {
  return {
    [Class.DeathKnight]: t('class.deathKnight'),
    [Class.DemonHunter]: t('class.demonHunter'),
    [Class.Druid]: t('class.druid'),
    [Class.Evoker]: t('class.evoker'),
    [Class.Hunter]: t('class.hunter'),
    [Class.Mage]: t('class.mage'),
    [Class.Monk]: t('class.monk'),
    [Class.Paladin]: t('class.paladin'),
    [Class.Priest]: t('class.priest'),
    [Class.Rogue]: t('class.rogue'),
    [Class.Shaman]: t('class.shaman'),
    [Class.Warlock]: t('class.warlock'),
    [Class.Warrior]: t('class.warrior'),
  }
}

export const CLASS_ICONS: Record<Class, string> = {
  [Class.DeathKnight]: ':deathknight:',
  [Class.DemonHunter]: ':demonhunter:',
  [Class.Druid]: ':druid:',
  [Class.Evoker]: ':evoker:',
  [Class.Hunter]: ':hunter:',
  [Class.Mage]: ':Mage:',
  [Class.Monk]: ':monk:',
  [Class.Paladin]: ':Paladin:',
  [Class.Priest]: ':priest:',
  [Class.Rogue]: ':rogue:',
  [Class.Shaman]: ':shaman:',
  [Class.Warlock]: ':warlock:',
  [Class.Warrior]: ':warrior:',
}
