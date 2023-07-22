import AsyncStorage from '@react-native-async-storage/async-storage'

import { AppError } from '@utils/AppError'
import { GROUP_COLECTION } from '@storage/storageConfig'

import { getAllGroups } from './groupsGetAll'

export async function groupCreate(newGroupName: string) {
  try {
    const storageGroups = await getAllGroups()

    const groupAlreadyExist = storageGroups.includes(newGroupName)

    if (groupAlreadyExist) {
      throw new AppError('Um grupo com esse nome ja existe.')
    }

    const storage = JSON.stringify([...storageGroups, newGroupName])

    await AsyncStorage.setItem(GROUP_COLECTION, storage)
  } catch (error) {
    throw error
  }
}
