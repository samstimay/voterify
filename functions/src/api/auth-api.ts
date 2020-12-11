import { Request } from 'express'
import { logger } from '../log'
import * as admin from 'firebase-admin'

class AuthApi {
    private getToken(req: Request): string {
        let token = (req.query.token || req.headers.authorization) as String
        if (token.indexOf('Bearer ') >= 0) {
            token = token.replace('Bearer ', '')
        }
        return token.toString()
    }

    // return the firebase uid based upon the request
    public firebaseTokenAuth(req: Request): Promise<string> {
        const token = this.getToken(req)
        return admin
            .auth()
            .verifyIdToken(token)
            .then(function(data) {
                if (data.uid && data.uid.length) return data.uid
                return ''
            })
            .catch(function(msg: any) {
                logger.error('auth failed', msg)
                return ''
            })
    }

    public getAuth(): admin.auth.Auth {
        return admin.auth()
    }

    public getUser(uid: string): Promise<admin.auth.UserRecord> {
        return this.getAuth().getUser(uid)
    }
}

const authApi = new AuthApi()

export { authApi }
