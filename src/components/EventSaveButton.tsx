'use client'

import { Event } from '@/lib/event'
import { AppDispatch, RootState } from '@/store'
import { addEvent } from '@/store/collection'
import { Button } from '@chakra-ui/button'
import { VStack, Text } from '@chakra-ui/layout'
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
    <Button
      h="100%"
      disabled={!isLoggedIn}
      onClick={() => dispatch(addEvent(event.id))}
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
  )
}
