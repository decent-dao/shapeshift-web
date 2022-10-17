import { HDWallet } from '@shapeshiftoss/hdwallet-core'

import { IXfiBitcoinProvider, IXfiLitecoinProvider } from './types'

export enum XDEFIProviderActions {
  XDEFI_CONNECTED = 'XDEFI_CONNECTED',
  XDEFI_NOT_CONNECTED = 'XDEFI_NOT_CONNECTED',
  RESET_STATE = 'RESET_STATE',
}

export type ActionTypes =
  | {
      type: XDEFIProviderActions.XDEFI_CONNECTED
      payload: {
        ethereumWallet: HDWallet
        xfiBitcoinProvider: IXfiBitcoinProvider
        xfiLitecoinProvider: IXfiLitecoinProvider
      }
    }
  | {
      type: XDEFIProviderActions.XDEFI_NOT_CONNECTED
      payload: {
        ethereumWallet: HDWallet
      }
    }
  | {
      type: XDEFIProviderActions.RESET_STATE
    }
