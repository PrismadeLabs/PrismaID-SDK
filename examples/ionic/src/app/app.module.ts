import { ErrorHandler, NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular"

import { HomePage } from "../pages/home/home"
import { MyApp } from "./app.component"

import { ContentManager } from "../providers/ContentManager"

@NgModule({
    bootstrap: [IonicApp],
    declarations: [
        MyApp,
        HomePage,
    ],
    entryComponents: [
        MyApp,
        HomePage,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
    ],
    providers: [
        ContentManager,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
    ],
})
export class AppModule { }
