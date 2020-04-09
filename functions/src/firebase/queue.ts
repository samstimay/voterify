let FirebaseQueueID = 1

class FirebaseQueue {
    public id: Number
    public ref: any

    constructor(firebaseAdminApp: any) {
        this.id = FirebaseQueueID++
        this.ref = firebaseAdminApp.database().ref('queue')
    }

    public push(data: Object) {
        this.ref.push(data)
    }
}

export default FirebaseQueue
