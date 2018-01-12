// @flow
import React from 'react'
import { compose, setDisplayName, wrapDisplayName } from 'recompose'
import { isEqual, some, castArray } from 'lodash'

import withActions from './withActions'
import withoutProps from '../withoutProps'
import { ACTION_PROP, type ActionProp, type Actions } from '../../values/api'

type Props = {
  [key: ActionProp]: Function
}

type ShouldReload = Array<string> | string | Function

function createShouldReload (shouldReloadDefinition: ShouldReload) {
  if (typeof shouldReloadDefinition === 'function') {
    return shouldReloadDefinition
  } else {
    const shouldReloadProps = castArray(shouldReloadDefinition)

    return (prevProps: Object, props: Object): boolean => {
      return some(shouldReloadProps, (key) => !isEqual(prevProps[key], props[key]))
    }
  }
}

export default function withReload (actions: Actions, shouldReloadDefinition: ShouldReload): Function {
  const shouldReload = createShouldReload(shouldReloadDefinition)

  const mapActionsToProps = (actions: Actions, props: Object): Object => ({
    [ACTION_PROP]: (...args: Array<any>) => actions.request(...args)
  })

  return (Component: Class<React.Component<*>>) => {
    const WrappedComponent = withoutProps(ACTION_PROP)(Component)

    class ComponentWithReload extends React.Component<Props> {
      static displayName = 'ComponentWithFetch'

      componentDidUpdate = (prevProps) => {
        if (shouldReload(prevProps, this.props)) {
          this.props[ACTION_PROP](this.props)
        }
      }

      render = () => {
        return <WrappedComponent {...this.props} />
      }
    }

    return compose(
      withActions(actions, mapActionsToProps),
      setDisplayName(wrapDisplayName(Component, 'withReload'))
    )(ComponentWithReload)
  }
}
