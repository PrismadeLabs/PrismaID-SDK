import { Component, ElementRef, ViewChild } from "@angular/core"
import { NavController } from "ionic-angular"

import * as createjs from "createjs-module"
import { Container, Shape, Sprite } from "createjs-module"

import { CodeType, DecoderResponseError, DecoderResponseSuccess, HintResponse, InitialisationResponse, InteractionResponse, PrismaSDK, ProgressResponse, SwipeDirection, SwipingGesture } from "@prismadelabs/prismaid"

import { ProgressBar } from "../../classes/ProgressBar"
import { Utils } from "../../classes/utils"
import { ContentManager } from "../../providers/ContentManager"

@Component({
    selector: "page-home",
    templateUrl: "home.html",
})

export class HomePage {
    private static readonly clickSoundID = "click"
    private static readonly dingSoundID = "ding"

    @ViewChild("canvas")
    private canvasRef: ElementRef

    private sdk: PrismaSDK
    private scalePPI: number
    private isLoaded: boolean = false

    private cardColor: string
    private direction: string

    private cover: Shape
    private card: Sprite
    private cardActive: Sprite
    private ringThumb: Sprite
    private ringHand: Sprite
    private thumb: Sprite
    private hand: Sprite
    private backButton: Sprite
    private container: Container
    private arcCommand: any

    private thumbX: number
    private thumbY: number
    private thumbScaleX: number
    private thumbScaleY: number
    private ringThumbX: number
    private ringThumbY: number
    private handX: number
    private handY: number
    private handScaleX: number
    private handScaleY: number
    private ringHandX: number
    private ringHandY: number
    private cardX: number
    private cardY: number
    private cardScaleX: number
    private cardScaleY: number

    private progressBars: ProgressBar[] = []

    constructor(public navCtrl: NavController, private contentManager: ContentManager) {
    }

    private ionViewDidLoad() {
        console.log("ionViewDidLoad: HomePage")

        this.initialisePrismaSDK()
    }

    private ionViewWillEnter() {
        console.log("ionViewWillEnter: HomePage")

        if (this.isLoaded) {
            this.initCreateJS()
        }
    }

    private ionViewDidEnter() {
        console.log("ionViewDidEnter: HomePage")
    }

    private ionViewDidLeave() {
        console.log("ionViewDidLeave: HomePage")
    }

    private initialisePrismaSDK() {
        this.sdk = new PrismaSDK("Mwtx2fLCIZ3BXYoAXVUbl8KM1GKQGhE3oCJyssW9")

        this.sdk.getInitialisation().setExpectedCodeType(CodeType.Displacement)
        this.sdk.getInitialisation().setExpectedSwipingGesture(SwipingGesture.singleSwipe)

        this.sdk.getDetectionSuccessSubject().subscribe((response: DecoderResponseSuccess) => {
            console.log("*) callback success:", response.description())
            this.onSuccess(response.codeId, response.direction)
        })

        this.sdk.getDetectionErrorSubject().subscribe((response: DecoderResponseError) => {
            console.log("*) callback error:", response.description())

            response.hints.forEach((hint) => {
                console.log("*) hint:", hint.description())
            })
        })

        this.sdk.getInteractionSubject().subscribe((response: InteractionResponse) => {
            console.log("*) interaction:", response.event, response.activeSignals)

            if (response.event === "complete") {
                console.log("dismiss progressbar")
                this.dismissProgressBar()
            }
        })

        this.sdk.getInitialisationSubject().subscribe((response: InitialisationResponse) => {
            console.log("*) config data:", response.codeSetTypes, response.dpi, response.devicePixelRatio)

            this.contentManager.setDPI(response.dpi)
            this.contentManager.setDPR(response.devicePixelRatio)
            this.scalePPI = this.contentManager.getScalePPI()
            this.initCreateJS()
            this.isLoaded = true
        })

        this.sdk.getProgressSubject().subscribe((response: ProgressResponse) => {
            // console.log("*) progress:", response.progress)
            const direction = response.direction === SwipeDirection.down ? "down" : "up"
            this.drawProgressBar(response.progress, direction, response.swipeRound)
        })

        this.sdk.getHintSubject().subscribe((response: HintResponse) => {
            console.log("*) hint:", response.code, response.message, response.type)
        })

        this.sdk.attachToElement(this.canvasRef.nativeElement)
    }

