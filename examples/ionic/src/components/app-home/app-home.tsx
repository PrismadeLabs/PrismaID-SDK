import { Component, Prop, Method } from "@stencil/core"
import {
    PrismaUISDK,
    PLStage,
    PLLoaderProgressResponse,
    PLProgressSpinner,
    PLAsset,
    PLSpriteAlignment,
    PLProgressBar,
    PLAlert,
    PLStatus,
    PLDeviceUtils,
} from "@prismadelabs/prismaidui"
import {
    PrismaSDK,
    DecoderResponseSuccess,
    DecoderResponseError,
    InteractionResponse,
    InitialisationResponse,
    SwipeDirection,
    ProgressResponse,
    UsabilityResponse,
    ConnectivityResponse,
    ConnectivityStatus,
} from "@prismadelabs/prismaid"

import { take } from "rxjs/operators"
import { TutorialContainer } from "../../Classes/TutorialContainer"

@Component({
    tag: "app-home",
    styleUrl: "app-home.css",
})
export class AppHome {
    private static apiKey = "SCvL5XDWme6pOy0Cbi6UN4WBGJSkEboM9y0fXo7T"

    @Prop() private sdkUI: PrismaUISDK

    private sdk: PrismaSDK
    private stage: PLStage
    private arrowCommand: any
    private status: PLStatus = null
    private tutorialContainer: TutorialContainer = null

    private codeID

    @Method() onTutorialClosed() {
        this.sdk.resume()
        this.hideTutorialContainer()
        const tutorial = this.stage.getChildByName("tutorial")
        if (tutorial === null) {
            return
        }
        this.attachTutorialButton(tutorial)
    }

    private attachTutorialButton(tutorial: createjs.DisplayObject) {
        tutorial.on(
            "click",
            () => {
                this.sdk.pause()
                this.sdkUI.playSound("click")
                this.showTutorialContainer()
            },
            null,
            true,
        )
    }

    render() {
        return (
            <ion-content>
                <app-cover id="cover" />
                <app-portrait id="portrait" />
                <canvas id="core" />
            </ion-content>
        )
    }

    componentDidLoad() {
        console.log("AppHome did load")

        this.initialisePrismaSDK()
    }

    private initialisePrismaSDK() {
        this.sdk = new PrismaSDK(AppHome.apiKey)
        this.sdk.setLanguage("en")

        this.sdk.getDetectionSuccessSubject().subscribe((response: DecoderResponseSuccess) => {
            console.log("*) callback success:", response.description())
            this.codeID = response.codeId

            this.stopAnimation()
            this.sdk.pause()
            this.dismissProgressBar(true)
            this.sdkUI.playSound("ding")
            this.flashScreenGreen()

            setTimeout(() => {
                const nav = document.querySelector("ion-nav")
                nav.push("app-verify", { sdkUI: this.sdkUI, codeID: this.codeID })
            }, 500)
        })

        this.sdk.getDetectionErrorSubject().subscribe((response: DecoderResponseError) => {
            console.log("*) callback error:", response.description())

            response.hints.forEach((hint) => {
                console.log("*) hint:", hint.description())
                if (hint.localizedMessage() != hint.code) {
                    this.sdkUI.playSound("error")
                    this.showAlert(hint.localizedMessage(), true)
                }
            })
        })

        this.sdk.getInteractionSubject().subscribe((response: InteractionResponse) => {
            if (response.event === "complete") {
                this.dismissProgressBar(true)
            }

            if (response.event === "started") {
                this.resetAlert()
            }
        })

        this.sdk.getInitialisationSubject().subscribe((response: InitialisationResponse) => {
            console.log("*) config data: ", response.codeSetTypes, response.ppi, response.devicePixelRatio)

            this.prepareUI(response.ppi, response.devicePixelRatio)
        })

        this.sdk.getProgressSubject().subscribe((response: ProgressResponse) => {
            console.log("*) progress:", response.progress)
            const direction = response.direction === SwipeDirection.down ? "down" : "up"
            this.drawProgressBar(response.progress, direction)
        })

        this.sdk.getUsabilitySubject().subscribe((response: UsabilityResponse) => {
            console.log("*) usability response:", response.event, response.payload, response.localizedMessage())

            // TODO: PLSD-353: ZipCode Usability adaptations
            if (response.event !== "hold_card_below_swipe") {
                this.sdkUI.playSound("error")
                this.showAlert(response.localizedMessage(), true)
            }
        })

        this.sdk.getConnectivitySubject().subscribe((response: ConnectivityResponse) => {
            console.log("*) connectivity response:", response.status)

            this.showConnectivityStatus(response.status)
        })

        const canvas: HTMLCanvasElement = document.querySelector("#core")
        this.sdk.attachToElement(canvas)
    }

