import { Vue } from 'vue-property-decorator'
import FbUser from '@/models/fbUser'
import Voter from '@/models/voter'
import { session } from '@/factory/session'

const EventHub = new Vue()

EventHub.$on('logout', () => {
    console.log('TCL: logout', session)
    session.setUser(new FbUser('', '', '', ''))
    session.setVoter(new Voter('', ''))
})

export { EventHub }