    private onSuccess(codeId: string, direction: string) {
        console.log("codeId:", codeId, direction)

        switch (codeId) {
            case "code6":
                this.onCodeDetected("blue", direction)
                break

            case "code24":
                this.onCodeDetected("red", direction)
                break

            case "code21":
                this.onCodeDetected("yellow", direction)
                break

            default:
                break
        }
    }

    private onCodeDetected(cardColor, direction) {
        this.cardColor = cardColor
        this.direction = direction

        this.notifyCardDetected()
        this.processCode()
    }

    // Create JS operations
    //

    private initCreateJS() {
        this.contentManager.registerSound("assets/sounds/click.mp3", HomePage.clickSoundID)
        this.contentManager.registerSound("assets/sounds/ding.mp3", HomePage.dingSoundID)

        this.contentManager.notifySpriteSheetLoaded = () => {
            this.didAssetsDownload()
        }

        this.contentManager.notifySpriteSheetProgress = (progress) => {
            this.didAssetsDownloadProgress(progress)
        }

        this.contentManager.initialize(this.canvasRef.nativeElement)

        this.createProgressSpinner()

        // start to load all textures
        //
        this.contentManager.loadTextures()
    }

    private createProgressSpinner() {
        const cover = new createjs.Shape()
        cover.graphics.beginFill("#FFFFFF").drawRect(0, 0, this.contentManager.getWidth(), this.contentManager.getHeight())
        this.contentManager.addChild(cover)

        const arc = new createjs.Shape()
        const x = this.contentManager.getWidth() / 2
        const y = this.contentManager.getHeight() / 2
        arc.graphics.beginStroke("#000000").setStrokeStyle(10)
        this.arcCommand = arc.graphics.arc(x, y, 30, Utils.radians(0), Utils.radians(0), false).command

        this.contentManager.addChild(arc)
        this.contentManager.updateStage()
    }

    private didAssetsDownloadProgress(progress) {
        this.arcCommand.endAngle = Utils.radians((360 / 100) * (progress * 100))
        this.contentManager.updateStageOnce()
    }

    private didAssetsDownload() {
        this.createBackground()
        this.createCard()
        this.createHand()
        this.createThumb()
        this.createHandRing()
        this.createThumbRing()
        this.createContainer()
        this.createBackButton()
        this.createCover()

        this.saveComponentState()
        this.animatePackage()

        this.contentManager.updateStage()
    }

    private createCover() {
        this.cover = new createjs.Shape()
        this.cover.graphics.beginFill("#FFFFFF").drawRect(0, 0, this.contentManager.getWidth(), this.contentManager.getHeight())
        this.cover.alpha = 0.0
        this.contentManager.addChild(this.cover)
    }

    private createBackground() {
        const backgroundImage = this.contentManager.getSprite("background_blue")
        backgroundImage.x = 0
        backgroundImage.y = 0
        backgroundImage.scaleX = this.contentManager.getWidth() / backgroundImage.getBounds().width
        backgroundImage.scaleY = this.contentManager.getHeight() / backgroundImage.getBounds().height
        this.contentManager.addChild(backgroundImage)
    }

    private createBackButton() {
        this.backButton = this.contentManager.getSprite("Back Button")
        this.backButton.x = this.getX(7)
        this.backButton.y = this.getY(5)
        this.backButton.scaleX = this.contentManager.getScaleRatio()
        this.backButton.scaleY = this.contentManager.getScaleRatio()
        this.contentManager.addChild(this.backButton)
        this.backButton.alpha = 0.0
        this.backButton.on("click", (event) => {
            this.contentManager.playSound(HomePage.clickSoundID)

            createjs.Tween.get(this.backButton).to({
                scaleX: this.contentManager.getScaleRatio() * 0.9,
                scaleY: this.contentManager.getScaleRatio() * 0.9,
            })
                .wait(100)
                .to({ scaleX: this.contentManager.getScaleRatio(), scaleY: this.contentManager.getScaleRatio() })
                .call(() => {
                    this.goToInitialState()
                })
        })
    }

