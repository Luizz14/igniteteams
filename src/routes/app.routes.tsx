import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Groups } from '@screens/Groups'
import { NewGroup } from '@screens/NewGroup'
import { Players } from '@screens/Players'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name='groups'
        component={Groups}
        options={{
          animation: 'slide_from_right',
        }}
      />

      <Screen
        name='new'
        component={NewGroup}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <Screen
        name='players'
        component={Players}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Navigator>
  )
}
