// @flow
import React from 'react'
import { connect } from 'react-redux'
import { compose, setDisplayName, wrapDisplayName } from 'recompose'

import withoutProps from '../withoutProps'
import { ACTION_PROP, type ActionProp, type Actions } from '../../values/api'

type Props = {
  [key: ActionProp]: Function
}

function defaultMapPropsToAction (props: Object): Object {
  return props
}

export default function withFetch (actions: Actions, mapPropsToAction: Function = defaultMapPropsToAction): Function {
  function mapDispatchToProps (dispatch: DispatchType): Props {
    return {
      [ACTION_PROP]: (props: Object) => dispatch(actions.request(props))
    }
  }

  return (Component: Class<React.Component<*>>) => {
    const WrappedComponent = withoutProps(ACTION_PROP)(Component)

    class ComponentWithFetch extends React.Component<Props> {
      static displayName = 'ComponentWithFetch'

      componentWillMount = () => {
        this.props[ACTION_PROP](mapPropsToAction(this.props))
      }

      render = () => {
        return <WrappedComponent {...this.props} />
      }
    }

    return compose(
      connect(null, mapDispatchToProps),
      setDisplayName(wrapDisplayName(Component, 'withFetch'))
    )(ComponentWithFetch)
  }
}
