'use client'

import { Image } from '@chakra-ui/image'
import SiteLogo from '@/assets/logo.svg'
import { Center, Flex, Spacer } from '@chakra-ui/layout'
import { Link } from '@chakra-ui/layout'
import NextLink from 'next/link'
import { FirebaseHeaderAuth } from './FirebaseHeaderAuth'

export default function SiteHeader() {
  return (
    <>
      <Flex
        as="header"
        paddingTop="15px"
        paddingBottom="15px"
        paddingLeft={7}
        paddingRight={7}
        w="100vw"
        position="fixed"
        top="0"
        zIndex="1000"
        bg="white"
      >
        <Center>
          <Link as={NextLink} href="/">
            <Image src={SiteLogo.src} width="50" height="50" alt="Site Logo" />
          </Link>
        </Center>
        <Spacer flex="1" />
        <Center>
          <FirebaseHeaderAuth />
        </Center>
      </Flex>
    </>
  )
}
