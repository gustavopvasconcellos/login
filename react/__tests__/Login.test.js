import React from 'react'
import { renderWithIntl } from '../testUtils/intl-utils'

import Login from '../Login'

import { AuthState } from 'vtex.react-vtexid'

describe('<Login /> component', () => {
  it('should match snapshot when loading', async () => {
    AuthState.mockImplementationOnce(({ children }) => children({ loading: true }))

    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    // TODO: use something better than a timeout here
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot without profile', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {},
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile without name', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {
        namespaces: {
          profile: { email: { value: 'email@vtex.com' } },
        },
      },
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile with name', async () => {
    window.__RENDER_8_SESSION__ = {}
    window.__RENDER_8_SESSION__.sessionPromise = Promise.resolve({
      response: {
        namespaces: {
          profile: {
            email: { value: 'email@vtex.com' },
            firstName: { value: 'firstName' },
          },
        },
      },
    })
    const { asFragment } = renderWithIntl(<Login isBoxOpen />)
    await Promise.resolve()
    expect(asFragment()).toMatchSnapshot()
  })
})
