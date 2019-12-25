// Firebase User data
export default class FbUser {
    public phone: string
    public token: string
    public refreshToken: string
    public uid: string

    constructor(
        phone: string,
        token: string,
        refreshToken: string,
        uid: string
    ) {
        this.phone = phone || ''
        this.token = token || ''
        this.refreshToken = refreshToken || ''
        this.uid = uid || ''
    }
}
