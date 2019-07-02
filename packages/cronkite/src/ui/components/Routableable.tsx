import React from 'react'
import { RouteComponentProps } from '@reach/router'

const ROUTER_PROP_KEYS = ['path', 'default', 'location', 'navigate', 'uri']

type Props = { render: React.ComponentType } & RouteComponentProps

const withoutRouterProps = (props: any) => {
  const nextProps = { ...props }
  for (var key of ROUTER_PROP_KEYS) {
    delete nextProps[key]
  }
  return nextProps
}

const Routable: React.ComponentType<Props> = ({ render: Component, ...rest }) => (
  <Component {...withoutRouterProps(rest)} />
)

export default Routable
