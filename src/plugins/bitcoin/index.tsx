import { bitcoin } from '@shapeshiftoss/chain-adapters'
import { ChainTypes } from '@shapeshiftoss/types'
import * as unchained from '@shapeshiftoss/unchained-client'
import { Plugins } from 'plugins'

import { getConfig } from './config'

export const pluginName = 'bitcoin'

export function register(): Plugins {
  return [
    [
      'bitcoinChainAdapter',
      {
        name: 'bitcoinChainAdapter',
        providers: {
          chainAdapters: [
            [
              ChainTypes.Bitcoin,
              () => {
                const http = new unchained.bitcoin.V1Api(
                  new unchained.ethereum.Configuration({
                    basePath: getConfig().REACT_APP_UNCHAINED_BITCOIN_HTTP_URL,
                  }),
                )

                const ws = new unchained.ws.Client<unchained.Tx>(
                  getConfig().REACT_APP_UNCHAINED_BITCOIN_WS_URL,
                )

                return new bitcoin.ChainAdapter({ providers: { http, ws }, coinName: 'Bitcoin' })
              },
            ],
          ],
        },
      },
    ],
  ]
}
