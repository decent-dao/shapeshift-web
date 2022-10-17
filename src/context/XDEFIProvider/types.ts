import { HDWallet } from '@shapeshiftoss/hdwallet-core'

import { AnyFunction } from '../../types/common'

export interface InitialState {
  ethereumWallet: HDWallet | null
  xfiBitcoinProvider: IXfiBitcoinProvider | null
  xfiLitecoinProvider: IXfiLitecoinProvider | null
  isWalletLoading: boolean
}

export interface IXfiBitcoinProvider {
  accounts: string[]
  chainId: string
  network: string
  request: (e: { method: string; params: any[] }, cb: AnyFunction) => Promise<any>
  signTransaction: (e: any) => Promise<void>
  transfer: (e: any) => Promise<void>
}

export interface IXfiLitecoinProvider {
  accounts: string[]
  chainId: string
  network: string
  request: (e: { method: string; params: any[] }, cb: AnyFunction) => void
  transfer: (e: any) => void
}
