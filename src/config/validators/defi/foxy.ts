import * as guarded from 'config/guarded'

const validators = {
  REACT_APP_FOXY_APY: guarded.num({ devDefault: 0.15, guard: x => x >= 0.0 }),
}

// eslint-disable-next-line import/no-default-export
export default validators
