import { Injectable } from "@angular/core"
import { Platform } from "ionic-angular"

// Create JS library
//
import * as createjs from "createjs-module"
import { LoadQueue, Stage } from "createjs-module"
import { IPhone } from "../classes/iphone"

@Injectable()
export class ContentManager {

    public notifySpriteSheetLoaded: () => void
    public notifySpriteSheetProgress: (progress) => void

    public stage: Stage
    public queue: LoadQueue

    private spriteSheet: any
    private isSpriteSheetLoaded: boolean = false

    private scaleRatio: number = 1	// general scale factor
    private positionYRatio: number = 1 // Y position scale factor
    private positionXRatio: number = 1 // X position scale factor
    private width: number = 0
    private height: number = 0
    private originalImageWidth: number = 375	// assumed to be designed for @2x retina display
    private dpi: number = 326 // iPhone DPI is default
    private dpr: number = -1 // -1 => use window.devicePixelRatio

    constructor(private platform: Platform) {
        // what a magic is this, hmmm
        (window as any).createjs = createjs

        this.originalImageWidth = 375
        this.setSize()
    }

    public getVersion(): string {
        return "1.0.110218"
    }

    public isRunningStandalone() {
        const standaloneKey = "standalone"

        return ((window.matchMedia("(display-mode: standalone)").matches) || (window.navigator[standaloneKey] === true) || this.platform.is("cordova"))
    }

    public getScaleRatio(): number {
        return this.scaleRatio
    }

    public getScaleRatioY(): number {
        return this.positionYRatio
    }

    public getScaleRatioX(): number {
        return this.positionXRatio
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public iPhoneX(): boolean {
        return IPhone.isVersion("iPhoneX", this.getWidth(), this.getHeight(), this.getWindowPixelRatio())
    }

    public iPad2() {
        return (this.iPad() && this.getWindowPixelRatio() === 1)
    }

    public iPad3AndUp() {
        return (this.iPad() && this.getWindowPixelRatio() === 2)
    }

    public iOS(): boolean {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
    }

    public iPad() {
        return /iPad/.test(navigator.userAgent)
    }

    public iPhone() {
        return /iPhone/.test(navigator.userAgent)
    }

    public iOSversion(): number {
        if (this.iOS()) {
            const version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
            // version.forEach((value, index, array) => {
            // 	console.log("version component " + value)
            // })
            console.log("current version iOS: " + version)
            return parseInt(version[1], 10)
        }

        return -1
    }

    public normalizeAxisValue(axisValue): number {
        return axisValue / this.maxWindowPixelRatio()
    }

    public getWindowPixelRatio() {
        if (this.dpr === -1) {
            return window.devicePixelRatio
        }

        return this.dpr
    }

    public initialize(canvas) {
        canvas.width = this.getWidth()
        canvas.height = this.getHeight()

        this.deinitialize()

        this.stage = new createjs.Stage(canvas)
        this.stage.name = canvas.id

        createjs.Touch.enable(this.stage, false, false)

        // this method optimized the Stage for scaling, e.g. for retina display
        //
        this.optimizeStageScaleForRendering(this.stage, this.stage.canvas)
    }

    public updateStage() {

        // console.log("update stage")

        // set ticker
        //
        createjs.Ticker.framerate = 60 // default frame rate is 30
        createjs.Ticker.addEventListener("tick", this.refresh)
    }

    public updateStageOnce() {
        this.stage.update()
    }

    public loadTextures() {
        if (!this.isSpriteSheetLoaded) {
            this.queue = new createjs.LoadQueue()
            this.queue.on("complete", () => { this.prepareTextures() })
            this.queue.on("progress", () => { this.texturesDownloadProgress() })
            this.queue.loadManifest([
                { src: "assets/textures/prismasdkdemo.json", id: "textures", type: "spritesheet" },
            ])
        } else {
            this.notifySpriteSheetLoaded()
        }
    }

    public getImage(name) {
        return createjs.SpriteSheetUtils.extractFrame(this.spriteSheet, name)
    }

    public getSprite(name) {
        return new createjs.Sprite(this.spriteSheet, name)
    }

    public addChild(child) {
        this.stage.addChild(child)
    }

    public addChildUnder(child, childUnder) {
        this.stage.addChildAt(child, this.stage.getChildIndex(childUnder))
    }

    public removeChild(child) {
        this.stage.removeChild(child)
    }

    public registerSound(soundAsset: string, name: string) {
        createjs.Sound.registerSound(soundAsset, name)
    }

    public createSoundInstance(sound: string) {
        return createjs.Sound.createInstance(sound)
    }

    public playSound(sound) {
        this.resumeSound()
        return createjs.Sound.play(sound)
    }

    public resumeSound() {
        try {
            if (createjs.WebAudioPlugin.context.state === "suspended") {
                console.log("WebAudioPlugin suspended")
                createjs.WebAudioPlugin.context.resume()
            }
        } catch (e) {
            // SoundJS context or web audio plugin may not exist
            console.error("There was an error while trying to resume the SoundJS Web Audio context...")
            console.error(e)
        }
    }

    public setDPR(dpr: number) {
        if (dpr !== undefined) {
            this.dpr = dpr
        }
    }

    public setDPI(dpi: number) {
        if (dpi !== undefined) {
            this.dpi = dpi
        }
    }

    public getScalePPI(): number {
        let wpr = this.getWindowPixelRatio()
        let dpi = this.dpi

        if (this.iOS()) {
            const model = IPhone.getModel(this.getWidth(), this.getHeight(), this.getWindowPixelRatio())
            if (model) {
                console.log("iPhone versions:", model.versions)
                dpi = model.dpi
                wpr = model.wprnative
            }
        }

        return (dpi / wpr) / (326 / 2) * 0.5
    }

    private deinitialize() {
        if (this.stage) {
            createjs.Ticker.removeEventListener("tick", this.refresh)
            createjs.Tween.removeAllTweens()
            this.stage.removeAllChildren()
            this.stage = null
        }
    }

    private refresh = () => {
        this.stage.update()
    }

    private texturesDownloadProgress() {
        this.notifySpriteSheetProgress(this.queue.progress)
    }

    private prepareTextures() {
        console.log("textures download completed")

        this.isSpriteSheetLoaded = true

        // get a sprite sheet from loaded data
        //
        this.spriteSheet = this.queue.getResult("textures")

        this.notifySpriteSheetLoaded()
    }

    private optimizeStageScaleForRendering(stage: any, canvas: any) {
        if (window.devicePixelRatio) {
            // grab the width and height from canvas
            const height = canvas.getAttribute("height")
            const width = canvas.getAttribute("width")

            // reset the canvas width and height with window.devicePixelRatio applied
            canvas.setAttribute("width", Math.round(width * this.maxWindowPixelRatio()))
            canvas.setAttribute("height", Math.round(height * this.maxWindowPixelRatio()))

            // force the canvas back to the original size using css
            canvas.style.width = width + "px"
            canvas.style.height = height + "px"

            // set CreateJS to render scaled
            stage.scaleX = stage.scaleY = this.maxWindowPixelRatio()
        }
    }

    private maxWindowPixelRatio(): number {
        return Math.min(this.getWindowPixelRatio(), 2)
    }

    private setSize() {
        this.width = window.innerWidth
        this.height = window.innerHeight

        const ratio = this.width / this.originalImageWidth
        this.scaleRatio = 0.5 * ratio
        this.positionYRatio = ratio
        this.positionXRatio = ratio
    }
}