    private createCard() {
        this.card = this.contentManager.getSprite("card_grey")
        this.card.x = this.contentManager.getWidth() / 2
        this.card.y = this.contentManager.getHeight() / 2
        this.card.regX = this.card.getBounds().width / 2
        this.card.regY = this.card.getBounds().height / 2
        this.card.scaleX = this.getScalePPI()
        this.card.scaleY = this.getScalePPI()

        const cardBounds = this.card.getBounds()
        const cardWidth = cardBounds.width * this.getScalePPI()
        const cardHeight = cardBounds.height * this.getScalePPI()
        const cardX = this.card.x - cardWidth / 2
        const cardY = this.card.y - cardHeight / 2

        const progressBar = new ProgressBar(this.contentManager, cardX, cardY, cardWidth, cardHeight, "normal", "#17942D", 1.0)
        this.progressBars.push(progressBar)
    }

    private createHand() {
        this.hand = this.contentManager.getSprite("hand")
        this.hand.x = (this.contentManager.getWidth() / 2) - this.getX(15)
        this.hand.y = this.card.y + this.getYPPI(215)
        this.hand.scaleX = this.getScalePPI()
        this.hand.scaleY = this.getScalePPI()
    }

    private createThumb() {
        this.thumb = this.contentManager.getSprite("thumb")
        this.thumb.x = this.card.x - this.getXPPI(105)
        this.thumb.y = this.card.y + this.getXPPI(200)
        this.thumb.regX = this.thumb.getBounds().width
        this.thumb.scaleX = this.getScalePPI()
        this.thumb.scaleY = this.getScalePPI()
    }

    private createHandRing() {
        this.ringHand = this.contentManager.getSprite("Ringe Hand")
        this.ringHand.x = this.contentManager.getWidth() / 2
        this.ringHand.y = this.card.y + this.getYPPI(200)
        this.ringHand.regX = this.ringHand.getBounds().width / 2
        this.ringHand.scaleX = this.getScalePPI()
        this.ringHand.scaleY = this.getScalePPI()
    }

    private createThumbRing() {
        this.ringThumb = this.contentManager.getSprite("Ringe Daumen")
        this.ringThumb.x = this.card.x - this.getXPPI(125)
        this.ringThumb.y = this.card.y + this.getYPPI(190)
        this.ringThumb.regX = this.ringThumb.getBounds().width / 2
        this.ringThumb.scaleX = this.getScalePPI()
        this.ringThumb.scaleY = this.getScalePPI()
    }

    private createContainer() {
        this.container = new createjs.Container()
        this.container.addChild(this.progressBars[0].getShape(), this.card, this.ringHand, this.ringThumb, this.thumb, this.hand)
        this.contentManager.addChild(this.container)
    }

    private saveComponentState() {
        this.cardX = this.card.x
        this.cardY = this.card.y
        this.cardScaleX = this.card.scaleX
        this.cardScaleY = this.card.scaleY

        this.handX = this.hand.x
        this.handY = this.hand.y
        this.handScaleX = this.hand.scaleX
        this.handScaleY = this.hand.scaleY

        this.ringHandX = this.ringHand.x
        this.ringHandY = this.ringHand.y

        this.thumbX = this.thumb.x
        this.thumbY = this.thumb.y
        this.thumbScaleX = this.thumb.scaleX
        this.thumbScaleY = this.thumb.scaleY

        this.ringThumbX = this.ringThumb.x
        this.ringThumbY = this.ringThumb.y
    }

