// @flow
import { compose } from 'recompose'

import NetworkSwitch from './NetworkSwitch'
import networkActions from '../../../../actions/networkActions'
import withData from '../../../../hocs/api/withData'
import withFetch from '../../../../hocs/api/withFetch'
import withActions from '../../../../hocs/api/withActions'
import { type Actions } from '../../../../values/api'

const mapDataToProps = (net) => ({ net })

const mapActionsToProps = (actions: Actions, props: Object): Object => ({
  onChange: (net) => actions.request({ net })
})

export default compose(
  withFetch(networkActions),
  withData(networkActions, mapDataToProps),
  withActions(networkActions, mapActionsToProps)
)(NetworkSwitch)
