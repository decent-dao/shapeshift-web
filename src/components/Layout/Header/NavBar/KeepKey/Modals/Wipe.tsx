import { ModalCloseButton } from '@chakra-ui/modal'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useTranslate } from 'react-polyglot'
import { AwaitKeepKey } from 'components/Layout/Header/NavBar/KeepKey/AwaitKeepKey'
import { Text } from 'components/Text'
import { useKeepKey } from 'context/WalletProvider/KeepKeyProvider'
import { useModal } from 'hooks/useModal/useModal'
import { useWallet } from 'hooks/useWallet/useWallet'
import { useHistory } from 'react-router-dom'

export const WipeModal = () => {
  const { keepKeyWallet } = useKeepKey()
  const { disconnect } = useWallet()
  const translate = useTranslate()
  const { keepKeyWipe } = useModal()
  const { close, isOpen } = keepKeyWipe
  const {
    state: { awaitingButtonPress }
  } = useWallet()

  const wipeDevice = async () => {
    await keepKeyWallet?.wipe()
    disconnect()
    close()
  }

  return (
    <Modal isCentered closeOnOverlayClick closeOnEsc isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent justifyContent='center' px={3} pt={3} pb={6}>
        <ModalHeader>
          <Text translation={'walletProvider.keepKey.modals.headings.wipeKeepKey'} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text
            color='gray.500'
            translation={'walletProvider.keepKey.modals.descriptions.wipeKeepKey'}
            mb={6}
          />
          <Button
            onClick={wipeDevice}
            colorScheme='red'
            isFullWidth
            mb={6}
            isLoading={awaitingButtonPress}
          >
            {translate('walletProvider.keepKey.modals.actions.wipeDevice')}
          </Button>
        </ModalBody>
        <AwaitKeepKey
          translation={'walletProvider.keepKey.modals.confirmations.wipeDevice'}
          pl={6}
          pr={6}
        />
      </ModalContent>
    </Modal>
  )
}
