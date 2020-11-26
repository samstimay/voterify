import { lang } from '../factory/lang'

export default {
    install(app) {
        app.config.globalProperties.$content = function(
            key,
            fallback,
            interpolate
        ) {
            return lang.content(key, fallback, interpolate)
        }
        app.config.globalProperties.$ui = function(key, fallback) {
            return lang.ui(key, fallback)
        }
        app.config.globalProperties.$lines = function(key) {
            return lang.lines(key)
        }
    }
}
