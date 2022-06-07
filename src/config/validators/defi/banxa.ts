import * as guarded from 'config/guarded'

const validators = {
  REACT_APP_FEATURE_BANXA_RAMP: guarded.bool({ default: false }),
}

// eslint-disable-next-line import/no-default-export
export default validators