    private restoreComponentState() {
        this.card.x = this.cardX
        this.card.y = this.cardY
        this.card.scaleX = this.cardScaleX
        this.card.scaleY = this.cardScaleY

        this.hand.x = this.handX
        this.hand.y = this.handY
        this.hand.scaleX = this.handScaleX
        this.hand.scaleY = this.handScaleY

        this.ringHand.x = this.ringHandX
        this.ringHand.x = this.ringHandY

        this.thumb.x = this.thumbX
        this.thumb.y = this.thumbY
        this.thumb.scaleX = this.thumbScaleX
        this.thumb.scaleY = this.thumbScaleY

        this.ringThumb.x = this.ringThumbX
        this.ringThumb.y = this.ringThumbY
    }

    private animatePackage() {
        this.thumb.alpha = 0.0
        this.ringThumb.alpha = 0.0
        this.hand.alpha = 0.0
        this.ringHand.alpha = 0.0

        this.card.x = this.cardX + this.contentManager.getWidth()
        this.card.y = this.cardY + this.contentManager.getHeight()
        this.card.scaleX = this.cardScaleX * 1.2
        this.card.scaleY = this.cardScaleY * 1.2

        // fade-in the card with scaling
        createjs.Tween.get(this.card)
            .wait(0)
            .to({ x: this.cardX, y: this.cardY }, 500)
            .wait(0)
            .to({ scaleX: this.cardScaleX, scaleY: this.cardScaleY }, 300, createjs.Ease.cubicOut)
            .call(() => {
                this.animateThumbAndRing()
            })
    }

    private animateThumbAndRing() {
        this.thumb.x = this.thumbX - 300
        this.thumb.y = this.thumbY + 300
        this.thumb.scaleX = this.thumbScaleX * 1.2
        this.thumb.scaleY = this.thumbScaleX * 1.2
        this.thumb.alpha = 1.0

        // fade-in the thumb with scaling
        createjs.Tween.get(this.thumb)
            .wait(100)
            .to({ x: this.thumbX, y: this.thumbY }, 500)
            .wait(0).to({ scaleX: this.thumbScaleX, scaleY: this.thumbScaleY }, 300, createjs.Ease.cubicOut)
            .call(() => {
                // show the thumb ring
                createjs.Tween.get(this.ringThumb)
                    .wait(100)
                    .to({ alpha: 1.0 }, 200)
                    .call(() => {
                        this.animateHandAndRing()
                    })
            })
    }

    private animateHandAndRing() {
        this.hand.x = this.handX + 250
        this.hand.y = this.handY + 200
        this.hand.scaleX = this.handScaleX * 1.2
        this.hand.scaleY = this.handScaleY * 1.2
        this.hand.alpha = 1.0

        this.ringHand.x = this.ringHandX
        this.ringHand.y = this.ringHandY

        this.animationHandOnPlaceDown(() => {
            this.animationHandUp(() => {
                this.animationHandRemove(() => {
                    this.animateHandAndRing()
                })
            })
        })
    }

    private animationHandOnPlaceDown(callback?: () => void) {
        // fade-in the hand with scaling
        createjs.Tween.get(this.hand)
            .to({ x: this.handX, y: this.handY }, 500)
            .wait(0).to({ scaleX: this.handScaleX, scaleY: this.handScaleY }, 300, createjs.Ease.cubicOut)
            .call(() => {
                // show the hand ring
                createjs.Tween.get(this.ringHand)
                    .wait(100)
                    .to({ alpha: 1.0 }, 200)
                    .call(() => {
                        if (callback) { callback() }
                    })
            })
    }

    private animationHandRemove(callback?: () => void) {
        // remove the ring and the hand
        createjs.Tween.get(this.ringHand)
            .to({ alpha: 0.0 }, 200)

        // move hand outside
        createjs.Tween.get(this.hand)
            .to({ scaleX: this.handScaleX * 1.2, scaleY: this.handScaleY * 1.2 }, 300, createjs.Ease.cubicIn)
            .wait(0).to({ x: this.hand.x + 250, y: this.hand.y + 200 }, 500)
            .wait(1000)
            .call(() => {
                // repeat hand/ring animation
                if (callback) { callback() }
            })

    }

