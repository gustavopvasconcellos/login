import React, { Fragment, Component } from 'react'

import { compose, path } from 'ramda'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { withSession, withRuntimeContext } from 'vtex.render-runtime'

import Loading from './components/Loading'
import LoginOptions from './components/LoginOptions'
import AccountOptions from './components/AccountOptions'
import EmailAndPassword from './components/EmailAndPassword'
import CodeConfirmation from './components/CodeConfirmation'
import RecoveryPassword from './components/RecoveryPassword'
import EmailVerification from './components/EmailVerification'
import OAuthAutoRedirect from './components/OAuthAutoRedirect'

import { steps } from './utils/steps'
import { setCookie } from './utils/set-cookie'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { session } from 'vtex.store-resources/Queries'
import { AuthStateLazy } from 'vtex.react-vtexid'
import { SELF_APP_NAME_AND_VERSION } from './common/global'

import styles from './styles.css'

const STEPS = [
  /* eslint-disable react/display-name, react/prop-types */
  (props, state, func, isOptionsMenuDisplayed) => {
    return style => (
      <div style={style} key={0}>
        <EmailVerification
          next={steps.CODE_CONFIRMATION}
          previous={steps.LOGIN_OPTIONS}
          isCreatePassword={state.isCreatePassword}
          title={props.accessCodeTitle}
          emailPlaceholder={props.emailPlaceholder}
          onStateChange={func}
          showBackButton={!isOptionsMenuDisplayed}
        />
      </div>
    )
  },
  (props, state, func, isOptionsMenuDisplayed) => {
    return style => (
      <div style={style} key={1}>
        <EmailAndPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.LOGIN_OPTIONS}
          title={props.emailAndPasswordTitle}
          emailPlaceholder={props.emailPlaceholder}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={
            props.showPasswordVerificationIntoTooltip
          }
          onStateChange={func}
          showBackButton={!isOptionsMenuDisplayed}
          loginCallback={props.loginCallback}
          identifierPlaceholder={props.hasIdentifierExtension ? props.identifierPlaceholder : ''}
          invalidIdentifierError={props.hasIdentifierExtension ? props.invalidIdentifierError : ''}
        />
      </div>
    )
  },
  (props, state, func) => {
    return style => (
      <div style={style} key={2}>
        <CodeConfirmation
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_VERIFICATION}
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={func}
          loginCallback={props.loginCallback}
        />
      </div>
    )
  },
  () => {
    return style => (
      <div style={style} key={3}>
        <AccountOptions />
      </div>
    )
  },
  (props, state, func) => {
    return style => (
      <div style={style} key={4}>
        <RecoveryPassword
          next={steps.ACCOUNT_OPTIONS}
          previous={steps.EMAIL_PASSWORD}
          passwordPlaceholder={props.passwordPlaceholder}
          showPasswordVerificationIntoTooltip={
            props.showPasswordVerificationIntoTooltip
          }
          accessCodePlaceholder={props.accessCodePlaceholder}
          onStateChange={func}
          loginCallback={props.loginCallback}
        />
      </div>
    )
  },
  /* eslint-enable react/display-name react/prop-types */
]

