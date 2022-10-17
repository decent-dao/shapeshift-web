import { useContext } from 'react'

import { IXDEFIProviderContext, XDEFIProviderContext } from '../XDEFIContext'

export const useXDEFIProvider = (): IXDEFIProviderContext =>
  useContext(XDEFIProviderContext as React.Context<IXDEFIProviderContext>)
