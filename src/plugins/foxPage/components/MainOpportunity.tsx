import { Box, Flex, Skeleton } from '@chakra-ui/react'
import { Button, Text as CText } from '@chakra-ui/react'
import { useTranslate } from 'react-polyglot'
import { Amount } from 'components/Amount/Amount'
import { AssetIcon } from 'components/AssetIcon'
import { Card } from 'components/Card/Card'
import { Text } from 'components/Text/Text'
import { selectAssetById } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

type MainOpportunityProps = {
  apy: string
  assetId: string
  balance: string
  isLoaded: boolean
  onClick: () => void
  tvl: string
}

export const MainOpportunity = ({
  apy,
  assetId,
  tvl,
  balance,
  onClick,
  isLoaded,
}: MainOpportunityProps) => {
  const translate = useTranslate()

  const selectedAsset = useAppSelector(state => selectAssetById(state, assetId))

  return (
    <Card display='block' width='full'>
      <Card.Header>
        <Flex flexDirection='row' alignItems='center' mb={2}>
          <AssetIcon src={selectedAsset.icon} boxSize='6' mr={2} zIndex={2} />
          <Text
            fontWeight='bold'
            color='inherit'
            translation={[
              'plugins.foxPage.mainStakingTitle',
              {
                assetSymbol: selectedAsset.symbol,
              },
            ]}
          />
        </Flex>
        <Text translation='plugins.foxPage.mainStakingDescription' color='gray.500' />
      </Card.Header>
      <Card.Body>
        <Flex justifyContent='space-between' flexDirection={{ base: 'column', md: 'row' }}>
          <Box>
            <Text translation='plugins.foxPage.currentApy' color='gray.500' mb={1} />
            <CText color='green.400' fontSize={'xl'}>
              <Amount.Percent value={apy} />
            </CText>
          </Box>
          <Box>
            <Text translation='plugins.foxPage.tvl' color='gray.500' mb={1} />
            <Skeleton isLoaded={isLoaded}>
              <Amount.Fiat color='inherit' fontSize={'xl'} fontWeight='semibold' value={tvl} />
            </Skeleton>
          </Box>
          <Box>
            <Text translation='plugins.foxPage.balance' color='gray.500' mb={1} />
            <CText color='inherit' fontSize={'xl'}>
              {balance}
            </CText>
          </Box>
          <Box alignSelf='center'>
            <Button onClick={onClick} colorScheme={'blue'}>
              <CText>{translate('plugins.foxPage.getStarted')}</CText>
            </Button>
          </Box>
        </Flex>
      </Card.Body>
    </Card>
  )
}