    private animationHandUp(callback?: () => void) {
        // move ring and the hand up
        createjs.Tween.get(this.ringHand)
            .wait(0)
            .to({ y: this.ringHandY - this.getYPPI(466) }, 700, createjs.Ease.cubicInOut)

        createjs.Tween.get(this.hand)
            .wait(0)
            .to({ y: this.handY - this.getYPPI(466) }, 700, createjs.Ease.cubicInOut)
            .wait(0)
            .call(() => {
                if (callback) { callback() }
            })
    }

    private drawProgressBar(progress: number, direction: string = "none", phase: number = 1.0) {

        const index = phase - 1

        if (index < this.progressBars.length) {
            this.progressBars[index].draw(progress, direction)
            this.contentManager.updateStageOnce()
        }
    }

    private dismissProgressBar() {

        this.progressBars.forEach((progressBar, index, array) => {
            progressBar.dismiss()
        })
    }

    private hideProgressBar() {
        this.progressBars.forEach((progressBar, index, array) => {
            progressBar.hide()
        })
    }

    private notifyCardDetected() {
        this.contentManager.playSound(HomePage.dingSoundID)

        createjs.Tween.removeAllTweens()

        createjs.Tween.get(this.cover).to({ alpha: 0.7 }, 200).to({ alpha: 0.0 }, 100)
        createjs.Tween.get(this.hand).to({ alpha: 0.0 }, 500)
        createjs.Tween.get(this.ringHand).to({ alpha: 0.0 }, 500)
        createjs.Tween.get(this.thumb).to({ alpha: 0.0 }, 500)
        createjs.Tween.get(this.ringThumb).to({ alpha: 0.0 }, 500)
    }

    private processCode() {
        if (this.container.contains(this.cardActive)) {
            this.container.removeChild(this.cardActive)
        }

        const cardName = `card_${this.cardColor}_${this.direction}`
        this.cardActive = this.contentManager.getSprite(cardName)
        this.cardActive.x = this.contentManager.getWidth() / 2
        this.cardActive.y = this.contentManager.getHeight() / 2
        this.cardActive.regX = this.card.getBounds().width / 2
        this.cardActive.regY = this.card.getBounds().height / 2
        this.cardActive.scaleX = this.getScalePPI()
        this.cardActive.scaleY = this.getScalePPI()
        this.cardActive.alpha = 0.0
        this.container.addChild(this.cardActive)

        this.contentManager.updateStageOnce()

        createjs.Tween.get(this.cardActive).wait(100)
            .to({ alpha: 1.0 }, 500)
            .call(() => {
                createjs.Tween.get(this.backButton).wait(100).to({ alpha: 1.0 }, 300)
            })
    }

    private goToInitialState() {
        createjs.Tween.get(this.backButton).wait(100).to({ alpha: 0.0 }, 300)

        const cardScaleX = this.cardActive.scaleX
        const cardScaleY = this.cardActive.scaleY

        createjs.Tween.get(this.cardActive).wait(100)
            .to({
                scaleX: cardScaleX * 1.2,
                scaleY: cardScaleY * 1.2,
            }, 300, createjs.Ease.cubicOut)
            .to({
                x: this.cardActive.x + this.contentManager.getWidth(),
                y: this.cardActive.y + this.contentManager.getHeight(),
            }, 500)
            .wait(500)
            .call(() => {
                this.cardActive.alpha = 0.0
                this.container.removeChild(this.cardActive)
                this.contentManager.updateStageOnce()

                this.restoreComponentState()
                this.animateThumbAndRing()
            })
    }

    private getScalePPI() {
        return this.scalePPI
    }

    private getXPPI(x: number): number {
        return x * (this.getScalePPI() / 0.5)
    }

    private getYPPI(y: number): number {
        return y * (this.getScalePPI() / 0.5)
    }

    private getX(x: number): number {
        return x * this.contentManager.getScaleRatioX()
    }

    private getY(y: number): number {
        return y * this.contentManager.getScaleRatioY()
    }
}
