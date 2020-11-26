import Toasted from 'vue-toasted'

export default {
    install(app, options) {
        app.prototype = {}
        Toasted.install(app, options)
        app.config.globalProperties.$toasted = app.prototype.$toasted
    }
}
