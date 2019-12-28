export default class Permissions {
    public type: string

    constructor(type: string) {
        this.type = type
    }

    public isAdmin() {
        return this.type === 'admin'
    }
}
