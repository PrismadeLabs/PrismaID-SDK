const pl = require("@prismadelabs/prismaid")

const canvas = document.getElementById("prismasdk")
canvas.width = window.innerWidth - 20
canvas.height = window.innerHeight - 20

const sdk = new pl.PrismaSDK("SCvL5XDWme6pOy0Cbi6UN4WBGJSkEboM9y0fXo7T")  
const version = "Prisma SDK version " + pl.PrismaSDK.version()

const ctx = canvas.getContext("2d")
ctx.fillStyle = "blue"
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = "white"
ctx.font = "15px Arial"
ctx.fillText(version , 10, 20)

sdk.getDetectionSuccessSubject().subscribe((response) => {
    console.log("*) detection success:", response.description())

    ctx.fillStyle = "blue"
    ctx.fillRect( 10, 30, 100, 20)
    ctx.fillStyle = "white"
    ctx.fillText(`${response.codeId}-${response.direction}`, 10, 40)
})

sdk.getDetectionErrorSubject().subscribe((response) => {
    console.log("*) detection error:", response.description())

    response.hints.forEach((hint) => {
        console.log("*) hint:", hint.description())
    })
})

sdk.getInteractionSubject().subscribe((response) => {
    console.log("*) interaction event:", response.event, response.activeSignals)
})

sdk.getInitialisationSubject().subscribe((response) => {
    console.log("*) config data:", response.codeSetTypes, response.ppi, response.devicePixelRatio)
})

sdk.getProgressSubject().subscribe((response) => {
    console.log("*) progress:", response.progress)
})

sdk.getConnectivitySubject().subscribe((response) => {
    console.log("*) connectivity:", response.status)
})

sdk.getUsabilitySubject().subscribe((response) => {
    console.log("*) usability:", response.event, response.payload, response.localizedMessage())
})

sdk.attachToElement(canvas)
