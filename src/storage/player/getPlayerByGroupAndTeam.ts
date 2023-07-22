import { getPlayerByGroup } from './getPlayerByGroup'

export async function getPlayerByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await getPlayerByGroup(group)
    const players = storage.filter((player) => player.team === team)

    return players
  } catch (error) {
    throw error
  }
}
