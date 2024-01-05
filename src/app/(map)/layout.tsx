import EventMap from '@/components/EventMap'
import { Box, Grid, GridItem } from '@chakra-ui/layout'

type MapProviderProps = {
  children: React.ReactNode
}

function MapProvider({ children }: MapProviderProps) {
  return <>{children}</>
}

type MapLayoutProps = {
  children: React.ReactNode
}

export default function MapLayout({ children }: MapLayoutProps) {
  return (
    <MapProvider>
      <Grid gridTemplateColumns="1fr 1fr" gap="5">
        <GridItem>{children}</GridItem>
        <GridItem bg="gray.200" overflow="hidden">
          <Box position="fixed" w="100%" h="100vh" top="0">
            <EventMap events={[]} />
          </Box>
        </GridItem>
      </Grid>
    </MapProvider>
  )
}
