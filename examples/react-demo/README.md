# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:4096](http://localhost:4096) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed!

## App Structure

Notice
^
Open > ScreenSize > Start > Tutorial > TouchSensitivity > Swipe > Success/Failure > FAQ

### global state management

Global state is managed with [pullstate](https://lostpebble.github.io/pullstate/)

### i18n

Translations are done with [React-i18next](https://react.i18next.com)

allowed html-tags: b, strong, u, i, sup
register _language_.json in ./src/i18n.tsx

### Google Analytics

add GA id in .env under REACT_APP_GA_ID

trackPageView(clientWindow: any, page: string)
trackInteractiveHelpScreen(clientWindow: any, helpScreen: string)
trackInteractiveHelpClick(clientWindow: any, helpScreen: string, buttonType: HelpScreenButtonType)
trackInteractiveHelpDismiss(clientWindow: any, helpScreen: string)

## Styling

### vh

Avoid 100vh bug by not using 100vh.

Use 100% on the parent containers and prop drilling.

### Icon

https://www.favicon-generator.org

### TailwindCSS

[TailwindCSS](https://tailwindcss.com) is a utility-first CSS framework, sort of like a low-level BootstrapCSS.
The CSS is purged during the build process, meaning all unneeded CSS classes are deleted from the index.css.
To avoid over-purging, please don't get too clever with classNames.

```
// please don't do this
<div className="text-{  error  ?  'red'  :  'green'  }-600"></div>

// instead to this
<div className={  error  ?  'text-red-600'  :  'text-green-600'  }></div>
```

### icons

To search for an icon, use [Feather Icons Search](https://feathericons.com), then use [React-Feather](https://github.com/feathericons/react-feather) as follows.

```
import { PlusCircle } from 'react-feather';

return (
    <div>
        <PlusCircle  className="text-green-700"/>
        ...
    </div>
    )
```

### Notes

React Hook useEffect has missing dependencies
=> ignore warning, if hook needs to be called only once!!!

For linebreaks, add css class _whitespace-pre-wrap_ to element and use _\n_ in _language_.json

### Setup

When using as base for a new app, don't forget to change:
[] icon
[] app name
[] PrismaSDK key
[] GA key
[] page title
[] supported languages
[] translation texts
[] add additional conditions to screenSize depending on code type and/or card size

When pushing to master:
[] remove dev-url
[] GA production key
