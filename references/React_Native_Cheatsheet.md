# React Native Cheatsheet

## Definig a safe screeen

\_layout.jsx

```jsx
import SafeScreen from '@/componensts/safe-screen'
// import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
// import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {
  return (
    // <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    // </ClerkProvider>
  )
}
```

SafeScreen.jsx

```jsx
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: ''
      }}
    >
      {children}
    </View>
  )
}

export default SafeScreen
```
