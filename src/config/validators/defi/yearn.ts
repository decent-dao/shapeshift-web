import * as guarded from 'config/guarded'

const validators = {
  REACT_APP_FEATURE_YEARN: guarded.bool({ default: true }),
}

// eslint-disable-next-line import/no-default-export
export default validators
