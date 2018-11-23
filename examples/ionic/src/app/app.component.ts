import { Component } from "@angular/core"
import { Platform } from "ionic-angular"

import { HomePage } from "../pages/home/home"
@Component({
    templateUrl: "app.html",
})

export class MyApp {
    private rootPage: any = HomePage
    private wasLandscapeFirst = false
    private container: any
    private info: any
    private phoneOnlyInfo: any

    constructor(platform: Platform) {

        this.displayAppVersion()

        platform.ready().then(() => {
            this.container = document.getElementById("container")
            this.info = document.getElementById("info")
            this.phoneOnlyInfo = document.getElementById("phoneonlyinfo")

            if (platform.is("tablet") || platform.is("core")) {
                console.log("the application is running on tablet or PC")
                this.phoneOnlyInfo.style.display = "flex"
                return
            }

            if (window.orientation === 90 || window.orientation === -90) {
                this.showMessage()
                this.wasLandscapeFirst = true
            } else {
                this.hideMessage()
            }

            const landscapeMatch = window.matchMedia("only screen and (orientation: landscape)")
            landscapeMatch.addListener((landscape) => {
                if (landscape.matches) {
                    this.showMessage()
                } else {
                    if (this.wasLandscapeFirst) {
                        window.location.reload()
                        this.wasLandscapeFirst = false
                    }
                    this.hideMessage()
                }
            })
        })
    }

    private showMessage() {
        this.container.style.display = "none"
        this.info.style.display = "flex"
    }

    private hideMessage() {
        this.container.style.display = "block"
        this.info.style.display = "none"
    }

    private displayAppVersion() {
        const metaTags = Array.from(document.getElementsByTagName("meta"))

        metaTags.forEach((metaTag) => {
            if (metaTag.getAttribute("name") === "build") {
                console.log("%cApplication Version: ", "color: red font-weight: bold", metaTag.getAttribute("content"))
            }
        })
    }
}
