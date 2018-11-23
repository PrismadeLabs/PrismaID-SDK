// Create JS library
//
import * as createjs from "createjs-module"
import { Shape } from "createjs-module"
import { ContentManager } from "../providers/ContentManager"

export class ProgressBar {

    private shape: Shape
    private command: any
    private x: number
    private y: number
    private color: string
    private alpha: number
    private direction = "up"
    private contentPercentage = 100
    private mode: string

    public constructor(contentManager: ContentManager, x: number, y: number, width: number, height: number, mode: string = "normal", color: string = "#17942D", alpha: number = 1.0) {

        this.shape = new createjs.Shape()
        this.hide()

        if (mode === "tick") {
            const scalePPI = contentManager.getScalePPI()
            const image = contentManager.queue.getResult("progress")
            const m = new createjs.Matrix2D()
            m.scale(scalePPI, scalePPI)

            this.command = this.shape.graphics.beginBitmapFill(image, "no-repeat", m).drawRect(0, 0, width + 20, height + 20).command
            this.shape.setBounds(x - 10, y - 10, width + 20, height + 20)
            this.shape.x = x - 10
            this.shape.y = y - 10

        } else {
            this.command = this.shape.graphics.beginFill(color).drawRoundRectComplex(x - 10, y - 10, width + 20, height + 20, 30, 30, 30, 30).command
            this.shape.setBounds(x - 10, y - 10, width + 20, height + 20)
        }

        this.alpha = alpha
        this.x = x - 10
        this.y = y - 10
        this.mode = mode
        this.color = color
    }

    public draw(progress: number, direction: string) {
        this.direction = direction
        if (this.mode === "normal") {
            this.setAlpha(progress > 5 ? this.alpha : 0.0)
        } else {
            this.setAlpha(this.alpha)
        }

        const stepByProgress = this.getStep() * progress

        switch (direction) {
            case "up":
                this.drawUp(progress, this.getBottom() - stepByProgress, stepByProgress)
                break

            case "down":
                this.drawDown(progress, stepByProgress)
                break

            case "right":
                this.drawRight(progress, stepByProgress)
                break

            default:
                break
        }
    }

    public dismiss() {
        switch (this.direction) {
            case "right":
                this.dismissRight()
                break

            case "up":
                this.dismissUpOrDown(this.getBottom() - (15 * this.getStep()))
                break

            case "down":
                this.dismissUpOrDown(this.getY())
                break

            default:
                break
        }
    }

    public hide() {
        this.getShape().alpha = 0.0
    }

    public getShape() { return this.shape }
    public getCommand() { return this.command }
    public getX() { return this.x }
    public getY() { return this.y }
    public getColor() { return this.color }
    public getAlpha() { return this.alpha }
    public setAlpha(alpha: number) { this.getShape().alpha = alpha }
    public getBounds() { return this.getShape().getBounds() }

    public setContentPercentage(percentage) {
        this.contentPercentage = percentage
    }

    private drawUp(progress: number, y: number, h: number) {
        if (h > this.getBounds().height) { return }

        this.getCommand().y = y
        this.getCommand().h = h
        this.getCommand().radiusBL = 30
        this.getCommand().radiusBR = 30
        this.getCommand().radiusTL = progress > 15 ? 30 : 0
        this.getCommand().radiusTR = progress > 15 ? 30 : 0
    }

    private drawDown(progress: number, h: number) {
        if (h > this.getBounds().height) { return }

        this.getCommand().y = this.getY()
        this.getCommand().h = h
        this.getCommand().radiusTL = 30
        this.getCommand().radiusTR = 30
        this.getCommand().radiusBL = progress > 15 ? 30 : 0
        this.getCommand().radiusBR = progress > 15 ? 30 : 0
    }

    private drawRight(progress: number, w: number) {
        // this.getCommand().x = this.getX()
        this.getCommand().w = w
    }

    private dismissRight() {
        // var x = this.getX()
        const newW = 15 * this.getStep()

        createjs.Tween.get(this.getCommand()).to({ w: newW }, 500, createjs.Ease.backIn).call(() => {
            createjs.Tween.get(this.getShape()).to({ alpha: 0.0 }, 250).call(() => {
                // this.getCommand().x = this.getX()
                this.getCommand().w = 0
            })
        })
    }

    private dismissUpOrDown(newY: number) {
        const newH = 15 * this.getStep()

        createjs.Tween.get(this.getCommand()).to({ h: newH, y: newY }, 500, createjs.Ease.backIn).call(() => {
            createjs.Tween.get(this.getShape()).to({ alpha: 0.0 }, 250).call(() => {
                this.getCommand().y = this.getY()
                this.getCommand().h = 0
            })
        })
    }

    private getBottom() {
        const bounds = this.getBounds()
        const height = bounds.height
        const bottom = this.getY() + height

        return bottom
    }

    private getStep() {
        const bounds = this.getBounds()
        const height = bounds.height
        const width = bounds.width
        const step = this.direction === "right" ? (width / this.contentPercentage) : (height / this.contentPercentage)

        return step
    }
}
