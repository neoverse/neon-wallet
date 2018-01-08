// @flow
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'

import NetworkSwitch from './NetworkSwitch'
import endpointActions from '../../../../actions/endpointActions'
import withActions from '../../../../hocs/api/withActions'
import { type Actions } from '../../../../values/api'
import { setNetwork } from '../../../../modules/metadata'
import { loadWalletData } from '../../../../modules/wallet'

const actionCreators = {
  setNetwork,
  loadWalletData
}

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch)

const mapActionsToProps = (actions: Actions, props: Object): Object => ({
  onChange: (net) => {
    props.setNetwork(net)
    props.loadWalletData(false) // TODO: move this out of here in favor of a batch request
    return actions.retry()
  }
})

export default compose(
  connect(null, mapDispatchToProps),
  withActions(endpointActions, mapActionsToProps)
)(NetworkSwitch)
