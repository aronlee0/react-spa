import webpack from "webpack";
import webpackConf from "../webpack.config.js";
import { staticPublicPath } from "../config.json";

webpackConf.output.publicPath = staticPublicPath["dev"] || "/";

webpack(webpackConf, function(err, stats) {
    if (err) {
        return console.error(err)
    }

    const jsonStats = stats.toJson()
    if(jsonStats.errors.length > 0) {
        return console.log(jsonStats.errors.toString())
    }
    if(jsonStats.warnings.length > 0) {
        return console.log(jsonStats.warnings.toString())
    }
})