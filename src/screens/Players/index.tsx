import { useEffect, useRef, useState } from 'react'
import { FlatList, Alert, TextInput, Keyboard } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { Container, Form, HeaderList, NumberOfPlayers } from './styles'

import { AppError } from '@utils/AppError'

import { getPlayerByGroupAndTeam } from '@storage/player/getPlayerByGroupAndTeam'
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { removePlayerByGroup } from '@storage/player/removePlayerByGroup'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { ButtonIcon } from '@components/ButtonIcon'
import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { PlayerCard } from '@components/PlayerCard'
import { ListEmpty } from '@components/ListEmpty'
import { Button } from '@components/Button'
import { groupRemove } from '@storage/group/groupRemove'
import { Loading } from '@components/Loading'

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsloading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const [team, setTeam] = useState('Time A')

  const playerInputRef = useRef<TextInput>(null)

  const route = useRoute()
  const { group } = route.params as RouteParams

  const navigation = useNavigation()

  async function removeGroup() {
    try {
      await groupRemove(group)
      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remover grupo', 'Nao foi possivel remover o grupo.')
    }
  }

  async function handleRemoveGroup() {
    Alert.alert('Remover grupo', `Deseja remover o grupo ${group}?`, [
      { text: 'Nao', style: 'cancel' },
      { text: 'Sim', onPress: () => removeGroup() },
    ])
  }

  async function handleAddNewPlayer(group: string) {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Insira um nome para a pessoa.')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      playerInputRef.current?.blur()
      Keyboard.dismiss()

      setNewPlayerName('')
      fetchPlayersByTeam()
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log(error)
        Alert.alert(
          'Nova pessoa',
          'Nao foi possivel adicionar uma nova pessoa.'
        )
      }
    }
  }

  async function handleRemovePlayer(player: PlayerStorageDTO) {
    try {
      await removePlayerByGroup(player, group)
      fetchPlayersByTeam()
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Remover pessoa',
        `Nao foi possivel remover essa pessoa: ${player.name}`
      )
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsloading(true)

      const PlayersByTeam = await getPlayerByGroupAndTeam(group, team)
      setPlayers(PlayersByTeam)
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert(
          'Carregar jogadores',
          'Nao foi possivel carregar as pessoas do time.'
        )
      }
    } finally {
      setIsloading(false)
    }
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header ShowBackButton />

      <Highlight title={group} subtitle='adicione a galera e separe os times' />

      <Form>
        <Input
          inputRef={playerInputRef}
          placeholder='Nome da pessoa'
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={() => handleAddNewPlayer(group)}
          returnKeyType='done'
        />

        <ButtonIcon nameIcon='add' onPress={() => handleAddNewPlayer(group)} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handleRemovePlayer(item)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message='Não tem pessoas nesse time' />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title='Remover turma'
        type='SECONDARY'
        onPress={handleRemoveGroup}
      />
    </Container>
  )
}
