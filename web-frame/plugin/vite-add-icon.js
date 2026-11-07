import {createSvgIconsPlugin} from "vite-plugin-svg-icons";
import path from "path";

export function viteAddIcon(plugins, config) {
    if (!config) config = "src/assets/icons"
    plugins.push(
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), config)],
        })
    )
}