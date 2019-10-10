import { Component } from "@stencil/core"

@Component({
    tag: "app-root",
    styleUrl: "app-root.css",
})

export class AppRoot {

    componentDidLoad() {
        console.log("AppRoot did load")
    }
    
    render() {
        return (
            <ion-app>
                <ion-router useHash={false}>
                    <ion-route url="/" component="app-start" />
                </ion-router>
                <ion-nav swipeGesture={false}/>
            </ion-app>
        )
    }
}
