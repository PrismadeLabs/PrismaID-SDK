import { Config } from "@stencil/core"
import builtins from "rollup-plugin-node-builtins"

// https://stenciljs.com/docs/config

// Production build: minifyJs: true, minifyCss: true, buildEs5: true
// Development build: minifyJs: false, minifyCss: false, buildEs5: false

export const config: Config = {
    outputTargets: [
        {
            type: "www",
            serviceWorker: {
                swDest: (process.env.NAMESPACE ? "sw_" : "sw") + process.env.NAMESPACE + ".js",
            },
        },
    ],
    globalScript: "src/global/app.ts",
    globalStyle: "src/global/app.css",
    namespace: process.env.NAMESPACE ? "app_" + process.env.NAMESPACE : "app",
    nodeResolve: {
        preferBuiltins: false,
    },
    plugins: [builtins()],
    devServer: {
        openBrowser: false,
    },
    // minifyJs: true,
    // minifyCss: true,
    // buildEs5: true,
    // buildEsm: true
}
