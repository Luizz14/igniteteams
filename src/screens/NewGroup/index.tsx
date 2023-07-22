import { useEffect, useRef, useState } from 'react'
import { Alert, TextInput } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Container, Content, Icon } from './styles'

import { groupCreate } from '@storage/group/groupCreate'

import { AppError } from '@utils/AppError'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { Button } from '@components/Button'
import { Input } from '@components/Input'

export function NewGroup() {
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  const playerInputRef = useRef<TextInput>(null)

  async function handleNewGroup() {
    try {
      await groupCreate(group)
      navigation.navigate('players', { group })
    } catch (error) {
      if (group.trim().length === 0) {
        Alert.alert('Novo grupo', 'Insira um nome para o grupo.')
      }

      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message)
      } else {
        Alert.alert('Novo groupo', 'Erro em criar novo groupo.')
        console.log(error)
      }
    }
  }

  useEffect(() => {
    console.log('Iae pai')
    playerInputRef.current?.focus()
  }, [])

  return (
    <Container>
      <Header ShowBackButton />

      <Content>
        <Icon />
        <Highlight
          title='Nova turma'
          subtitle='crie a turma para adicionar as pessoas'
        />

        <Input
          inputRef={playerInputRef}
          placeholder='Nome da turma'
          onChangeText={setGroup}
          onSubmitEditing={handleNewGroup}
        />

        <Button
          title='Criar'
          style={{ marginTop: 20 }}
          onPress={handleNewGroup}
        />
      </Content>
    </Container>
  )
}
