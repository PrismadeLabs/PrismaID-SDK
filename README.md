# PrismaID Web SDK

![Beta 1.0.5](https://img.shields.io/badge/beta-1.0.5-red.svg)

## Overview

The PrismaID Web SDK is intended to be used in a web application and collect signals created by a PrismaID tag. The PrismaID Web SDK will internally talk to the Prismade Decoder Backend and decode that signal. The result is sent back to the application through a callback. In addition to information related to the decoded data, there are events for user interaction and potential hints to improve reading results.

## Authentication

To use this SDK, you need a valid API-Key. For testing purposes, you can use the key `Mwtx2fLCIZ3BXYoAXVUbl8KM1GKQGhE3oCJyssW9` which is limited to detection of our standard Demo Set. See www.prismade.com for additional information.

## Install

```bash
npm install @prismadelabs/prismaid
```

## Usage

At the moment we provided two minimalistic samples how to use the Web SDK in

 - Javascript application
 - Ionic application

## Table of Contents

* [Use SDK in Javascript application](#js)
* [Use SDK in Ionic application](#ion)

## Use SDK in Javascript application

It is assumed that one is experienced to create a web application, so we will not go too much into detail here.
The SDK needs to collect raw touch events from any HTML element, in our example a canvas. Therefore, we will need a simple HTML page with a canvas. Secondly, the page has to include our JavaScript sample file.

```html
# index.html

<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <title>Prisma SDK</title>
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>

<body>
    <canvas id="prismasdk" style="position: fixed; left: 10px; top: 10px; ">
    </canvas>

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

        this.sdk.attachToElement(this.canvasRef.nativeElement)
    }

    ....
```