    private prepareUI(ppi: number, dpr: number) {
        this.sdkUI.dpi = ppi
        this.sdkUI.dpr = dpr

        this.createUI()
    }

    private createUI() {
        const canvas: HTMLCanvasElement = document.querySelector("#core")
        this.stage = this.sdkUI.createStage(canvas, "PLStage")
        this.stage.updateTicker()

        let spinner = this.sdkUI.createProgressSpinner()
        this.stage.addChildWithInfoByName(spinner, "spinner")

        this.sdkUI.loaderSubject.pipe(take(1)).subscribe(() => {
            this.completeUI()
        })

        this.sdkUI.loaderProgressSubject.subscribe((response: PLLoaderProgressResponse) => {
            const spinner = this.stage.getChildByName("spinner") as PLProgressSpinner
            spinner.update(response.progress)
        })

        const customAssets = [new PLAsset("assets/textures/goldenmaster.json", "goldenmaster", "spritesheet")]

        this.sdkUI.loadAssets(customAssets)
    }

    private completeUI() {
        const card = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_card@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
        )

        const frame = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_frame-bold@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
        )

        const hand = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_hand@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            // new createjs.Point(680, 765),
            new createjs.Point(680, 720),
        )

        const holdCard = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_hold-card@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(-220, -10),
        )
        holdCard.alpha = 0.0

        const swipeUp = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_swipe-up@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(150, 450),
        )
        swipeUp.alpha = 0.0

        const thumb = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scna_thumb@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(-405, 140),
        )

        const ringThumb = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_touch@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(-210, 0),
        )
        const ringHand = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_touch@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(148, 370),
        )

        const arrowEnd = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_end-point@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            true,
            true,
            new createjs.Point(147, -612),
        )
        arrowEnd.alpha = 0.25

        const arrow = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_arrow@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            true,
            true,
            new createjs.Point(147, 0),
        )
        const arrowMask = new createjs.Shape()
        this.arrowCommand = arrowMask.graphics
            .beginFill("#fff")
            .drawRect(
                arrow.x - this.getScaled(arrow.getBounds().width) / 2,
                arrow.y - this.getScaled(arrow.getBounds().height) / 2,
                this.getScaled(arrow.getBounds().width),
                this.getScaled(arrow.getBounds().height),
            ).command
        arrow.mask = arrowMask

        const progressBar = this.sdkUI.createProgressBar(0, 0, this.sdkUI.width, this.sdkUI.height, "normal", "#147D19", 1.0)
        this.stage.addChildWithInfoByName(progressBar, "progressBar")
        this.stage.addChildWithInfoByName(card, "card")
        this.stage.addChildWithInfoByName(frame, "frame")
        this.stage.addChildWithInfoByName(holdCard, "holdCard")
        this.stage.addChildWithInfoByName(swipeUp, "swipeUp")
        this.stage.addChildWithInfoByName(arrowEnd, "arrowEnd")
        this.stage.addChildWithInfoByName(arrow, "arrow")
        this.stage.addChildWithInfoByName(ringThumb, "ringThumb")
        this.stage.addChildWithInfoByName(ringHand, "ringHand")
        this.stage.addChildWithInfoByName(hand, "hand")
        this.stage.addChildWithInfoByName(thumb, "thumb")

        const errorAlert = this.createAlert("goldenmaster::02_scan/@2x/scan_layer-red@2x")
        this.stage.addChildWithInfoByName(errorAlert, "errorAlert")

        this.status = this.createStatus()
        this.stage.addChildWithInfoByName(this.status, "status")

        const greenBg = this.sdkUI.createScreenFill("#147D19")
        greenBg.alpha = 0.0
        this.stage.addChildWithInfoByName(greenBg, "greenBg")

        const redBg = this.sdkUI.createScreenFill("#820511")
        redBg.alpha = 0.0
        this.stage.addChildWithInfoByName(redBg, "redBg")

        const tutorial = this.sdkUI.createSprite(
            "goldenmaster::02_scan/@2x/scan_help@2x",
            [PLSpriteAlignment.left, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(60, 8),
        )
        tutorial.mouseEnabled = true
        this.attachTutorialButton(tutorial)
        this.stage.addChildWithInfoByName(tutorial, "tutorial")

        const back = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/back-button@2x",
            [PLSpriteAlignment.left, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(10, 10),
        )
        back.mouseEnabled = true
        back.on(
            "click",
            () => {
                this.sdkUI.playSound("click")

                const nav = document.querySelector("ion-nav")
                nav.popToRoot()

                const startPage = document.querySelector("app-start")
                startPage.onBack()
            },
            null,
            true,
        )
        this.stage.addChildWithInfoByName(back, "back")

        this.createTutorialContainer()

        this.prepareAnimation()
        this.startPulsateFrame()

        setTimeout(() => {
            this.startAnimation()
        }, 1000)

        setTimeout(() => {
            this.stopPulsateFrame()
        }, 4000)

        setTimeout(() => {
            this.showTutorialButton()
        }, 5000)
    }

    private startPulsateFrame() {
        const frame = this.stage.getChildByName("frame")
        const alphaMin = 0.2
        frame.alpha = alphaMin
        createjs.Tween.get(frame, { loop: -1 })
            .to({ alpha: 1.0 }, 500)
            .to({ alpha: alphaMin }, 500)
            .wait(250)
    }

    private stopPulsateFrame() {
        const frame = this.stage.getChildByName("frame")
        createjs.Tween.removeTweens(frame)
        createjs.Tween.get(frame).to({ alpha: 0 }, 500)
    }

    private createTutorialContainer() {
        this.tutorialContainer = new TutorialContainer(this.sdkUI)
        this.tutorialContainer.alpha = 0.0
        this.stage.addChild(this.tutorialContainer)
        this.tutorialContainer.build()
    }

    private destroyTutorialContainer() {
        if (this.tutorialContainer === null) {
            return
        }
        this.stage.removeChild(this.tutorialContainer)
        this.tutorialContainer = null
    }

    private showTutorialContainer() {
        this.destroyTutorialContainer()
        this.createTutorialContainer()
        createjs.Tween.get(this.tutorialContainer).to({ alpha: 1.0 }, 250)
    }

    private hideTutorialContainer() {
        createjs.Tween.get(this.tutorialContainer).to({ alpha: 0.0 }, 250)
    }

    private showTutorialButton() {
        const tutorial = this.stage.getChildByName("tutorial")
        createjs.Tween.get(tutorial).to({ alpha: 1.0 }, 250)
    }

    private prepareAnimation() {
        const card = this.stage.getChildByName("card")
        const thumb = this.stage.getChildByName("thumb")
        const hand = this.stage.getChildByName("hand")
        const arrow = this.stage.getChildByName("arrow")
        const arrowEnd = this.stage.getChildByName("arrowEnd")
        const ringThumb = this.stage.getChildByName("ringThumb")
        const ringHand = this.stage.getChildByName("ringHand")
        const tutorial = this.stage.getChildByName("tutorial")

        const cardInfo = this.stage.getChildInfoByName("card")

        ringThumb.alpha = 0.0
        ringHand.alpha = 0.0
        thumb.alpha = 0.0
        hand.alpha = 0.0
        arrow.alpha = 0.0
        arrowEnd.alpha = 0.0
        tutorial.alpha = 0.0

        card.x = cardInfo.position.x + this.sdkUI.width
        card.y = cardInfo.position.y + this.sdkUI.height
        card.scaleX = cardInfo.scale.x * 1.2
        card.scaleY = cardInfo.scale.y * 1.2
    }

    private startAnimation() {
        this.animateText()
    }

    private stopAnimation() {
        const card = this.stage.getChildByName("card")
        const thumb = this.stage.getChildByName("thumb")
        const hand = this.stage.getChildByName("hand")

        createjs.Tween.removeTweens(card)
        createjs.Tween.removeTweens(thumb)
        createjs.Tween.removeTweens(hand)
    }

    public drawProgressBar(progress: number, direction: string = "none") {
        const progressBar: PLProgressBar = this.stage.getChildByName("progressBar") as PLProgressBar
        if (progressBar) {
            progressBar.drawProgress(progress, direction)
        }
    }

    public dismissProgressBar(animated: boolean) {
        const progressBar: PLProgressBar = this.stage.getChildByName("progressBar") as PLProgressBar
        if (progressBar) {
            if (animated) {
                progressBar.dismiss()
            } else {
                progressBar.hide()
            }
        }
    }

    private animateText() {
        const holdCard = this.stage.getChildByName("holdCard")
        const swipeUp = this.stage.getChildByName("swipeUp")

        createjs.Tween.get(holdCard)
            .to({ alpha: 1.0 }, 1500)
            .call(() => {
                createjs.Tween.get(swipeUp)
                    .to({ alpha: 1.0 }, 1500)
                    .call(() => {
                        this.animateCard()
                    })
            })
    }

    private animateCard() {
        const card = this.stage.getChildByName("card")
        const cardInfo = this.stage.getChildInfoByName("card")

        // fade-in the card with scaling
        createjs.Tween.get(card)
            .to({ x: cardInfo.position.x, y: cardInfo.position.y }, 800)
            .to({ scaleX: cardInfo.scale.x, scaleY: cardInfo.scale.y }, 300, createjs.Ease.cubicOut)
            .call(() => {
                this.animateThumb()
                this.resetAlert()
            })
    }

    private animateThumb() {
        const thumbInfo = this.stage.getChildInfoByName("thumb")
        const thumb = this.stage.getChildByName("thumb")
        const ringThumb = this.stage.getChildByName("ringThumb")
        const holdCard = this.stage.getChildByName("holdCard")

        thumb.x = thumbInfo.position.x - 300
        thumb.y = thumbInfo.position.y + 300
        thumb.scaleX = thumbInfo.scale.x * 1.2
        thumb.scaleY = thumbInfo.scale.y * 1.2
        thumb.alpha = 1.0

        // fade-in the thumb with scaling
        createjs.Tween.get(thumb)
            .wait(100)
            .to({ x: thumbInfo.position.x, y: thumbInfo.position.y }, 800)
            .to({ scaleX: thumbInfo.scale.x, scaleY: thumbInfo.scale.y }, 300, createjs.Ease.cubicOut)
            .call(() => {
                createjs.Tween.get(holdCard).to({ alpha: 0.0 }, 200)
            })
            .call(() => {
                createjs.Tween.get(ringThumb)
                    .to({ alpha: 1.0 }, 200)
                    .call(() => {
                        this.animateHand()
                    })
            })
    }

    private animateHand() {
        const hand = this.stage.getChildByName("hand")
        const handInfo = this.stage.getChildInfoByName("hand")

        hand.x = handInfo.position.x + 300
        hand.y = handInfo.position.y + 200
        hand.scaleX = handInfo.scale.x * 1.2
        hand.scaleY = handInfo.scale.y * 1.2
        hand.alpha = 1.0

        this.animationHandOnPlaceDown(() => {
            this.animationHandUp(() => {
                this.animationHandRemove(() => {
                    this.animateHand()
                })
            })
        })
    }

    private animationHandOnPlaceDown(callback?: () => void) {
        const hand = this.stage.getChildByName("hand")
        const handInfo = this.stage.getChildInfoByName("hand")
        const arrow = this.stage.getChildByName("arrow")
        const arrowEnd = this.stage.getChildByName("arrowEnd")
        const ringHand = this.stage.getChildByName("ringHand")
        const ringHandInfo = this.stage.getChildInfoByName("ringHand")
        const swipeUp = this.stage.getChildByName("swipeUp")

        ringHand.x = ringHandInfo.position.x
        ringHand.y = ringHandInfo.position.y + 50

        // fade-in the hand with scaling
        createjs.Tween.get(hand)
            .to({ x: handInfo.position.x, y: handInfo.position.y + 50 }, 500)
            .to({ scaleX: handInfo.scale.x, scaleY: handInfo.scale.y }, 300, createjs.Ease.cubicOut)
            .call(() => {
                createjs.Tween.get(swipeUp).to({ alpha: 0.0 }, 200)
            })
            .call(() => {
                createjs.Tween.get(ringHand).to({ alpha: 1.0 }, 250)
                createjs.Tween.get(arrowEnd).to({ alpha: 1.0 }, 250)
                createjs.Tween.get(arrow)
                    .to({ alpha: 1.0 }, 250)
                    .call(() => {
                        if (callback) {
                            callback()
                        }
                    })
            })
    }

    private animationHandRemove(callback?: () => void) {
        const hand = this.stage.getChildByName("hand")
        const handInfo = this.stage.getChildInfoByName("hand")
        const ringHand = this.stage.getChildByName("ringHand")

        createjs.Tween.get(ringHand).to({ alpha: 0.0 }, 250)

        // move hand outside
        createjs.Tween.get(hand)
            .to({ scaleX: handInfo.scale.x * 1.2, scaleY: handInfo.scale.y * 1.2 }, 300, createjs.Ease.cubicIn)
            .to({ x: hand.x + 300, y: hand.y + 200 }, 500)
            .wait(1000)
            .call(() => {
                if (callback) {
                    callback()
                }
            })
    }

    private animationHandUp(callback?: () => void) {
        const hand = this.stage.getChildByName("hand")
        const handInfo = this.stage.getChildInfoByName("hand")
        const arrow = this.stage.getChildByName("arrow")
        const arrowEnd = this.stage.getChildByName("arrowEnd")

        const ringHand = this.stage.getChildByName("ringHand")
        const ringHandInfo = this.stage.getChildInfoByName("ringHand")

        createjs.Tween.get(this.arrowCommand)
            .to({ h: -95 }, 2000, createjs.Ease.sineIn)
            .call(() => {
                this.arrowCommand.h = this.getScaled(arrow.getBounds().height)
                arrow.alpha = 0.0
                arrowEnd.alpha = 0.0
            })

        createjs.Tween.get(ringHand).to({ y: ringHandInfo.position.y - 1000 * this.sdkUI.scaleRatioPPI }, 2000, createjs.Ease.sineIn)

        createjs.Tween.get(hand)
            .to({ y: handInfo.position.y - 1000 * this.sdkUI.scaleRatioPPI }, 2000, createjs.Ease.sineIn)
            .call(() => {
                if (callback) {
                    callback()
                }
            })
    }

    private createAlert(customBoxSpriteName: string): PLAlert {
        const customBox = this.sdkUI.createSprite(
            customBoxSpriteName,
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            true,
            new createjs.Point(5, 0),
        )

        const margin = PLDeviceUtils.isIOS() ? 40 : 20
        const fontSize = PLDeviceUtils.isIOS() ? 15 : 14

        return this.sdkUI
            .createAlert()
            .setBackgroundColor("#820511")
            .setBoxColor("#0000007F")
            .setFont(`${fontSize}px Gilroy-regular`)
            .setColor("#FFFFFF")
            .setShadowColor("#6F6F6E")
            .setCustomBox(customBox)
            .setBoxMargin(margin)
            .hide(false)
            .build()
            .setUseCustomBox(true)
    }

    private showAlert(message: string, isError: boolean = false) {
        const errorAlert: PLAlert = this.getErrorAlert()

        if (errorAlert === null) {
            return
        }

        if (isError) {
            errorAlert.setText(message)
            errorAlert.show(false).flash()
        } else {
            this.stopPulsateFrame()
            errorAlert.hide(false)
        }
    }

    private resetAlert() {
        const text = " "
        this.showAlert(text)
    }

    private getErrorAlert(): PLAlert {
        if (this.stage !== null) {
            return this.stage.getChildByName("errorAlert") as PLAlert
        }

        return null
    }

    private createStatus(): PLStatus {
        return this.sdkUI
            .createStatus()
            .hide(false)
            .setOffset(-20, 20)
            .build()
    }

    private showConnectivityStatus(connectivityStatus: ConnectivityStatus) {
        if (this.status === null) return

        switch (connectivityStatus) {
            case ConnectivityStatus.ok:
                this.status.hide(true)
                this.status.setNormal()
                break

            case ConnectivityStatus.slow:
                this.status.show(true)
                this.status.setWarning().flash()
                break

            case ConnectivityStatus.offline:
                this.status.show(true)
                this.status.setError().flash()
                break
        }
    }

    private flashScreenGreen() {
        this.flashScreen("greenBg")
    }

    private flashScreenRed() {
        this.flashScreen("redBg")
    }

    private flashScreen(name: string) {
        const background = this.stage.getChildByName(name)
        if (!background) {
            return
        }

        createjs.Tween.get(background)
            .to({ alpha: 0.75 }, 300, createjs.Ease.cubicInOut)
            .to({ alpha: 0.5 }, 200, createjs.Ease.cubicInOut)
            .to({ alpha: 0.75 }, 200, createjs.Ease.cubicInOut)
            .to({ alpha: 0 }, 300, createjs.Ease.cubicInOut)
    }

    private getScaled(value: number) {
        return this.sdkUI.scaleRatio * value
    }
}
