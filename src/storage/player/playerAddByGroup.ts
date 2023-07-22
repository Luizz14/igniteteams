import AsyncStorage from '@react-native-async-storage/async-storage'

import { getPlayerByGroup } from './getPlayerByGroup'
import { PlayerStorageDTO } from './PlayerStorageDTO'

import { PLAYER_COLECTION } from '@storage/storageConfig'
import { AppError } from '@utils/AppError'

export async function playerAddByGroup(
  newPlayer: PlayerStorageDTO,
  groupName: string
) {
  try {
    const storedPlayers = await getPlayerByGroup(groupName)

    const playerAlreadyExist = storedPlayers.filter(
      (player) => player.name === newPlayer.name
    )

    if (playerAlreadyExist.length > 0) {
      throw new AppError('Jogador ja inserido no grupo.')
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLECTION}-${groupName}`, storage)
  } catch (error) {
    throw error
  }
}
