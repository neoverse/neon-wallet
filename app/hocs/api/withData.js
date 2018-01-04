// @flow
import { get } from 'lodash'
import { connect, type MapStateToProps } from 'react-redux'
import { compose, setDisplayName, wrapDisplayName } from 'recompose'

import withoutProps from '../withoutProps'
import { ACTION_PROP, type Data, type Actions } from '../../values/api'

const defaultMapDataToProps = (data: Data) => data

export default function withData (actions: Actions, mapDataToProps: Function = defaultMapDataToProps): Class<React.Component<*>> {
  const mapStateToProps: MapStateToProps<*, *, *> = (state: Object): Object => {
    const data = get(state, `api.${actions.id}.data`)
    return mapDataToProps(data)
  }

  return (Component: Class<React.Component<*>>) => {
    return compose(
      connect(mapStateToProps),
      withoutProps(ACTION_PROP),
      setDisplayName(wrapDisplayName(Component, 'withData'))
    )(Component)
  }
}
