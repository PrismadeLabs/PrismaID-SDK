# PrismaID Web SDK

![Version](https://img.shields.io/npm/v/@prismadelabs/prismaid.svg) ![Size](https://img.shields.io/bundlephobia/min/@prismadelabs/prismaid.svg) ![Types](https://img.shields.io/npm/types/@prismadelabs/prismaid.svg)

## Overview

The PrismaID Web SDK is intended to be used in a web application and collect signals created by a PrismaID tag. The PrismaID Web SDK will internally talk to the Prismade Decoder Backend and decode that signal. The result is sent back to the application through a callback. In addition to information related to the decoded data, there are events for user interaction and potential hints to improve reading results.

## Authentication

To use this SDK, you need a valid API-Key. For testing purposes, you can use the key `SCvL5XDWme6pOy0Cbi6UN4WBGJSkEboM9y0fXo7T` which is limited to detection of our demo card set. See www.prismade.com for additional information.

## Install

```bash
npm install @prismadelabs/prismaid
```

## Usage

At the moment we provided three minimalistic samples how to use the Web SDK in

-   Javascript application
-   Ionic application
-   React application

## Table of Contents

-   [Use SDK in Javascript application](#Use-SDK-in-Javascript-application)
-   [Use SDK in Ionic application](#Use-SDK-in-Ionic-application)
-   [Use SDK in React application](#Use-SDK-in-React-application)
-   [API reference](#API-reference)
-   [Subscriptions](#Subscriptions)

## Use SDK in Javascript application

It is assumed that one is experienced to create a web application, so we will not go too much into detail here. The SDK needs to collect raw touch events from any HTML element, in our example a canvas. Therefore, we will need a simple HTML page with a canvas. Secondly, the page has to include our JavaScript sample file.

```html
# index.html

<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8" />
        <title>Prisma SDK</title>
        <meta
            name="viewport"
            content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
    </head>

    <body>
        <canvas id="prismasdk" style="position: fixed; left: 10px; top: 10px; "> </canvas>

        <!-- The main bundle js is generated via browserify -->
        <script src="./bundle.js"></script>
    </body>
</html>
```

```javascript
# main.js

const pl = require("@prismadelabs/prismaid")

const canvas = document.getElementById("prismasdk")
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20

const sdk = new pl.PrismaSDK("YOUR_API_KEY")
const version = "Prisma SDK version " + pl.PrismaSDK.version()

const ctx = canvas.getContext("2d")
ctx.fillStyle = "blue"
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = "white"
ctx.font = "15px Arial"
ctx.fillText(version , 10, 20)

sdk.getDetectionSuccessSubject().subscribe((response) => {
    console.log("*) detection success:", response.description())

    ctx.fillStyle = "blue"
    ctx.fillRect( 10, 30, 100, 20)
    ctx.fillStyle = "white"
    ctx.fillText(`${response.codeId}-${response.direction}`, 10, 40)
})

sdk.getDetectionErrorSubject().subscribe((response) => {
    console.log("*) detection error:", response.description())

    response.hints.forEach((hint) => {
        console.log("*) hint:", hint.description())
    })
})

sdk.getInteractionSubject().subscribe((response) => {
    console.log("*) interaction event:", response.event, response.activeSignals)
})

sdk.getInitialisationSubject().subscribe((response) => {
    console.log("*) config data:", response.codeSetTypes, response.dpi, response.devicePixelRatio)
})

sdk.getProgressSubject().subscribe((response) => {
    console.log("*) progress:", response.progress)
})

sdk.getHintSubject().subscribe((response) => {
    console.log("*) hint:", response.code, response.message, response.type)
})

sdk.getConnectivitySubject().subscribe((response) => {
    console.log("*) connectivity:", response.status)
})

sdk.getUsabilitySubject().subscribe((response) => {
    console.log("*) usability response:", response.event, response.payload, response.localizedMessage())
})

sdk.attachToElement(canvas)

...

```

## Use SDK in Ionic application

It is assumed that one is experienced with Ionic applications, so we will not go into detail here. [Learn more](https://ionicframework.com/docs/intro/tutorial/)

```html
# home.html

<ion-content>
    <canvas #canvas id="home"></canvas>
</ion-content>
```

```typescript
import { Component, ElementRef, ViewChild } from "@angular/core"
import { NavController } from "ionic-angular"

import { CodeType, DecoderResponseError, DecoderResponseSuccess, HintResponse, InitialisationResponse, InteractionResponse, PrismaSDK, ProgressResponse, SwipeDirection, SwipingGesture } from "@prismadelabs/prismaid"

@Component({
    selector: "page-home",
    templateUrl: "home.html",
})

export class HomePage {
    @ViewChild("canvas")
    private canvasRef: ElementRef

    private sdk: PrismaSDK

    constructor(public navCtrl: NavController, private contentManager: ContentManager) {
    }

    private ionViewDidLoad() {
        console.log("ionViewDidLoad: HomePage")

        this.initialisePrismaSDK()
    }

    private initialisePrismaSDK() {
        this.sdk = new PrismaSDK("YOUR_API_KEY")

        this.sdk.getInitialisation().setExpectedCodeType(CodeType.Displacement)
        this.sdk.getInitialisation().setExpectedSwipingGesture(SwipingGesture.singleSwipe)

        this.sdk.getDetectionSuccessSubject().subscribe((response: DecoderResponseSuccess) => {
            console.log("*) callback success:", response.codeId, response.direction)
        })

        this.sdk.getDetectionErrorSubject().subscribe((response: DecoderResponseError) => {
            console.log("*) callback error:", response.description())

            response.hints.forEach((hint) => {
                console.log("*) hint:", hint.description())
            })
        })

        this.sdk.getInteractionSubject().subscribe((response: InteractionResponse) => {
            console.log("*) interaction:", response.event, response.activeSignals)
        })

        this.sdk.getInitialisationSubject().subscribe((response: InitialisationResponse) => {
            console.log("*) config data:", response.codeSetTypes, response.dpi, response.devicePixelRatio)
        })

        this.sdk.getProgressSubject().subscribe((response: ProgressResponse) => {
            console.log("*) progress:", response.progress, response.direction, response.swipeRound)
        })

        this.sdk.getHintSubject().subscribe((response: HintResponse) => {
            console.log("*) hint:", response.code, response.message, response.type)
        })

        this.sdk.getUsabilitySubject().subscribe((response: UsabilityResponse) => {
            console.log("*) usability response:", response.event, response.payload, response.localizedMessage())
        })

        this.sdk.attachToElement(this.canvasRef.nativeElement)
    }

    ....
```

## Use SDK in React application

It is assumed that one is experienced with React applications, so we will not go into detail here. [Learn more](https://reactjs.org/tutorial/tutorial.html)

```typescript SDK.tsx
import { PrismaSDK } from "@prismadelabs/prismaid";

class SDKSingleton {
  private static instance: SDKSingleton;
  sdk: PrismaSDK;

  constructor() {
    if (SDKSingleton.instance) {
      throw new Error("Error - use SDKSingleton.getInstance()");
    }
    this.sdk = new PrismaSDK(YOUR_API_KEY);
  }

  static getInstance(): SDKSingleton {
    SDKSingleton.instance = SDKSingleton.instance || new SDKSingleton();
    return SDKSingleton.instance;
  }
}

export default SDKSingleton;
```

```typescript index.tsx
import { ConnectivityResponse, UsabilityResponse } from "@prismadelabs/prismaid";
import { useEffect, useRef, useState } from "react";
import SDKSingleton from "SDK";

interface Props {}

// component
const SwipeField = (props: Props) => {
  const [sdk] = useState(SDKSingleton.getInstance().sdk);

  // configure sdk
  useEffect(() => {
    sdk.resume();
    let initialisationSubject = sdk.getInitialisationSubject().subscribe((response) => {
      console.log("*) initialisationResponse", response);
    });

    const usabilitySubject = sdk.getUsabilitySubject().subscribe((response: UsabilityResponse) => {
      console.log("*) usabilityResponse", response);
    });

    const detectionSuccessSubject = sdk.getDetectionSuccessSubject().subscribe((response) => {
      console.log("*) detection success:", response.description());
    });

    const detectionErrorSubject = sdk.getDetectionErrorSubject().subscribe((response) => {
      console.log("*) detection error:", response.description());
    });

    const interactionSubject = sdk.getInteractionSubject().subscribe((response) => {
      console.log("*) interaction response:", response);
    });

    const progressSubject = sdk.getProgressSubject().subscribe((response) => {
      console.log("*) progress:", response.progress);
    });

    const connectivitySubject = sdk.getConnectivitySubject().subscribe((response: ConnectivityResponse) => {
      console.log("*) connectivity response:", response.status);
    });

    const screen = document.querySelector("#swipeScreen");
    if (screen) {
      sdk.attachToElement(screen);
    }

    return () => {
      initialisationSubject.unsubscribe();
      usabilitySubject.unsubscribe();
      progressSubject.unsubscribe();
      connectivitySubject.unsubscribe();
      detectionSuccessSubject.unsubscribe();
      detectionErrorSubject.unsubscribe();
      interactionSubject.unsubscribe();
    };
  }, []);
  return (
      <div id="swipeScreen" className="absolute top-0 left-0 w-screen h-full overflow-hidden">
            
      </div>
  );
};
export default SwipeField;

```

## API reference

### `class PrismaSDK`

```typescript
public expectedCodeType?: CodeType
```

Set this property if your application supports detection of multiple `CodeType`s, but you at this point in time you expect only a specific one.

```typescript
public expectedCodeHeight?: number
```

Set this property if your application requires the user to swipe a specific height on the card, but at this point in time you don't need to set it.

```typescript
public expectedSwipingGesture?: SwipingGesture
```

Set this property if your application supports multiple `SwipingGesture`s, but you at this point in time you expect only a specific one.

```typescript
public isFirstStart: boolean
```

This property tells you if the application was started for the first time on this device/browser (determined using cookie).

```typescript
constructor(APIKey: string, serverURL: string = "https://api.prismade.net/prismaid")
```

The `APIKey` identifies your application towards the server. `serverURL` is a optional parameter used to override the API baseURL of the SDK. You can use `https://api-dev.prismade.net/prismaid` to connect to the development environment. However, you will need a different `APIKey` there.

```typescript
function pause()
```

Call this method to stop the SDK from recording any signals and processing them. All currently open operations will still be finished and responses will be sent.

```typescript
function resume()
```

Call this to resume normal operation of the SDK.

```typescript
function resetManual()
```

Call this to manually reset the operations of the SDK.

```typescript
function isRunningStandalone(): boolean
```

This method will tell you if the application is currently executed in "standalone" mode (e.g. iOS home screen).

```typescript
function setCustomPayload(jsonObject: any): boolean
```

Use this function to set a custom payload (JSON compatible object) to the server. This is only required, if your application requires a callback from the PrismaID backend to your own backend servers. Needs to be configured for your `APIKey` first. Method returns `true` if a valid payload was provided.

```typescript
function setLanguage(language: string | undefined)
```

This method will force the SDK to return localized event in a specific language. Provide a lowercase countrycode here (`de`, `en`, ...). If the specified localization doesn't exist, falls back to `en`.

### `enum CodeType`

```typescript
{
    Axel = "Axel",
    AxelZip = "AxelZip",
    AxelZipShort = "AxelZipShort",
    Displacement = "Displacement",
    DisplacementKey = "DisplacementKey",
    Tick = "Tick",
    Pack = "Pack",
    Tornado = "Tornado",
    DisplacementZip = "DisplacementZip",
    DisplacementZipShort = "DisplacementZipShort",
}
```

### `enum SwipingGesture`

```typescript
{
    singleSwipe,
    scratch,
    tick,
}
```

## Subscriptions

Use subscriptions to get notified of different events that happen before, during or after PrismaID use.

### `InitialisationResponse`

Evaluate this response the get device specific information, like support and display density.

```typescript
public codeSetTypes: CodeType[]
```

```typescript
public ppi: number
```

```typescript
public devicePixelRatio: number
```

```typescript
public clientConfig: ClientConfig
```

```typescript
public deviceSupport: DeviceSupport
```
```typescript
public isDisplayZoomEnabled: boolean
```
The sdk sets this to true if it detects a display zoom setting enabled on the smartphone.

### TutorialResponse

Use this response to initialize [PrismaID-Tutorial](https://github.com/PrismadeLabs/PrismaID-Tutorial).

```typescript
public ppi: number
```

```typescript
public devicePixelRatio: number
```

```typescript
public deviceSupport: DeviceSupport
```

```typescript
public slideTypes: TutorialSlideType[] = []
```

### DecoderResponseSuccess

Use this response to find out about a successfully detected PrismaID.

```typescript
public readonly codeId: string
```

ID of the PrismaID.

```typescript
public readonly codeSet: string
```

CodeSet name of the PrismaID.

```typescript
public readonly probability: number
```

Probability (0-1) that this detection is correct.

```typescript
public readonly direction: string
```

The direction of the user interaction.

```typescript
public readonly rawData: any
```

Raw data of the response, only required in combination with `setCustomPayload()`.

### DecoderResponseError

Use this response to find out when a detection failed.

```typescript
public readonly errorCode: string
```

Error reason code.

```typescript
public readonly message: string
```

Technical error message. Do not display this to the user.

```typescript
public readonly hints: DecoderHint[] = []
```

List of potential hints for the user to improve results. Do not use directly, use `HintResponse` instead.

### InteractionResponse

Use this response to find out about PrismaID interaction events.

```typescript
public event: string
```

-   `"started"` - Interaction with the device started. This typically happens, when the user touches the screen with finger or PrismaID.
-   `"changed"` - Triggered when specific characteristics of the signal change, only required for special applications.
-   `"complete"` - Interaction with the device finished. This typically happens, when the user removed PrismaID and finger from the screen.

### ProgressResponse

Use this response to find about the progress of user interaction.

```typescript
public progress: number
```

Value between 0 and 100. When value reached 100, user can take PrismaID off the screen.

```typescript
public direction: SwipeDirection
```

Current direction of the interaction.

```typescript
public scratchRound: number
```

For scratch codes, the number of "rounds" the user scratched.

### HintResponse

Use this response to show hints to the user after a failed detection.

```typescript
public code: string
```

```typescript
public type: string
```

```typescript
public message: string
```

### UsabilityResponse

Use this to response to guide the user through the PrismaID detection and give feedback about incorrect interaction.

```typescript
public event: string
```

-   `"browser_not_supported"` - Current browser is on blacklist of unsupported browsers.
-   `"browser_support_unknown"` - Current browser is unknown.
-   `"device_not_supported"` - Current device is on blacklist of unsupported devices.
-   `"display_too_small_displacement"`, `"display_too_small_pack"`, `"display_too_small_tick"`, `"display_too_small_tornado"` - The display of this device is too small to fit the PrismaID.
-   `"hold_card_below_swipe"` - User is not holding the PrismaID in the bottom.
-   `"hold_with_one_finger_only"` - User uses multiple fingers to hold the PrismaID.
-   `"pick_up_code_from_display"` - User should pick up the PrismaID from screen.
-   `"display_small_should_add_to_home"` - Display is too small without adding the application to home screen and run in standalone mode.
-   `"take_device_in_hand"` - User should take the device in their hands, not place them on a table. This usually improves detection accuracy.

```typescript
public payload?: any
```

Some events come with a specific payload of additional data, e.g. a list of device specific usage requirements.
