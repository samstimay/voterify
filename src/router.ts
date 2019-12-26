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

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/manifesto',
            name: 'Manifesto',
            component: ManifestoPage
        },
        {
            path: '/instructions',
            name: 'Instructions',
            component: InstructionsPage
        },
        {
            path: '/sms',
            name: 'SMS',
            component: SMSPage
        },
        {
            path: '/election',
            name: 'Election',
            component: ElectionPage
        },
        {
            path: '/vote',
            name: 'Vote',
            component: VotePage,
            props: { Vote: false }
        },
        {
            path: '/thanks',
            name: 'Thanks',
            component: ThanksPage
        },
        {
            path: '/already',
            name: 'Already',
            component: AlreadyPage
        },
        {
            path: '/track',
            name: 'Track',
            component: TrackPage
        },
        {
            path: '/count',
            name: 'Count',
            component: CountPage
        },
        {
            path: '/chose',
            name: 'Chose',
            component: ChosePage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        }
    ]
})
