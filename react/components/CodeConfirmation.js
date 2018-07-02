import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'

import { translate } from '../utils/translate'
import { isValidAccesCode } from '../utils/format-check'
import accessKeySignIn from '../mutations/accessKeySignIn.gql'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn mutation */
class CodeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isInvalidCode: false,
      isWrongCredentials: false,
    }
  }

  handleInputChange = event => {
    this.setState({ isInvalidCode: false })
    this.props.onStateChange({ code: event.target.value })
  }

  handleSuccess = status => {
    const { onStateChange, next } = this.props
    status === 'Success' && onStateChange({ step: next })
  }

  handleWrongCredentials = status => {
    status === 'WrongCredentials' && this.setState({ isWrongCredentials: true })
  }

  handleOnSubmit = event => {
    const { accessKeySignIn, email, code } = this.props
    if (!isValidAccesCode(code)) {
      this.setState({ isInvalidCode: true })
    } else {
      this.setState({ isLoading: true })
      accessKeySignIn({
        variables: { email, code },
      }).then(
        ({ data }) => {
          if (data && data.accessKeySignIn) {
            this.setState({ isLoading: false })
            this.handleSuccess(data.accessKeySignIn)
            this.handleWrongCredentials(data.accessKeySignIn)
          }
        }, err => { console.error(err) })
    }
    event.preventDefault()
  }

  render() {
    const {
      intl,
      onStateChange,
      previous,
      code,
    } = this.props
    const {
      isLoading,
      isInvalidCode,
      isWrongCredentials,
    } = this.state

    return (
      <div className="vtex-login__code-confirmation w-100">
        <h3 className="fw5 ttu br2 tc fw4 v-mid pv3 ph5 f6 light-marine">
          {translate(titleLabel, intl)}
        </h3>
        <form onSubmit={e => this.handleOnSubmit(e)}>
          <Input value={code} onChange={this.handleInputChange} />
          {isInvalidCode &&
            <div className="f7 tc bg-washed-red pa2 ma1">
              {translate('login.invalidCode', intl)}
            </div>
          }
          {isWrongCredentials &&
            <div className="f7 tc bg-washed-red pa2 ma1">
              {translate('login.wrongCredentials', intl)}
            </div>
          }
          <div className="mt5 min-h-2 b--light-gray">
            <div className="fl mt4">
              <Button variation="secondary" size="small"
                onClick={() => onStateChange({ step: previous })}>
                <span className="f7">{translate('login.goBack', intl)}</span>
              </Button>
            </div>
            <div className="fr mt4">
              <Button
                variation="primary"
                size="small"
                type="submit"
                onClick={e => this.handleOnSubmit(e)}
                isLoading={isLoading}
              >
                <span className="f7">{translate('login.confirm', intl)}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

CodeConfirmation.propTypes = {
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Code set on state */
  code: PropTypes.string.isRequired,
  /** Next step */
  next: PropTypes.number.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  accessKeySignIn: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(
  graphql(accessKeySignIn, { name: 'accessKeySignIn' })(CodeConfirmation)
)
