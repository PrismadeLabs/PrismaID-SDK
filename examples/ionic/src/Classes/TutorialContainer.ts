import { PrismaUISDK, PLSpriteAlignment, PLContainer, PLButton, PLScrollContainer, PLPageControl, PLUpdateResponse } from "@prismadelabs/prismaidui"
import { TutorialScreen1 } from "./TutorialScreen1"
import { TutorialScreen2 } from "./TutorialScreen2"
import { TutorialScreen3 } from "./TutorialScreen3"

export class TutorialContainer extends PLContainer {
    private scrollContainer: PLScrollContainer
    private pageControl: PLPageControl

    constructor(sdkUI: PrismaUISDK) {
        super(sdkUI)
    }

    public build() {
        this.createUI()
    }

    public didLeave() {}

    public didEnter() {}

    private createUI() {
        this.createScrollContainer()
    }

    private createScrollContainer() {
        const screen1 = new TutorialScreen1(this.sdkUI, this.onTutorialClose)
        screen1.build()

        const screen2 = new TutorialScreen2(this.sdkUI, this.onTutorialClose)
        screen2.build()

        const screen3 = new TutorialScreen3(this.sdkUI, this.onTutorialClose)
        screen3.build()

        this.scrollContainer = new PLScrollContainer(this.sdkUI)
        this.scrollContainer.addContainer(screen1)
        this.scrollContainer.addContainer(screen2)
        this.scrollContainer.addContainer(screen3)
        this.scrollContainer.parallaxFactor = 1
        this.scrollContainer.create(true)
        this.scrollContainer.addBackground("goldenmaster::03_help/@2x/help_background@2x", [PLSpriteAlignment.fill])

        this.scrollContainer.updateSubject.subscribe((response: PLUpdateResponse) => {
            this.updateUIComponents(response.currentIndex)
        })

        this.addChild(this.scrollContainer)

        this.pageControl = this.sdkUI.createPageControl(
            3,
            [PLSpriteAlignment.centerHorizontal, PLSpriteAlignment.centerVertical],
            false,
            "#000000",
            "#BEBEBE",
            "goldenmaster::03_help/@2x/help_menu-dot@2x",
        )
        this.pageControl.y += 210 * this.sdkUI.scaleRatioAxis
        this.addChild(this.pageControl)

        this.updateUIComponents(0)
    }

    private updateUIComponents(index: number) {
        this.pageControl.currentPage = index
        this.pageControl.updateCurrentPageDisplay()
    }

    private onTutorialClose = () => {
        console.log("onTutorialClose")
        const home = document.querySelector("app-home")
        home.onTutorialClosed()
    }
}
