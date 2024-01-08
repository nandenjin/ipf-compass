'use client'

import { Event } from '@/lib/event'
import { AppDispatch, RootState } from '@/store'
import { addEvent, deleteEvent } from '@/store/collection'
import { Button } from '@chakra-ui/button'
import { VStack, Text, Box } from '@chakra-ui/layout'
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { MdDone, MdStar } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

type EventSaveButtonProps = {
  event: Event
}
export function EventSaveButton({ event }: EventSaveButtonProps) {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.currentUser)
  const isCollected = useSelector((state: RootState) =>
    state.collection.events.includes(event.id)
  )
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Popover isOpen={isLoggedIn ? false : undefined}>
      <PopoverTrigger>
        <Button
          h="100%"
          w="6em"
          onClick={() =>
            isLoggedIn
              ? dispatch(
                  !isCollected ? addEvent(event.id) : deleteEvent(event.id)
                )
              : null
          }
          bg={!isCollected ? 'gray.100' : 'red.500'}
          _hover={{ bg: !isCollected ? 'gray.200' : 'red.600' }}
          color={!isCollected ? 'black' : 'white'}
        >
          {isCollected ? (
            <VStack>
              <MdDone />
              <Text>保存済み</Text>
            </VStack>
          ) : (
            <VStack>
              <MdStar />
              <Text>保存</Text>
            </VStack>
          )}
        </Button>
      </PopoverTrigger>
      <Box position="relative" zIndex="999">
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight={'bold'}>
            ログインして利用しよう
          </PopoverHeader>
          <PopoverBody>
            公演を保存して、自分のスケジュールを作ることができます
          </PopoverBody>
          <PopoverFooter>
            <Button
              w="100%"
              bg="red.500"
              color="white"
              onClick={() => {
                const auth = getAuth()
                signInWithPopup(auth, new GoogleAuthProvider())
              }}
            >
              登録・ログイン
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Box>
    </Popover>
  )
}
