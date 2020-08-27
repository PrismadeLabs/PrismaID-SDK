import { Component } from "@stencil/core"

@Component({
    tag: "app-cover",
    styleUrl: "app-cover.css",
    //shadow: true
})
export class AppCover {
    componentDidLoad() {
        console.log("AppCover did load", this.isMobile())
    }

    render() {
        const display = this.isMobile() ? "none" : "flex"
        const style = {
            display: display,
            "align-items": "center",
            "justify-content": "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            "background-color": "white",
            "z-index": "100",
        }

        return (
            <div id="cover" style={style}>
                <img src="assets/images/phoneonly.png" />
            </div>
        )
    }

    private isMobile(): boolean {
        const userAgent = navigator.userAgent
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
            return true
        }

        return false
    }
}
