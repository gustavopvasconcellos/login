import React, { Component, Fragment } from 'react'
import { Link, withRuntimeContext } from 'vtex.render-runtime'
import OutsideClickHandler from 'react-outside-click-handler'
import classNames from 'classnames'

import { ButtonWithIcon } from 'vtex.styleguide'
import { IconProfile } from 'vtex.store-icons'
import Overlay from 'vtex.react-portal/Overlay'

import LoginContent from '../LoginContent'
import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'

import styles from '../styles.css'

const profileIcon = (iconSize, labelClasses, classes, iconsProps) => (
  <div className={classNames(labelClasses, classes)}>
    <IconProfile size={iconSize} {...iconsProps} />
  </div>
)
class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  /** Function called after login success */
  onClickLoginButton = () => {
    window.location.reload()
  }

  renderIcon = () => {
    const {
      iconSize,
      iconLabel: iconLabelProfile,
      labelClasses,
      intl,
      renderIconAsLink,
      onProfileIconClick,
      sessionProfile,
      showIconProfile,
      iconsProps,
      runtime: {
        history: {
          location: { pathname },
        },
      },
    } = this.props

    const iconClasses = 'flex items-center'
    const iconLabel = iconLabelProfile || translate('store/login.signIn', intl)
    const iconContent = (
      <Fragment>
        {showIconProfile &&
          renderIconAsLink &&
          profileIcon(iconSize, labelClasses, iconClasses, iconsProps)}
        {sessionProfile ? (
          <span
            className={`${styles.profile} t-action--small order-1 pl4 ${labelClasses} dn db-l`}
          >
            {translate('store/login.hello', intl)}{' '}
            {sessionProfile.firstName || truncateString(sessionProfile.email)}
          </span>
        ) : (
          iconLabel && (
            <span
              className={`${styles.label} t-action--small pl4 ${labelClasses} dn db-l`}
            >
              {iconLabel}
            </span>
          )
        )}
      </Fragment>
    )

    if (renderIconAsLink) {
      const linkTo = sessionProfile ? 'store.account' : 'store.login'
      const returnUrl =
        !sessionProfile && `returnUrl=${encodeURIComponent(pathname)}`
      return (
        <Link
          page={linkTo}
          query={returnUrl}
          className={`${styles.buttonLink} h1 w2 tc flex items-center w-100-s h-100-s pa4-s`}
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <ButtonWithIcon
        variation="tertiary"
        icon={
          showIconProfile && profileIcon(iconSize, labelClasses, '', iconsProps)
        }
        iconPosition={showIconProfile ? 'left' : 'right'}
        onClick={onProfileIconClick}
      >
        <div
          className="flex pv2 items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {iconContent}
        </div>
      </ButtonWithIcon>
    )
  }

  render() {
    const {
      isBoxOpen,
      onOutSideBoxClick,
      sessionProfile,
      mirrorTooltipToRight,
    } = this.props

    return (
      <div className={`${styles.container} flex items-center fr`}>
        <div className="relative">
          {this.renderIcon()}
          {isBoxOpen && (
            <Overlay>
              <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
                <div
                  className={`${styles.box} z-max absolute`}
                  style={mirrorTooltipToRight ? { left: 50 } : { right: -50 }}
                >
                  <div
                    className={`${styles.arrowUp} absolute top-0 ${
                      mirrorTooltipToRight ? 'left-0 ml3' : 'right-0 mr3'
                    } shadow-3 bg-base rotate-45 h2 w2`}
                  />
                  <div className={`${styles.contentContainer} shadow-3 mt3`}>
                    <LoginContent
                      profile={sessionProfile}
                      loginCallback={this.onClickLoginButton}
                      isInitialScreenOptionOnly
                      {...this.props}
                    />
                  </div>
                </div>
              </OutsideClickHandler>
            </Overlay>
          )}
        </div>
      </div>
    )
  }
}

export default withRuntimeContext(LoginComponent)
