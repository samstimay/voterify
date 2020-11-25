import { session } from '@/factory/session'
import http from '@/services/http'
import { AxiosResponse } from 'axios'

class Api {
    private apiPath: string

    public setPath(path: string) {
        this.apiPath = path
    }

    public path(): string {
        return this.apiPath
    }

    public get(path): Promise<AxiosResponse<any>> {
        return http.get(api.path() + path, this.getHeader())
    }

    public post(path, data): Promise<AxiosResponse<any>> {
        const post = {
            method: 'post',
            url: this.apiPath + path,
            data
        }
        return http(Object.assign(post, this.getHeader()) as Object)
    }

    private getHeader(): object {
        const user = session.getUser()
        if (!user || !user.token) {
            return { headers: { Authorization: 'anonymous' } }
        }
        const token = user.token
        return { headers: { Authorization: 'Bearer ' + token } }
    }
}

const api = new Api()

export { api }
