import { Vue } from 'vue-class-component'

class EventRelay {
    public app: Vue
    public $on(name, options = {}) {}
    public $emit(name, options = {}) {}
}

const EventHub = new EventRelay()

const setEventHub = (app: Vue) => {
    EventHub.app = app
}

export { EventHub, setEventHub }
