import { lang } from "../factory/lang";

export default {
    install(Vue, options) {
        Vue.prototype.$content = function(key, fallback, interpolate) {
            return lang.content(key, fallback, interpolate);
        };
        Vue.prototype.$ui = function(key, fallback) {
            return lang.ui(key, fallback);
        };
        Vue.prototype.$lines = function(key) {
            return lang.lines(key);
        };
    }
};
