import Router from 'vue-router'
import HomePage from './components/pages/home.vue'
import ManifestoPage from './components/pages/manifesto.vue'
import InstructionsPage from './components/pages/instructions.vue'
import SMSPage from './components/pages/sms.vue'
import ElectionPage from './components/pages/election.vue'
import VotePage from './components/pages/vote.vue'
import ThanksPage from './components/pages/thanks.vue'
import AlreadyPage from './components/pages/already.vue'
import TrackPage from './components/pages/track.vue'
import CountPage from './components/pages/count.vue'
import ChosePage from './components/pages/chose.vue'
import LoginPage from './components/pages/login.vue'
import AdminPage from './components/pages/admin/admin.vue'
import EditElectionPage from './components/pages/admin/election.vue'

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: { title: 'Home' }
        },
        {
            path: '/manifesto',
            name: 'manifesto',
            component: ManifestoPage,
            meta: { title: 'Manifesto' }
        },
        {
            path: '/instructions',
            name: 'instructions',
            component: InstructionsPage,
            meta: { title: 'Instructions' }
        },
        {
            path: '/sms',
            name: 'sms',
            component: SMSPage,
            meta: { title: 'SMS' }
        },
        {
            path: '/election',
            name: 'election',
            component: ElectionPage,
            meta: { title: 'Election' }
        },
        {
            path: '/vote',
            name: 'vote',
            component: VotePage,
            props: { Vote: false },
            meta: { title: 'Vote' }
        },
        {
            path: '/thanks',
            name: 'thanks',
            component: ThanksPage,
            meta: { title: 'Thanks' }
        },
        {
            path: '/already',
            name: 'already',
            component: AlreadyPage,
            meta: { title: 'Already' }
        },
        {
            path: '/track',
            name: 'track',
            component: TrackPage,
            meta: { title: 'Track' }
        },
        {
            path: '/count',
            name: 'count',
            component: CountPage,
            meta: { title: 'Count' }
        },
        {
            path: '/chose',
            name: 'chose',
            component: ChosePage,
            meta: { title: 'Chose' }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { title: 'Login' }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminPage,
            meta: { title: 'Admin' }
        },
        {
            path: '/admin/election',
            name: 'edit-election',
            component: EditElectionPage,
            meta: { title: 'Edit Election' }
        },
        {
            path: '/admin/election/new',
            name: 'new-election',
            component: EditElectionPage,
            meta: { title: 'New Election' }
        }
    ]
})
