import AsyncStorage from '@react-native-async-storage/async-storage'
import { GROUP_COLECTION, PLAYER_COLECTION } from '@storage/storageConfig'

import { getAllGroups } from './groupsGetAll'

export async function groupRemove(groupDeleted: string) {
  try {
    const storage = await getAllGroups()
    const groups = storage.filter((group) => group !== groupDeleted)

    await AsyncStorage.setItem(GROUP_COLECTION, JSON.stringify(groups))
    await AsyncStorage.removeItem(`${PLAYER_COLECTION}-${groupDeleted}`)
  } catch (error) {
    throw error
  }
}
