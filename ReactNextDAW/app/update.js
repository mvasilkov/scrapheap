import ms from 'ms'

export class PeriodicUpdate {
    constructor(update, interval) {
        if (typeof interval == 'string') {
            interval = ms(interval)
        }
        this.update = update
        this.interval = interval
        this.running = false
        this.timeout = null
        this.upd = this.upd.bind(this)
    }

    start() {
        this.running = true
        return this.upd()
    }

    stop() {
        this.running = false
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
        return this
    }

    upd() {
        if (this.running) {
            const value = this.update()
            if (value && typeof value.then == 'function') {
                value.then(() => {
                    setTimeout(this.upd, this.interval)
                })
            }
            else setTimeout(this.upd, this.interval)
        }
        return this
    }
}
