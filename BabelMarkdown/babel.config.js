module.exports = function (api) {
    api.cache(true)

    const presets = ["next/babel"]
    const plugins = ["babel-plugin-macros"]

    return {
        presets,
        plugins,
    }
}
