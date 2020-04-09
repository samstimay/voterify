const Phone = {
    methods: {
        phoneToRecaptcha: function (phone) {
            return '+1 ' + phone.match(/\d+/g).join(' ')
        }
    }
}

export default Phone