class LoginContent extends Component {
  static propTypes = {
    /** User profile information */
    profile: PropTypes.shape({}),
    /** Which screen option will renderize  */
    isInitialScreenOptionOnly: PropTypes.bool,
    /** Step that will be render first */
    defaultOption: PropTypes.number,
    /** Function called after login success */
    loginCallback: PropTypes.func,
    /** Runtime context. */
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
      page: PropTypes.string,
      history: PropTypes.shape({
        location: PropTypes.shape({
          pathname: PropTypes.string,
          search: PropTypes.string,
        }),
      }),
    }),
    /* Reused props */
    optionsTitle: LoginPropTypes.optionsTitle,
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip:
      LoginPropTypes.showPasswordVerificationIntoTooltip,
    providerPasswordButtonLabel: PropTypes.string,
    hasIdentifierExtension: PropTypes.bool,
    identifierPlaceholder: PropTypes.string,
    invalidIdentifierError: PropTypes.string,
  }

  static defaultProps = {
    isInitialScreenOptionOnly: true,
    defaultOption: 0,
    optionsTitle: '',
  }

  static contextTypes = {
    patchSession: PropTypes.func,
  }

  state = {
    isOnInitialScreen: !this.props.profile,
    isCreatePassword: false,
    step: this.props.defaultOption,
    email: '',
    password: '',
    code: '',
  }

  get returnUrl() {
    const {
      runtime: {
        page,
        history: {
          location: { pathname, search },
        },
      },
    } = this.props
    const currentUrl = page !== 'store.login' ? `${pathname}${search}` : '/'
    return path(['query', 'returnUrl'], this.props) || currentUrl
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }
  }

  get shouldRenderLoginOptions() {
    return this.props.isInitialScreenOptionOnly
      ? this.state.isOnInitialScreen
      : true
  }

  get shouldRenderForm() {
    if (this.props.profile) {
      return true
    }

    return (
      !this.props.isInitialScreenOptionOnly || !this.state.isOnInitialScreen
    )
  }

  shouldRedirectToOAuth = loginOptions => {
    if (!loginOptions) return [false, null]
    const { accessKey, oAuthProviders, password } = loginOptions
    const { runtime } = this.props
    if (runtime && runtime.query && runtime.query.oAuthRedirect) {
      const redirectProvider =
        oAuthProviders &&
        oAuthProviders.find(provider => provider.providerName === runtime.query.oAuthRedirect)
      if (redirectProvider) {
        return [true, redirectProvider]
      }
    }
    if (accessKey || password) return [false, null]
    if (!oAuthProviders || oAuthProviders.length !== 1) return [false, null]
    return [true, oAuthProviders[0]]
  }

  handleUpdateState = state => {
    if (state.hasOwnProperty('step')) {
      if (state.step === -1) {
        state.step = 0
        state.isOnInitialScreen = true
      } else if (state.step !== this.props.defaultOption) {
        state.isOnInitialScreen = false
      }
    }

    this.setState({ ...state })
  }

  handleOptionsClick = option => {
    let nextStep

    if (option === 'store/loginOptions.emailVerification') {
      nextStep = 0
    } else if (option === 'store/loginOptions.emailAndPassword') {
      nextStep = 1
    }

    this.setState({
      step: nextStep,
      isOnInitialScreen: false,
      isCreatePassword: false,
    })
  }

  redirect = () => {
    this.props.runtime.navigate({
      to: this.returnUrl,
      fallbackToWindowLocation: true,
    })
  }

  /**
   * Action after login success. If loginCallback isn't
   * a prop, it will call a root page redirect as default.
   */
  onLoginSuccess = () => {
    const { loginCallback } = this.props
    return this.context.patchSession().then(() => {
      if (loginCallback) {
        loginCallback()
      } else {
        // the use of location.assign here, instead of
        // the redirect method, is because on CSR the
        // components using authentication and relying
        // on the session cookie haven't been updated yet,
        // so the refresh is intentional.
        location.assign(
          `/api/vtexid/pub/authentication/redirect?returnUrl=${encodeURIComponent(
            this.returnUrl
          )}`
        )
      }
    })
  }

  renderChildren = style => {
    const {
      profile,
      isInitialScreenOptionOnly,
      optionsTitle,
      defaultOption,
      providerPasswordButtonLabel,
    } = this.props
    const { isOnInitialScreen } = this.state

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    return (
      <div style={style} key={0}>
        <AuthStateLazy.IdentityProviders>
          {({ value: options }) => {
            const [
              shouldRedirectToOauth,
              oauthProvider,
            ] = this.shouldRedirectToOAuth(options)
            return shouldRedirectToOauth && oauthProvider ? (
              <OAuthAutoRedirect provider={oauthProvider.providerName} />
            ) : (
              <LoginOptions
                page="login-options"
                fallbackTitle="store/loginOptions.title"
                title={optionsTitle}
                options={{
                  accessKeyAuthentication: options.accessKey,
                  classicAuthentication: options.password,
                  providers: options.oAuthProviders,
                }}
                currentStep={
                  step === 0
                    ? 'store/loginOptions.emailVerification'
                    : 'store/loginOptions.emailAndPassword'
                }
                isAlwaysShown={!isInitialScreenOptionOnly}
                onOptionsClick={this.handleOptionsClick}
                loginCallback={this.onLoginSuccess}
                providerPasswordButtonLabel={providerPasswordButtonLabel}
              />
            )
          }}
        </AuthStateLazy.IdentityProviders>
      </div>
    )
  }

  render() {
    const {
      profile,
      isInitialScreenOptionOnly,
      defaultOption,
      session,
    } = this.props

    const { isOnInitialScreen } = this.state

    // Check if the user is already logged and redirect to the return URL if it didn't receive
    // the profile by the props and current endpoint are /login, if receive it, should render the account options.
    if (getProfile(session) && !profile) {
      if (location.pathname.includes('/login')) {
        this.redirect()
      }
    }

    let step = this.state.step
    if (profile) {
      step = steps.ACCOUNT_OPTIONS
    } else if (isOnInitialScreen) {
      step = defaultOption
    }

    const renderForm = STEPS[step](
      {
        ...this.props,
        loginCallback: this.onLoginSuccess,
      },
      this.state,
      this.handleUpdateState,
      this.shouldRenderLoginOptions
    )

    const className = classNames(
      `${styles.content} flex relative bg-base justify-around overflow-visible pa4 center`,
      {
        [styles.contentInitialScreen]: this.state.isOnInitialScreen,
        [`${styles.contentAlwaysWithOptions} mw6-ns flex-column-reverse items-center flex-row-ns items-baseline-ns`]: !isInitialScreenOptionOnly,
        'items-baseline': isInitialScreenOptionOnly,
      }
    )

    const formClassName = classNames(styles.contentForm, 'dn ph4 pb6', {
      [`${styles.contentFormVisible} db `]: this.shouldRenderForm,
    })

    return (
      <AuthStateLazy useParentSuspense skip={!!profile} scope="STORE" parentAppId={SELF_APP_NAME_AND_VERSION} returnUrl={this.returnUrl}>
        {({ loading }) => (
          loading ? (
            <div data-testid="loading-session">
              <Loading />
            </div>
          ) : (
            <div className={className}>
              {!profile && this.shouldRenderLoginOptions && !loading
                ? this.renderChildren()
                : null}
              <div className={formClassName}>
                {this.shouldRenderForm && renderForm ? renderForm() : null}
              </div>
            </div>
          )
        )}
      </AuthStateLazy>
    )
  }
}

const config = {
  name: 'session',
  options: () => ({ ssr: false, fetchPolicy: 'no-cache' }),
}

const content = withSession()(
  compose(
    injectIntl,
    graphql(session, config)
  )(LoginContent)
)

content.getSchema = () => ({
  title: 'admin/editor.loginPage.title',
  ...LoginSchema,
  properties: {
    ...LoginSchema.properties,
    isInitialScreenOptionOnly: {
      title: 'admin/editor.login.isInitialScreenOptionOnly.title',
      type: 'boolean',
      default: true,
      isLayout: true,
    },
    defaultOption: {
      title: 'admin/editor.login.defaultOption.title',
      type: 'number',
      default: 0,
      isLayout: true,
      enum: [0, 1],
      enumNames: [
        'admin/editor.login.defaultOption.token',
        'admin/editor.login.defaultOption.emailAndPassword',
      ],
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
  },
})

export default withRuntimeContext(content)
