import { Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddNewPlayerCard } from './components/cards/AddNewPlayerCard'
import { PlayerCard } from './components/cards/PlayerCard'
import { FloatingSelect } from './components/controls/FloatingSelect'
import { ImportExportButtons } from './components/controls/ImportExportButtons'
import { Language, languages, LanguageSwitcher } from './components/controls/LanguageSwitcher'
import { Footer } from './components/Footer'
import { MarkdownOutput } from './components/MarkdownOutput'
import { ConfirmModal } from './components/modals/ConfirmModal'
import { EditPlayerModal } from './components/modals/EditPlayerModal'
import { EditTeamModal } from './components/modals/EditTeamModal'
import { useArmorSlotTranslations } from './data/AmorSlot'
import { useClassTranslations } from './data/Class'
import { Teams } from './data/Teams'
import i18nOutput from './i18nOutput'
import { Player } from './models/Player'
import { DataStorageService } from './services/DataStorageService'
import { DiscordFormatService } from './services/DiscordFormatService'

export default function App() {
  // const test: Player[] = [
  //   {
  //     discord: 'McAlihe',
  //     name: 'Michael',
  //     id: 123,
  //     characters: [
  //       {
  //         name: 'Nerfblaster',
  //         realm: 'Blackhand',
  //         rioScore: 3300,
  //         active: true,
  //         class: Class.Hunter,
  //         iLvl: 682,
  //         keystoneAvailable: true,
  //         keystone: { dungeon: DungeonId.ML, level: 12 },
  //         tradeAllArmor: true,
  //         cantTrade: [],
  //         roles: [Role.DPS],
  //         faction: Faction.Horde,
  //         source: 'manual',
  //         specs: [Spec.Marksmanship],
  //       },
  //     ],
  //   },
  // ]

  const storedTeamsData = DataStorageService.loadTeamsFromLocalStorage()

  const { t } = useTranslation()
  const [teams, setTeams] = useState<Teams>(storedTeamsData.teams)
  const [currentTeamKey, setCurrentTeamKey] = useState<string>(storedTeamsData.currentTeam)

  console.log(teams[currentTeamKey])

  const [players, setPlayers] = useState<Player[]>(teams[currentTeamKey] ?? [])
  const [output, setOutput] = useState<string>()
  const [outputLanguage, setOutputLanguage] = useState<Language>(languages[0])
  const [showModal, setShowModal] = useState(false)
  const AddNewPlayer = (name: string, discord?: string) => {
    const highestId = Math.max(...players.map((o) => o.id))
    const newId = highestId != -Infinity ? highestId + 1 : 0
    const newPlayers = [...players, { id: newId, name: name, discord: discord, characters: [] }]
    setPlayers(newPlayers)
    teams[currentTeamKey] = newPlayers
    setTeams({ ...teams })
  }

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false)
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false)
  const [editTeamModalMode, setEditTeamModalMode] = useState<'edit' | 'create'>('edit')

  const onDeleteTeam = (team: string) => {
    delete teams[team]
    setTeams({ ...teams })

    if (Object.keys(teams).length <= 0) {
      teams[DataStorageService.NEW_TEAM_NAME] = []
      setPlayers([])
      setTeams({ ...teams })
    }
    setCurrentTeamKey(Object.keys(teams)[0])
  }

  useEffect(() => {
    DataStorageService.saveTeams(teams)
  }, [players, teams])

  useEffect(() => {
    DataStorageService.saveCurrentTeamKey(currentTeamKey)
    setPlayers(teams[currentTeamKey])
  }, [currentTeamKey])

  const outputTranslator = useMemo(() => {
    i18nOutput.changeLanguage(outputLanguage.code)
    return i18nOutput.t.bind(i18nOutput)
  }, [outputLanguage])
  const classTranslations = useMemo(
    () => useClassTranslations(outputTranslator),
    [outputTranslator]
  )
  const armorSlotTranslations = useMemo(
    () => useArmorSlotTranslations(outputTranslator),
    [outputTranslator]
  )

  useEffect(() => {
    i18nOutput.changeLanguage(outputLanguage.code).then(() => {
      setOutput(
        DiscordFormatService.formatTeam(
          players,
          classTranslations,
          armorSlotTranslations,
          outputTranslator
        )
      )
    })
  }, [players, currentTeamKey, outputLanguage])

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json) as { teams: Teams; currentTeam: string }
      const importedTeams = parsed.teams ?? []

      const parsedData = DataStorageService.loadTeamAndCurrentWithFallback(
        parsed.teams,
        parsed.currentTeam
      )

      setTeams(parsedData.teams)
      setCurrentTeamKey(parsedData.currentTeam)
      setPlayers(parsed.teams[parsedData.currentTeam] ?? [])
      DataStorageService.saveCurrentTeamKey(parsedData.currentTeam)
      DataStorageService.saveTeams(importedTeams)
    } catch (e) {
      console.error(e)
      alert('Invalid JSON. Could not parse.')
    }
  }

  return (
    <div className={'flex flex-col w-full flex-1 gap-8'}>
      <div className={'flex flex-col gap-8'}>
        <div className={'flex flex-row justify-between w-full gap-8'}>
          <div className={'flex flex-row gap-8'}>
            <h1>Dawn Discord Formatter</h1>
            <ImportExportButtons
              storedTeamsData={{ teams: teams, currentTeam: currentTeamKey }}
              onImport={importData}
            />
          </div>

          <div className={'flex flex-row items-center gap-8'}>
            <div className={'flex flex-row items-center gap-2'}>
              <button
                onClick={() => {
                  setEditTeamModalMode('create')
                  setEditTeamModalOpen(true)
                }}
                className="p-2 h-8 w-8 rounded hover:text-white text-zinc-400 hover:bg-zinc-700 transition cursor-pointer"
                title={t('tooltip.add.team')}
              >
                <Plus className="w-4 h-4" />
              </button>
              <FloatingSelect
                id="team-select"
                label={t('team.name.label')}
                value={currentTeamKey}
                className={'w-50'}
                onChange={(e) => setCurrentTeamKey(e.target.value)}
                options={Object.keys(teams).map((key) => ({
                  value: key,
                  label: key,
                }))}
                required={true}
              />
              <div className={'grid grid-cols-1 grid-rows-2 items-center gap-1'}>
                <button
                  onClick={() => {
                    setEditTeamModalMode('edit')
                    setEditTeamModalOpen(true)
                  }}
                  className="p-1 h-6 w-6 rounded hover:text-white text-zinc-400 hover:bg-zinc-700 transition cursor-pointer"
                  title={t('tooltip.rename.team')}
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDeleteConfirmationModalOpen(true)}
                  className="p-1 h-6 w-6 rounded hover:text-white text-zinc-400 hover:bg-red-900 transition cursor-pointer"
                  title={t('tooltip.delete.team')}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            <LanguageSwitcher isGlobal={true} />
          </div>
        </div>
        <div className={'flex flex-row min-h-[30rem] gap-2'}>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onUpdatePlayer={() => {
                const idx = players.findIndex((p) => {
                  return p.id === player.id
                })

                if (idx >= 0 && players.length > idx) {
                  players[idx] = player
                  setPlayers([...players])
                  teams[currentTeamKey] = players
                  setTeams({ ...teams })
                }
              }}
              onDeletePlayer={() => {
                const idx = players.findIndex((p) => {
                  return p.id === player.id
                })

                if (idx >= 0 && players.length > idx) {
                  players.splice(idx, 1)
                  setPlayers([...players])
                  teams[currentTeamKey] = players
                  setTeams({ ...teams })
                }
              }}
            />
          ))}
          {players.length < 7 && <AddNewPlayerCard onClick={() => setShowModal(true)} />}

          <EditPlayerModal
            open={showModal}
            onClose={() => setShowModal(false)}
            mode={'create'}
            onSave={(data) => AddNewPlayer(data.name, data.discord)}
          />
        </div>
      </div>
      <ConfirmModal
        open={deleteConfirmationModalOpen}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        onSave={() => {
          onDeleteTeam(currentTeamKey)
        }}
        title={t('confirm.modal.delete.team.title')}
        bodyText={t('confirm.modal.delete.team.description')}
        yesLabel={t('confirm.modal.delete.team.delete')}
        noLabel={t('confirm.modal.delete.team.cancel')}
        yesBtnClassNames={'bg-red-900 hover:bg-red-700'}
      />
      <EditTeamModal
        open={editTeamModalOpen}
        initialName={currentTeamKey}
        mode={editTeamModalMode}
        onClose={() => setEditTeamModalOpen(false)}
        onSave={({ name }) => {
          if (name == currentTeamKey) {
            return
          }

          if (editTeamModalMode === 'edit') {
            teams[name] = teams[currentTeamKey]
            delete teams[currentTeamKey]
            setCurrentTeamKey(name)
            setTeams({ ...teams })
          } else {
            teams[name] = []
            setCurrentTeamKey(name)
            setTeams({ ...teams })
          }
        }}
      />

      <div>
        <div className={'flex flex-row justify-between gap-4'}>
          <h2>Output</h2>
          <LanguageSwitcher
            isGlobal={false}
            currentLanguage={outputLanguage}
            onLngChange={setOutputLanguage}
          />
        </div>

        <MarkdownOutput value={output} />
      </div>
      <Footer />
    </div>
  )
}
