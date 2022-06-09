import { createContext } from 'react'

import { ActionTypes } from './actions'
import { InitialState } from './types'

export interface IXDEFIProviderContext {
  state: InitialState
  dispatch: React.Dispatch<ActionTypes>
}

export const XDEFIProviderContext = createContext<IXDEFIProviderContext | null>(null)
