import express from 'express'
import ip from 'ip'
import chalk from 'chalk'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConf  from '../webpack.config.hmr'
import { staticPublicPath } from '../config.json'

// const publicPath = staticPublicPath["dev"] || "/"
// webpackConf.output.publicPath = publicPath


const additional = ['webpack-hot-middleware/client?noInfo=true&reload=true']

let entry = webpackConf.entry
Object.keys(entry).forEach((name) => {
    const value = entry[name]
    if (Array.isArray(value)) {
        value.unshift(...additional)
    } else {
        entry[name] = [...additional, value]
    }
})

const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()
const NamedModulesPlugin = new webpack.NamedModulesPlugin()
webpackConf.plugins = webpackConf.plugins.concat([ HotModuleReplacementPlugin, NamedModulesPlugin ]);

const app = express()
const compiler = webpack(webpackConf)

app.use(webpackDevMiddleware(compiler, {


    publicPath: webpackConf.output.publicPath,

	noInfo: true,
	// display no info to console (only warnings and errors)

	quiet: false,
	// display nothing to the console

	// lazy: true,
	// switch into lazy mode
	// that means no watching, but recompilation on every request

	// watchOptions: {
	// 	aggregateTimeout: 300,
	// 	poll: true
	// },
	// watch options (only lazy: false)

	// publicPath: "/src/",
	// public path to bind the middleware to
	// use the same as in webpack
	
	// index: "index.html",
	// the index path for web server

	// headers: { "X-Custom-Header": "yes" },
	// custom headers

	stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        children: false
    },
	// options for formating the statistics

	// reporter: null,
	// Provide a custom reporter to change the way how logs are shown.

	// serverSideRender: false
	// Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
}))

app.use(webpackHotMiddleware(compiler, {
    log: false,
    // path: "/dist",
    // heartbeat: 2000
}))

app.listen("3003", function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(`dev-server at ${chalk.magenta.underline(`http://${ip.address()}:${this.address().port}`)}`)
})