// @flow
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { logout, getAddress, getLoggedIn } from '../../../modules/account'
import { getBlockHeight, getNetwork } from '../../../modules/metadata'
import { getNEOPrice, getGASPrice, getCurrency } from '../../../modules/price'

import Header from './Header'

const mapStateToProps = (state: Object) => ({
  blockHeight: getBlockHeight(state),
  address: getAddress(state),
  neoPrice: getNEOPrice(state),
  gasPrice: getGASPrice(state),
  currencyCode: getCurrency(state),
  isLoggedIn: getLoggedIn(state),
  net: getNetwork(state)
})

const actionCreators = {
  logout
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Header)
