import { Image } from '@chakra-ui/image'
import SiteLogo from '@/assets/logo.svg'
import { Box, Center, Flex, Grid, Spacer } from '@chakra-ui/layout'
import { Link } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import NextLink from 'next/link'
import { FirebaseHeaderAuth } from './FirebaseHeaderAuth'

export default function SiteHeader() {
  return (
    <Flex as="header" padding="15px">
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
  )
}
