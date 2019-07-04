import React from 'react'
import { RouteComponentProps } from '@reach/router'

type Props<T> = { render: React.ComponentType; props?: T } & RouteComponentProps

class Routable<T> extends React.PureComponent<Props<T>> {
  render () {
    const { render: Component, props = {}, ...rest } = this.props
    return <Component {...props} {...rest} />
  }
}

export default Routable
