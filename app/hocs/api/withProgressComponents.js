// @flow
import React from 'react'
import { compose, setDisplayName, wrapDisplayName } from 'recompose'

import withProgressProp from './withProgressProp'
import withoutProps from '../withoutProps'
import { PROGRESS_PROP, type ProgressProp, type Actions } from '../../values/api'
import { type ProgressState } from '../../values/state'

type Props = {
  [key: ProgressProp]: ProgressState
}

type Mapping = {
  [key: ProgressState]: Class<React.Component<*>>
}

export default function withProgressComponents (actions: Actions, mapping: Mapping = {}) {
  return (Component: Class<React.Component<*>>): Class<React.Component<*>> => {
    class ComponentWithProgressComponents extends React.Component<Props> {
      static displayName = 'ComponentWithProgressComponents'

      render = () => {
        const MappedComponent = mapping[this.props[PROGRESS_PROP]] || Component
        const WrappedComponent = withoutProps(PROGRESS_PROP)(MappedComponent)
        return <WrappedComponent {...this.props} />
      }
    }

    return compose(
      withProgressProp(actions),
      setDisplayName(wrapDisplayName(Component, 'withProgressComponents'))
    )(ComponentWithProgressComponents)
  }
}
