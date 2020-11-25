import Store from '@/store'
import Toasted from 'vue-toasted'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store
        $toasted: Toasted
    }
}
