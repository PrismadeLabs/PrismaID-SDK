import { PLContainer, PrismaUISDK, PLSpriteAlignment } from "@prismadelabs/prismaidui"

export class TutorialScreen2 extends PLContainer {
    constructor(public sdkUI: PrismaUISDK, private onCloseCallBack: () => void) {
        super(sdkUI)
    }

    public didEnter() {
        console.log("TutorialScreen1 didEnter")
    }

    public didLeave() {}

    public build() {
        const frame = this.sdkUI.createSprite(
            "goldenmaster::03_help/@2x/help_layer@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(5, -2)
        )
        this.addChild(frame)

        const close = this.sdkUI.createSprite(
            "goldenmaster::03_help/@2x/help_close@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(125, -235),
        )
        this.addChild(close)
        close.mouseEnabled = true
        close.on(
            "click",
            () => {
                if (this.onCloseCallBack) {
                    this.onCloseCallBack()
                }
            },
            null,
            true,
        )

        const picture = this.sdkUI.createSprite(
            "goldenmaster::03_help/@2x/help-02@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(-1, -119),
        )
        this.addChild(picture)

        const spacer = this.sdkUI.createSprite(
            "goldenmaster::03_help/@2x/help_line@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(0, 0),
        )
        this.addChild(spacer)

        const wallpaper = this.sdkUI.createSprite(
            "goldenmaster::03_help/@2x/help_guilloche-02@2x",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            false,
            new createjs.Point(0, 84),
        )
        this.addChild(wallpaper)

        const text = this.sdkUI.createText(
            "Hold your prisma ID card\nwith your left thumb.",
            "15px Gilroy-regular",
            "#000000",
            "center",
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            true,
            new createjs.Point(0, 60),
        )
        this.addChild(text)
    }

}
