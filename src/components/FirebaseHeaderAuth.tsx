'use client'

import { Text } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { MdExpandMore } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { SerializedUser } from '@/store/user'

export function FirebaseHeaderAuth() {
  const currentUser = useSelector<RootState, SerializedUser | null>(
    (state) => state.user.currentUser
  )
  const auth = getAuth()
  const signUpOrSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
  }

  const signOut = () => {
    auth.signOut()
  }

  return currentUser ? (
    <Menu>
      <MenuButton as={Button} rightIcon={<MdExpandMore />}>
        <Text>{currentUser.displayName}</Text>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={signOut}>ログアウト</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button onClick={signUpOrSignIn}>登録・ログイン</Button>
  )
}
