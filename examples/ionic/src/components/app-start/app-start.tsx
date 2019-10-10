import { Component, Method } from "@stencil/core"
import { PrismaUISDK, PLStage, PLAsset, PLSpriteAlignment, PLLoaderProgressResponse } from "@prismadelabs/prismaidui"
import { take } from "rxjs/operators"
import { Timeline } from "createjs-module"
import { Cookie } from '../../Classes/cookie';

@Component({
    tag: "app-start",
    styleUrl: "app-start.css",
    //shadow: true
})
export class AppStart {
    private sdkUI: PrismaUISDK
    private stage: PLStage = null
    private arcCommand: any

    public static radians(degrees) {
        return (degrees * Math.PI) / 180
    }

    @Method() onBack() {
        this.addActionToStartButton()
    }

    componentDidLoad() {
        console.log("AppStart did load")

        this.prepareUI()
    }

    render() {
        return (
            <ion-content>
                <app-cover id="cover" />
                <app-portrait id="portrait" />
                <div id="start" class="start">
                    <video class="video" id="videoplayer" src="assets/video/VID_20190906_141119.mp4" playsinline loop muted />
                    <canvas id="startscreen" class="container" />
                </div>
            </ion-content>
        )
    }

    private prepareUI() {
        this.sdkUI = new PrismaUISDK()

        this.sdkUI.registerSound("assets/sounds/ding.mp3", "ding")
        this.sdkUI.registerSound("assets/sounds/error_new.mp3", "error")
        this.sdkUI.registerSound("assets/sounds/click.mp3", "click")

        this.sdkUI
            .loadFonts([
                { name: "Gilroy-light", url: "url(assets/fonts/Gilroy/Radomir-Tinkov-Gilroy-Light.otf)" },
                { name: "Gilroy-regular", url: "url(assets/fonts/Gilroy/Radomir-Tinkov-Gilroy-Regular.otf)" },
                { name: "Gilroy-bold", url: "url(assets/fonts/Gilroy/Radomir-Tinkov-Gilroy-Bold.otf)" },
            ])
            .then(() => {
                this.createUI()
            })
            .catch((error) => {
                console.log("error:", error)
            })

        const videoPlayer: HTMLVideoElement = document.querySelector("#videoplayer")
        videoPlayer.onended = () => {
            console.log("video ended")
        }

        videoPlayer.onpause = () => {
            console.log("video paused")
        }

        videoPlayer.onplay = () => {
            console.log("video started to play")
        }

        videoPlayer.ontimeupdate = () => {
            // console.log("video on time update:", videoPlayer.currentTime)
        }
    }

    private createUI() {
        const canvas: HTMLCanvasElement = document.querySelector("#startscreen")
        this.stage = this.sdkUI.createStage(canvas, "PLStage")
        this.stage.updateTicker()

        this.sdkUI.loaderSubject.pipe(take(1)).subscribe(() => {
            this.completeUI()
        })

        this.createProgressSpinner(() => {
            this.sdkUI.loaderProgressSubject.subscribe((response: PLLoaderProgressResponse) => {
                this.updateProgressSpinner(response.progress)
            })

            const customAssets = [new PLAsset("assets/textures/goldenmaster.json", "goldenmaster", "spritesheet")]
            this.sdkUI.loadAssets(customAssets, 20)
        })
    }

    private completeUI() {
        const videoPlayer: HTMLVideoElement = document.querySelector("#videoplayer")
        videoPlayer.style.visibility = "visible"

        const spinner = this.stage.getChildByName("spinner")
        createjs.Tween.get(spinner).to({ alpha: 0.0 }, 250)

        const start = this.sdkUI.createSprite(
            "goldenmaster::01_start/@2x/start_button@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.bottom],
            false,
            false,
            new createjs.Point(5, -10),
        )
        this.stage.addChildWithInfoByName(start, "start")
        start.mouseEnabled = true

        const box1_shadow = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_box-left-shadow@2x",
            [PLSpriteAlignment.top, PLSpriteAlignment.left],
            false,
            false,
            new createjs.Point(-11, -4),
        )
        this.stage.addChildWithInfoByName(box1_shadow, "box1_shadow")

