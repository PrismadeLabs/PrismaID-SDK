import { Component, Prop } from "@stencil/core"
import { PrismaUISDK, PLStage, PLAsset, PLSprite, PLSpriteAlignment, PLDeviceUtils } from "@prismadelabs/prismaidui"
import { take } from "rxjs/operators"

@Component({
    tag: "app-verify",
    styleUrl: "app-verify.css",
})
export class AppVerify {
    @Prop() private sdkUI: PrismaUISDK
    @Prop() codeID

    private stage: PLStage = null
    private pdf: PLSprite
    private container: createjs.Container

    componentDidLoad() {
        console.log("AppVerify did load")

        this.createUI()
    }

    render() {
        return (
            <ion-content>
                <app-portrait id="portrait" />
                <app-cover id="cover" />
                <canvas id="verifyscreen" />
            </ion-content>
        )
    }

    private createUI() {
        const canvas: HTMLCanvasElement = document.querySelector("#verifyscreen")
        this.stage = this.sdkUI.createStage(canvas, "PLStage")
        this.stage.updateTicker()

        this.sdkUI.loaderSubject.pipe(take(1)).subscribe(() => {
            this.completeUI()
        })

        const customAssets = [new PLAsset("assets/textures/goldenmaster.json", "goldenmaster", "spritesheet")]

        this.sdkUI.loadAssets(customAssets)
    }

    private completeUI() {
        // Header
        const box1_shadow = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_box-left-shadow@2x",
            [PLSpriteAlignment.top, PLSpriteAlignment.left],
            false,
            false,
            new createjs.Point(-6, -4),
        )
        this.stage.addChildWithInfoByName(box1_shadow, "box1_shadow")

