import { Alert, AlertIcon, Flex, useColorModeValue } from '@chakra-ui/react'
import { ModalBody, ModalHeader } from '@chakra-ui/react'
import { ResetDevice } from '@shapeshiftoss/hdwallet-core'
import { isKeepKey } from '@shapeshiftoss/hdwallet-keepkey'
import { useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AwaitKeepKey } from 'components/Layout/Header/NavBar/KeepKey/AwaitKeepKey'
import { Text } from 'components/Text'
import { useWallet } from 'hooks/useWallet/useWallet'

interface RecoverySentenceParams {
  label: string
}

export const KeepKeyRecoverySentence = () => {
  const yellowShade = useColorModeValue('yellow.500', 'yellow.200')
  const {
    load,
    state: { wallet }
  } = useWallet()
  const history = useHistory()
  const keepKeyWallet = useMemo(() => (wallet && isKeepKey(wallet) ? wallet : undefined), [wallet])
  const location = useLocation<RecoverySentenceParams>()
  useEffect(() => {
    ;(async () => {
      const { label } = location.state
      const resetMessage: ResetDevice = { label }
      await keepKeyWallet?.reset(resetMessage)
      load()
      history.push('/keepkey/success')
    })()
  }, [history, keepKeyWallet, load, location.state])
  return (
    <>
      <ModalHeader>
        <Text translation={'modals.keepKey.recoverySentence.header'} />
      </ModalHeader>
      <ModalBody>
        <Text color='gray.500' translation={'modals.keepKey.recoverySentence.body'} mb={3} />
        <Alert status='warning' color={yellowShade} borderRadius='lg' mb={3}>
          <AlertIcon color={yellowShade} alignSelf='self-start' />
          <Flex direction='column'>
            <Text translation={'modals.keepKey.recoverySentence.infoFirst'} mb={3} />
            <Text translation={'modals.keepKey.recoverySentence.infoSecond'} />
          </Flex>
        </Alert>
      </ModalBody>
      <AwaitKeepKey
        translation={'modals.keepKey.recoverySentence.awaitingButtonPress'}
        pl={6}
        pr={6}
      />
    </>
  )
}