        const box2_shadow = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_box-right-shadow@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(0, -4),
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
            "goldenmaster::_general/@2x/start_box-right@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(5, -2),
        )
        this.stage.addChildWithInfoByName(box2, "box2")

        const logo = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_logo@2x",
            [PLSpriteAlignment.top, PLSpriteAlignment.left],
            false,
            false,
            new createjs.Point(20, 12),
        )
        this.stage.addChildWithInfoByName(logo, "logo")

        const text = this.sdkUI.createSprite(
            "goldenmaster::_general/@2x/start_text@2x",
            [PLSpriteAlignment.right, PLSpriteAlignment.top],
            false,
            false,
            new createjs.Point(-15, 15),
        )
        this.stage.addChildWithInfoByName(text, "text")

        const note = this.sdkUI.createHomeScreenNote()
        this.stage.addChildWithInfoByName(note, "note")

        this.prepareAnimation()

        setTimeout(() => {
            this.startAnimation()
        }, 250)
    }

    private addActionToStartButton() {
        const start = this.stage.getChildByName("start")
        start.on(
            "click",
            () => {
                this.sdkUI.playSound("click")
                const nav = document.querySelector("ion-nav")
                nav.push("app-home", { sdkUI: this.sdkUI })
            },
            null,
            true,
        )
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

        const back = this.stage.getChildByName("start")
        back.alpha = 0.0
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

        const videoPlayer: HTMLVideoElement = document.querySelector("#videoplayer")

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
                    .call(() => {
                        // TODO
                        console.log("play video")
                        videoPlayer.play()
                        .catch((error) => {
                            console.log("error:", error)
                        })
                    })
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

        const visited = Cookie.getCookie("visited", "") !== ""
        if (!visited) {
            Cookie.setCookie("visited", "yes")
        }

        setTimeout(() => {
            const start = this.stage.getChildByName("start")
            createjs.Tween.get(start)
                .to({ alpha: 1.0 }, 500)
                .call(() => {
                    this.addActionToStartButton()
                })
        }, visited ? 500 : 8000)
    }

    private createProgressSpinner(callback: () => void) {
        const image = new Image()
        image.src = "assets/images/wait_prismade@2x.png"
        image.onload = () => {
            const container = new createjs.Container()

            const cover = new createjs.Shape()
            cover.graphics.beginFill("#FFFFFF").drawRect(0, 0, this.sdkUI.width, this.sdkUI.height)
            container.addChild(cover)

            const circle = new createjs.Shape()
            const x = this.sdkUI.width / 2
            const y = this.sdkUI.height / 2
            circle.graphics.beginStroke("#02247B").setStrokeStyle(5)
            circle.graphics.drawCircle(x, y, 60)
            container.addChild(circle)

            const logo = new createjs.Bitmap(image)
            logo.regX = logo.image.width / 2
            logo.regY = logo.image.height / 2
            logo.x = this.sdkUI.width / 2
            logo.y = this.sdkUI.height / 2
            logo.scaleX = this.sdkUI.scaleRatio
            logo.scaleY = this.sdkUI.scaleRatio
            container.addChild(logo)

            const arcMask = new createjs.Shape()
            this.arcCommand = arcMask.graphics
                .beginStroke("#FFF")
                .setStrokeStyle(5)
                .beginFill("#FFF")
                .arc(logo.x, logo.y, 50, AppStart.radians(0), AppStart.radians(0), false).command
            arcMask.graphics.lineTo(logo.x, logo.y).closePath()
            logo.mask = arcMask

            this.stage.addChildWithInfoByName(container, "spinner")

            if (callback) {
                callback()
            }
        }
    }

    private updateProgressSpinner(progressPercentage: number) {
        this.arcCommand.endAngle = AppStart.radians((360 / 100) * (progressPercentage * 100))
    }
}