        const box2_shadow = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_box-right-shadow@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(3, -4),
        )
        this.stage.addChildWithInfoByName(box2_shadow, "box2_shadow")

        const box1 = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_box-left@2x",
            [PLSpriteAlignment.top, PLSpriteAlignment.left],
            false,
            false,
            new createjs.Point(0, -2),
        )
        this.stage.addChildWithInfoByName(box1, "box1")

        const box2 = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_box-right@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(0, -2),
        )
        this.stage.addChildWithInfoByName(box2, "box2")

        const logo = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_logo@2x",
            [PLSpriteAlignment.top, PLSpriteAlignment.left],
            false,
            false,
            new createjs.Point(60, 12),
        )
        this.stage.addChildWithInfoByName(logo, "logo")

        const text = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_text@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(-70, 15),
        )
        this.stage.addChildWithInfoByName(text, "text")

        const back = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/back-button@2x",
            [PLSpriteAlignment.left, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(10, 7),
        )
        this.stage.addChildWithInfoByName(back, "back")

        const check = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_checkmark@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(0, 8),
        )
        this.stage.addChildWithInfoByName(check, "check")

        // Card Number
        const cardtitle = this.sdkUI.createText(
            "CARD",
            "30px Gilroy-light",
            "#147D19",
            "center",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            true,
            new createjs.Point(0, -150),
        )
        this.stage.addChildWithInfoByName(cardtitle, "cardtitle")

        const cardnumber = this.sdkUI.createText(
            this.codeID.replace("code", "#"),
            "40px Gilroy-bold",
            "#147D19",
            "center",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            true,
            new createjs.Point(0, -95),
        )
        this.stage.addChildWithInfoByName(cardnumber, "cardnumber")

        // PDF
        const text1 = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_text-1@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(0, 30),
        )

        this.pdf = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_pdf@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(0, 140),
            new createjs.Point(0, 0),
            true,
        )

        // Button
        const prismadeWeb = this.sdkUI.createSprite(
            "goldenmaster::04_verified/@2x/verified_button@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.bottom],
            false,
            false,
            new createjs.Point(5, -10),
            new createjs.Point(0, 0),
            true,
        )
        this.stage.addChildWithInfoByName(prismadeWeb, "prismadeWeb")

        this.container = new createjs.Container()
        this.container.addChild(text1, cardtitle, cardnumber, this.pdf)
        this.stage.addChild(this.container)

        this.prepareAnimation()

        setTimeout(() => {
            this.startAnimation()
        }, 250)
    }

    private prepareAnimation() {
        const box1 = this.stage.getChildByName("box1")
        box1.x -= box1.getBounds().width

        const box2 = this.stage.getChildByName("box2")
        box2.x += box2.getBounds().width

        const box1_shadow = this.stage.getChildByName("box1_shadow")
        box1_shadow.x -= box1_shadow.getBounds().width

        const box2_shadow = this.stage.getChildByName("box2_shadow")
        box2_shadow.x += box2_shadow.getBounds().width

        const logo = this.stage.getChildByName("logo")
        logo.alpha = 0.0

        const text = this.stage.getChildByName("text")
        text.alpha = 0.0

        const back = this.stage.getChildByName("back")
        back.alpha = 0.0

        const check = this.stage.getChildByName("check")
        check.alpha = 0.0

        const prismadeWeb = this.stage.getChildByName("prismadeWeb")
        prismadeWeb.alpha = 0.0

        this.container.y -= 30
        this.container.alpha = 0.0
    }

    private startAnimation() {
        const leftBoxInfo = this.stage.getChildInfoByName("box1")
        const leftBox = this.stage.getChildByName("box1")

        const rightBoxInfo = this.stage.getChildInfoByName("box2")
        const rightBox = this.stage.getChildByName("box2")

        const leftBoxShadowInfo = this.stage.getChildInfoByName("box1_shadow")
        const leftBoxShadow = this.stage.getChildByName("box1_shadow")

        const rightBoxShadowInfo = this.stage.getChildInfoByName("box2_shadow")
        const rightBoxShadow = this.stage.getChildByName("box2_shadow")

        createjs.Tween.get(leftBoxShadow)
            .to({ x: leftBoxShadowInfo.position.x }, 500)
            .call(() => {
                createjs.Tween.get(rightBoxShadow)
                    .to({ x: rightBoxShadowInfo.position.x }, 500)
            })

        createjs.Tween.get(leftBox)
            .to({ x: leftBoxInfo.position.x }, 500)
            .call(() => {
                createjs.Tween.get(rightBox)
                    .to({ x: rightBoxInfo.position.x }, 500)
                    .wait(250)
                    .call(() => {
                        this.animateTopComponents()
                    })
            })
    }

    private animateTopComponents() {
        const logo = this.stage.getChildByName("logo")
        createjs.Tween.get(logo).to({ alpha: 1.0 }, 500)

        const text = this.stage.getChildByName("text")
        createjs.Tween.get(text).to({ alpha: 1.0 }, 500)

        const back = this.stage.getChildByName("back")
        createjs.Tween.get(back).to({ alpha: 1.0 }, 500)

        const prismadeWeb = this.stage.getChildByName("prismadeWeb")
        createjs.Tween.get(prismadeWeb)
            .to({ alpha: 1.0 }, 500)
            .call(() => {
                this.attachActionsToButtons()
                this.animateCheckMark()
            })

            const containerY = this.container.y + 30
            createjs.Tween.get(this.container).to({ alpha: 1.0, y: containerY }, 500)
    }

    private openPrismadeWeb() {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

        if (iOS) {
            const a = document.createElement("a")
            a.setAttribute("href", "https://www.prismade.com")
            a.setAttribute("target", "_blank")

            const dispatch = document.createEvent("HTMLEvents")
            dispatch.initEvent("click", true, true)
            a.dispatchEvent(dispatch)
        } else {
            window.open("https://www.prismade.com")
        }
    }

    private openPDF() {
        if (PLDeviceUtils.isIOS()) {
            const a = document.createElement("a")
            a.setAttribute("href", "assets/docs/prismade_security.pdf")
            a.setAttribute("target", "_blank")

            const dispatch = document.createEvent("HTMLEvents")
            dispatch.initEvent("click", true, true)
            a.dispatchEvent(dispatch)
        } else {
            window.open("assets/docs/prismade_security.pdf")
        }
    }

    private animateCheckMark() {
        const check = this.stage.getChildByName("check")
        const checkInfo = this.stage.getChildInfoByName("check")
        createjs.Tween.get(check)
            .to({ alpha: 1.0 }, 250)
            .to({ scaleX: checkInfo.scale.x * 1.1, scaleY: checkInfo.scale.y * 1.1 }, 250)
            .wait(100)
            .to({ scaleX: checkInfo.scale.x, scaleY: checkInfo.scale.y }, 250)
    }

    private attachActionsToButtons() {
        const back = this.stage.getChildByName("back")
        this.sdkUI.createButton(back, false, () => {
            createjs.Tween.removeAllTweens()
            this.sdkUI.playSound("click")
            const nav = document.querySelector("ion-nav")
            nav.popToRoot()

            const startPage = document.querySelector("app-start")
            startPage.onBack()
        })

        const prismadeWeb = this.stage.getChildByName("prismadeWeb")
        prismadeWeb.on("click", () => {
            this.sdkUI.playSound("click")
            this.openPrismadeWeb()
        })

        this.pdf.on("click", () => {
            this.sdkUI.playSound("click")
            this.openPDF()
        })
    }
}
