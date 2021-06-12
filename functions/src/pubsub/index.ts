import * as functions from 'firebase-functions'
import voteCountJob from './voteCountJob'

//const everyDay = 'every day 00:00'
//const every5Minutes = 'every 5 minutes'
const every5Seconds = 'every 5 seconds'

class scheduler {
    run() {
        console.log('scheduler.run')
        let vcjob = functions.pubsub.schedule(every5Seconds)
            .onRun(async context => {
                console.log('scheduler.run.onRun')
                voteCountJob(context)
            })
        vcjob.run({}, {})
    }
}

let s = new scheduler()

export default s