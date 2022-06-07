import { type ValidatorResults, getConfig as baseGetConfig } from 'config'
import * as guarded from 'config/guarded'

export const validators = {
  REACT_APP_ETHEREUM_NODE_URL: guarded.url({}),
  REACT_APP_UNCHAINED_ETHEREUM_HTTP_URL: guarded.httpUrl({
    default: 'https://api.ethereum.shapeshift.com',
    devDefault: 'https://dev-api.ethereum.shapeshift.com',
  }),
  REACT_APP_UNCHAINED_ETHEREUM_WS_URL: guarded.wsUrl({
    default: 'wss://api.ethereum.shapeshift.com',
    devDefault: 'wss://dev-api.ethereum.shapeshift.com',
  }),
}

export type Config = ValidatorResults<typeof validators>
export const getConfig = () => baseGetConfig(validators)
