import AsyncStorage from '@react-native-async-storage/async-storage'

import { PlayerStorageDTO } from './PlayerStorageDTO'
import { getPlayerByGroup } from './getPlayerByGroup'
import { PLAYER_COLECTION } from '@storage/storageConfig'

export async function removePlayerByGroup(
  playerName: PlayerStorageDTO,
  groupName: string
) {
  try {
    const storedPlayers = await getPlayerByGroup(groupName)
    const playersFiltered = storedPlayers.filter(
      (player) => player.name !== playerName.name
    )

    const stored = JSON.stringify(playersFiltered)
    await AsyncStorage.setItem(`${PLAYER_COLECTION}-${groupName}`, stored)
  } catch (error) {
    throw error
  }
}
