const debug = process.env.NODE_ENV !== 'production'

const onCatch = function(res) {
    if (debug) console.log('%c catch', 'color: #661807; font-weight: bold', res)
}

export { onCatch }
