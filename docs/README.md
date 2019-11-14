# VTEX Login app

## Description

The VTEX Login app responsible to handle user login, and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [2.x]  | **Current Release** |   2018-11-08    |                       |             |         2.x         |
|  [1.x]  | **Maintenance LTS** |   2018-07-26    |      2018-11-08       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Features](#features)
  - [Query Parameters](#query-parameters)
- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Plugins API](#plugins-api)
    - [User Identifier Extension](#user-identifier-extension)
      - [Creating the User Identifier Extension App](#creating-the-user-identifier-extension-app)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Features

### Query Parameters

This app reads the following Query String Parameters:

- `returnUrl` - After the user logs in, he is redirected to the `returnUrl`. This parameter should be UTF-8 encoded (as of javascript's `encodeURIComponent`). The `returnUrl` only works for the store's domain.

- `oAuthRedirect` - If this parameter is present, the user is directly redirected to the given OAuth Provider page before logging in, instead of displaying the login options. For this to work, the given OAuth Provider must be one of the login options. The parameter value is case sensitive and must be `Google`, `Facebook` or the registered name of the chosen OAuth Provider.

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the login as a block in our [Store Header](https://github.com/vtex-apps/store-header/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  "dependencies": {
    "vtex.login": "2.x"
  }
```

Then, add `login` or `login-content` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json). `login-content` is just the login form and `login` contains the login form and adds the possibility of other display modes such as pop-up.

Now, you can change the behavior of the `login` block that is in the store header. See an example of how to configure:

```json
"login": {
  "props": {
    "emailAndPasswordTitle": "LOG-IN",
    "accessCodeTitle": "Acess Code LOG-IN",
    "emailPraceholder": "e-mail",
    "passwordPlaceholder": "password",
    "showPasswordVerificationIntoTooltip": true,
  }
}
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within `login` and `login-content` and describes if they are required or optional.

```json
{
  "login": {
    "component": "Login"
  },
  "login-content": {
    "component": "LoginContent"
  }
}
```

For now these blocks do not have any required or optional blocks.

#### Configuration

Through the Storefront, you can change the `login`'s behavior and interface. However, you also can make in your theme app, as Store theme does.

| Prop name                                         | Type                                    | Description                                              | Default value |
| ------------------------------------------------- | --------------------------------------- | -------------------------------------------------------- | ------------- |
| `optionsTitle`                                    | `String`                                | Set title of login options                               | -             |
| `emailAndPasswordTitle`                           | `String`                                | Set title of login with email and password               | -             |
| `accessCodeTitle`                                 | `String`                                | Set title of login by access code                        | -             |
| `emailPlaceholder`                                | `String`                                | Set placeholder to email input                           | -             |
| `passwordPlaceholder`                             | `String`                                | Set placeholder to password input                        | -             |
| `showPasswordVerificationIntoTooltip`             | `Boolean`                               | Set show password format verification as tooltip         | -             |
| `acessCodePlaceholder`                            | `String`                                | Set placeholder to access code input                     | -             |
| `showIconProfile`                                 | `Boolean`                               | Enables icon `hpa-profile`                               | -             |
| `iconSize` (DEPRECATED - use iconsProps instead)  | `Number`                                | Set size of the profile icon                             | -             |
| `iconLabel`                                       | `String`                                | Set label of the login button                            | -             |
| `labelClasses`                                    | `String`                                | Label's classnames                                       | -             |
| `providerPasswordButtonLabel`                     | `String`                                | Set Password login button text                           | -             |
| `hasIdentifierExtension`                          | `Boolean`                               | Enables identifier extension configurations              | -             |
| `identifierPlaceholder`                           | `String`                                | Set placeholder for the identifier extension             | -             |
| `invalidIdentifierError`                          | `String`                                | Set error message for invalid user identifier            | -             |
| `mirrorTooltipToRight`                            | `Boolean`                               | Makes login tooltip open towards the right side          | -             |
| `iconsProps`                                      | `{ "viewBox": String, "size": Number }` | Props to be passed down to the icons from `store-icons`. | -             |

You can also change the `login-content`'s behaviour and interface through the Store front.

| Prop name                             | Type      | Description                                                                           | Default value |
| ------------------------------------- | --------- | ------------------------------------------------------------------------------------- | ------------- |
| `isInitialScreenOptionOnly`           | `Boolean` | Set to show only the login options on the initial screen                              | true          |
| `defaultOption`                       | `Enum`    | Set the initial form to show. 0 for access code login, 1 for email and password login | 0             |
| `optionsTitle`                        | `String`  | Set title of login options                                                            | -             |
| `emailAndPasswordTitle`               | `String`  | Set title of login with email and password                                            | -             |
| `accessCodeTitle`                     | `String`  | Set title of login by access code                                                     | -             |
| `emailPlaceholder`                    | `String`  | Set placeholder to email input                                                        | -             |
| `passwordPlaceholder`                 | `String`  | Set placeholder to password input                                                     | -             |
| `showPasswordVerificationIntoTooltip` | `Boolean` | Set show password format verification as tooltip                                      | -             |
| `acessCodePlaceholder`                | `String`  | Set placeholder to access code input                                                  | -             |
| `providerPasswordButtonLabel`         | `String`  | Set Password login button text                                                        | -             |
| `hasIdentifierExtension`              | `Boolean` | Enables identifier extension configurations                                           | -             |
| `identifierPlaceholder`               | `String`  | Set placeholder for the identifier extension                                          | -             |
| `invalidIdentifierError`              | `String`  | Set error message for invalid user identifier                                         | -             |

### Plugins API

This app can be extended through the `plugins.json` file of the store builder. The extension is only allowed for `enterprise` clients and can change the login functionality. It is explained in the following section.

#### User Identifier Extension

The Email/Password login takes two inputs:

- The user email (his identifier)
- The user password

The `User Identifier Extension` allows other identifiers to be used in the login form, _as long as it can be resolved to the user email_.
For example, if your account stores the National Identity Document of each user, the Email/Password login would be changed to ask for the following two inputs:

- The user National Identity Document (his identifier)
- The user password

There is a limitation to this feature. Every user must have an email to be logged in, so the user identifier _must be able to be resolved to an email_. If you want to use an identifier other than the email, you must create a resolver app (or an extension app) that returns an email, given an identifier.
For example, imagine the user `John`, whose email is `john@example.com` and whose National Identity Document is `12345`. When he types his document (`12345`), your app must receive the `12345`, find out that it belongs to John, find out that John's email is `john@example.com` and return this email to the login app.

When an extension app returns an email to the login app, it acts like the user just typed in that email. So if it returns `null`, for example, a message like `"The email is invalid"` will appear. This message, along with some others, may be edited in the Store Front, as described in the `Blocks API` section (eg. `"The User Identifier Extension is invalid"`).

##### Creating the User Identifier Extension App

To create your extension app, there are five steps you must worry about.

- First, you must add `login` as your app's dependency. In the `manifest.json` file:

```json
"dependencies": {
  "vtex.login": "2.x"
},
```

- Second, you need to add the `store` builder to your app. In the `manifest.json` file:

```json
"builders": {
  "store": "0.x",
},
```

- Third, you must extend the `user-identifier` `interface` defined by the login app. You can choose any interface name you want, which will be represented here by {{InterfaceName}}. You will need to create a component for that interface, but for now it will be represented by {{ComponentName}}. In the `store/interfaces.json` file:

```json
"user-identifier.{{InterfaceName}}": {
  "component": "{{ComponentName}}"
},
```

- Fourth, you must plug in your `interface` to the login app. In the `store/plugins.json` file:

```json
"login > user-identifier": "user-identifier.{{InterfaceName}}",
"login-content > user-identifier": "user-identifier.{{InterfaceName}}",
```

- Fifth, you need to create the component that you decided to name {{ComponentName}}. This component will replace the `email` input in the login form. This means that it could render anything, like a File Uploader or a simple Text Input which takes a National Identity Document. Just remember that this component must know how to convert the data it receives to an email. This is done by registering a callback function that returns an email whithin the login app. It will be defined in the file `react/{{ComponentName}}.js`. The following example is a good template to be used, and is commented so you understand each of its parts:

```js
import { useState, useCallback, useEffect } from 'react'

const ComponentName = ({
  renderInput,
  identifierPlaceholder,
  registerSubmitter,
}) => {
  // The component receives 3 props:
  // - renderInput is a function that returns the same Input component used by the login app, defined in styleguide.
  //   It receives an object with three named parameters, trivially used by Inputs with react: value, onChange, placeholder.
  //   When "onChange" is called, the login app clears the "email is invalid" error, if it exists.
  // - identifierPlaceholder is the value of the configuration "identifierPlaceholder" defined in the Store Front. It has a
  //   fallback to the value of the configuration "emailPlaceholder".
  // - registerSubmitter is a function that receives your async callback function defined in this file. Your callback will be called
  //   when the user submits the form.

  // This code controls the state of the rendered Input component.
  const [inputValue, setInputValue] = useState('')
  const onChangeInput = useCallback(e => setInputValue(e.target.value), [
    setInputValue,
  ])

  // This callback function (onSubmit) should return the resolved email. In the example below, it adds `@email.com` to the current
  // value in the Input component (eg. "john" would be resolved to "john@email.com").
  const onSubmit = useCallback(async () => {
    const email = `${inputValue}@email.com`
    return email
  }, [inputValue])

  // This code registers the async callback function you defined in the login app when this component mounts.
  useEffect(() => {
    registerSubmitter(onSubmit)
  }, [registerSubmitter, onSubmit])

  // The component calls "renderInput" and renders its result.
  return renderInput({
    value: inputValue,
    onChange: onChangeInput,
    placeholder: identifierPlaceholder,
  })
}

export default ComponentName
```

After following the five steps, your extension app will be good to go. Just install it in your account and it will replace the `email` Input in the login form.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.login.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

| Class name                 | Description                          | Component Source                                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `container`                | Login main container                 | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `contentInitialScreen`     | Login Content initial screen         | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentFormVisible`       | Login Content form                   | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `profile`                  | Profile email or name when logged in | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `label`                    | Icon label                           | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `optionsSticky`            | Login options in sticky mode         | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsList`              | Login options list                   | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsListItem`          | Login options item                   | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `optionsListItemContainer` | Container in Login options           | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `oauthProvider`            | OAuth provider name                  | [OAuth](/react/components/OAuth.js)                                                                                                                                                                                                          |
| `inputContainer`           | Any input container                  | [CodeConfirmation](/react/components/CodeConfirmation.js), [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js) |
| `inputContainerAccessCode` | Access code input container          | [CodeConfirmation](/react/components/CodeConfirmation.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                                                                                         |
| `inputContainerPassword`   | Password input container             | [EmailAndPassword](/react/components/EmailAndPassword.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                                                                                         |
| `inputContainerEmail`      | Email input container                | [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js)                                                                                                                       |
| `emailVerification`        | Email verification form              | [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js)                                                            |
| `formLinkContainer`        | Container for links                  | [EmailAndPassword](/react/components/EmailAndPassword.js)                                                                                                                                                                                    |
| `arrowUp`                  | Arrow up                             | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `buttonLink`               | Button link                          | [LoginComponent](/react/components/LoginComponent.js)                                                                                                                                                                                        |
| `formError`                | Error form                           | [LoginComponent](/react/components/FormError.js)                                                                                                                                                                                             |
| `content`                  | Login Content container              | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `button`                   | Any button                           | [AccountOptions](/react/components/AccountOptions.js), [LoginOptions](/react/components/LoginOptions.js), [OAuth](/react/components/OAuth.js)                                                                                                |
| `sendButton`               | Buttons sending informations         | [CodeConfirmation](/react/components/CodeConfirmation.js), [EmailAndPassword](/react/components/EmailAndPassword.js), [EmailVerification](/react/components/EmailVerification.js), [RecoveryPassword](/react/components/RecoveryPassword.js) |
| `buttonSocial`             | Button to social media               | [OAuth](/react/components/OAuth.js)                                                                                                                                                                                                          |
| `buttonDanger`             | Danger button                        | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `backButton`               | Back button                          | [GoBackButton](/react/components/GoBackButton.js)                                                                                                                                                                                            |
| `accountOptions`           | Account options container            | [AccountOption](/react/components/AccountOption.js)                                                                                                                                                                                          |
| `codeConfirmation`         | Code Confirmation container          | [CodeConfirmation](/react/components/CodeConfirmation.js)                                                                                                                                                                                    |
| `formTitle`                | Form Title                           | [FormTitle](/react/components/FormTitle.js)                                                                                                                                                                                                  |
| `box`                      | Login box                            | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentContainer`         | Login content container              | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `formFooter`               | Form footer container                | [FormFooter](/react/components/FormFooter.js)                                                                                                                                                                                                |
| `contentForm`              | Login Content form                   | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `contentAlwaysWithOptions` | Login content with options           | [LoginContent](/react/LoginContent.js)                                                                                                                                                                                                       |
| `options`                  | Login Options container              | [LoginOptions](/react/components/LoginOptions.js)                                                                                                                                                                                            |
| `tooltipContainer`         | Tooltip Container                    | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |
| `tooltipContainerTop`      | Tooltip Top                          | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |
| `tooltipContainerLeft`     | Tooltip Left                         | [Tooltip](/react/components/Tooltip.js)                                                                                                                                                                                                      |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/login/issues). Also feel free to [open issues](https://github.com/vtex-apps/login/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.

## Tests

To execute our tests go to `react/` folder and run `yarn test`

### Travis CI

[![Build Status](https://travis-ci.org/vtex-apps/login.svg?branch=master)](https://travis-ci.org/vtex-apps/login)
