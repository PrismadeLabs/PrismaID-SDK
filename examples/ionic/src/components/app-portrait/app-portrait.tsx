import { Component, State, Listen } from "@stencil/core"

@Component({
    tag: "app-portrait",
    styleUrl: "app-portrait.css",
    //shadow: true
})
export class AppPortrait {
    @State() isPortrait: boolean = true

    @Listen("window:orientationchange")
    handleOrientation() {
        this.checkOrientation()
    }

    componentDidLoad() {
        console.log("AppPortrait did load")
        this.checkOrientation()
    }

    render() {
        const display = this.isPortrait ? "none" : "flex"
        const style = {
            display: display,
            "align-items": "center",
            "justify-content": "center",
            position: "absolute",
            width: "100%",
            height: "100%",
            "background-color": "white",
            "z-index": "99",
        }

        return (
            <div id="portrait" style={style}>
                <img src="assets/images/rotate_device.png" />
            </div>
        )
    }

    private checkOrientation() {
        console.log("window.orientation:", window.orientation)
        this.isPortrait = window.orientation === 0 || window.orientation === 180
    }
}
