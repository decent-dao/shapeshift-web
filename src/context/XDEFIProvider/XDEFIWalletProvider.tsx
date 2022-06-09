/* eslint-disable no-console */
import React, { useCallback, useEffect, useMemo, useReducer } from 'react'

import { useWallet } from '../../hooks/useWallet/useWallet'
import { KeyManager } from '../WalletProvider/KeyManager'
import { getLocalWalletDeviceId, getLocalWalletType } from '../WalletProvider/local-wallet'
import { ActionTypes, XDEFIProviderActions } from './actions'
import { InitialState, IXfiBitcoinProvider, IXfiLitecoinProvider } from './types'
import { IXDEFIProviderContext, XDEFIProviderContext } from './XDEFIContext'

const initialState: InitialState = {
  ethereumWallet: null,
  xfiBitcoinProvider: null,
  xfiLitecoinProvider: null,
  isWalletLoading: false,
}

export const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case XDEFIProviderActions.XDEFI_CONNECTED: {
      return {
        ...state,
        ...action.payload,
        isWalletLoading: false,
      }
    }
    case XDEFIProviderActions.XDEFI_NOT_CONNECTED: {
      return {
        ...initialState,
        ...action.payload,
        isWalletLoading: false,
      }
    }
    case XDEFIProviderActions.RESET_STATE: {
      return {
        ...initialState,
        isWalletLoading: false,
      }
    }
    default:
      return state
  }
}

const getInitialState = () => {
  const localWalletType = getLocalWalletType()
  const localWalletDeviceId = getLocalWalletDeviceId()
  if (localWalletType && localWalletDeviceId) {
    return {
      ...initialState,
      isWalletLoading: true,
    }
  }
  return initialState
}

const injectedAccount = async (
  xfiProvider: IXfiBitcoinProvider | IXfiLitecoinProvider,
): Promise<string[]> => {
  return new Promise(resolve => {
    xfiProvider.request(
      { method: 'request_accounts', params: [] },
      (error: any, accounts: string[]) => {
        if (!error && accounts.length) {
          resolve(accounts)
        }
        if (error) {
          resolve([])
        }
      },
    )
  })
}

export const XDEFIWalletProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, getInitialState())
  const {
    state: { wallet },
  } = useWallet()
  const localWalletType = getLocalWalletType()
  const localWalletDeviceId = getLocalWalletDeviceId()

  const load = useCallback(() => {
    if (localWalletType && localWalletDeviceId) {
      switch (localWalletType) {
        case KeyManager.XDefi: {
          ;(async () => {
            const xfi = (window as any).xfi
            const xfiBitcoinProvider: IXfiBitcoinProvider = xfi['bitcoin']
            const xfiLitecoinProvider: IXfiLitecoinProvider = xfi['litecoin']
            const xfiBitcoinAccounts = await injectedAccount(xfiBitcoinProvider)
            const xfiLItecoinAccounts = await injectedAccount(xfiLitecoinProvider)

            dispatch({
              type: XDEFIProviderActions.XDEFI_CONNECTED,
              payload: {
                ethereumWallet: wallet!,
                xfiBitcoinProvider: {
                  ...xfiBitcoinProvider,
                  accounts: xfiBitcoinAccounts,
                },
                xfiLitecoinProvider: {
                  ...xfiLitecoinProvider,
                  accounts: xfiLItecoinAccounts,
                },
              },
            })
          })()
          break
        }
        default: {
          dispatch({
            type: XDEFIProviderActions.XDEFI_NOT_CONNECTED,
            payload: {
              ethereumWallet: wallet!,
            },
          })
        }
      }
    } else {
      dispatch({
        type: XDEFIProviderActions.RESET_STATE,
      })
    }
  }, [localWalletType, localWalletDeviceId, wallet])

  useEffect(() => load(), [load])

  const value: IXDEFIProviderContext = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  )

  return <XDEFIProviderContext.Provider value={value}>{children}</XDEFIProviderContext.Provider>
}
