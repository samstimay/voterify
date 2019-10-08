import axios from "axios";
import { constants } from "@/factory/constants";

class Lang {
    private userLang: object;

    private currentLang(): string {
        return "en-us";
    }

    private value(obj: object, key: string): string {
        return obj && obj[key] ? obj[key] : null;
    }

    public init() {
        const instance = this;
        const fileName = "lang/" + this.currentLang() + ".json";
        return axios
            .get(fileName)
            .then(function(res) {
                instance.userLang = res.data;
            })
            .catch(function(res) {
                // tslint:disable-next-line
                console.log("api init failed", res);
            });
    }

    public content(key: string, fallback: string, interpolate?: any): string {
        let value = this.value(this.userLang, key) || fallback;
        if (interpolate) {
            value = value.replace(constants.interpolate, interpolate);
        }
        return value;
    }

    public ui(key: string, fallback: string): string {
        return this.value(this.userLang["ui-elements"], key) || fallback;
    }

    public lines(key: string): string[] {
        return this.userLang && this.userLang[key] ? this.userLang[key] : [];
    }

    public;
}

const lang = new Lang();

export { lang, Lang };
