import React from 'react'
import { renderWithIntl } from '../testUtils/intl-utils'

import LoginContent from '../LoginContent'

describe('<LoginContent /> component', () => {
  it('should match snapshot when loading', () => {
    const { asFragment } = renderWithIntl(
      <LoginContent data={{ loading: true }} />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderWithIntl(
      <LoginContent data={{ loading: false }} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
