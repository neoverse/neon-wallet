// @flow
import React, { Component } from 'react'

import { NETWORK } from '../../../../core/constants'

import headerStyles from '../Header.scss'

type Props = {
  net: NetworkType,
  onChange: Function,
}

export default class NetworkSwitch extends Component<Props> {
  render () {
    const { net } = this.props
    return (
      <div id='network' className={headerStyles.navBarItem}>
        <span className={headerStyles.navBarItemLabel}>Running on</span>
        <select defaultValue={net} onChange={this.handleChange} className='networkSelector'>
          <option value={NETWORK.MAIN}>{NETWORK.MAIN}</option>
          <option value={NETWORK.TEST}>{NETWORK.TEST}</option>
        </select>
      </div>
    )
  }

  handleChange = (event: Object) => {
    this.props.onChange(event.target.value)
  }
}
