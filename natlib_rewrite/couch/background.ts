import { backcontext, cheight, cwidth } from './canvas.js'
import { Cushion } from './Cushion.js'
import { armrest0, armrest1, couch } from './main.js'

let backCushion: Cushion | null = null

export function initBackground() {
    backCushion = new Cushion(255, 360, 450, 180, false)
}

export function paintBackground() {
    backcontext.clearRect(0, 0, cwidth, cheight)

    backcontext.save()

    backcontext.shadowColor = 'rgba(0,0,0,0.4)'
    backcontext.shadowBlur = 25

    backCushion!.paint(backcontext, '#0091EA')

    backcontext.shadowColor = '#000'

    backcontext.translate(0, 1)

    couch!.paint(backcontext, 'rgba(55,71,79,0.4)')
    armrest0!.paint(backcontext, 'rgba(55,71,79,0.4)')
    armrest1!.paint(backcontext, 'rgba(55,71,79,0.4)')

    backcontext.restore()
}
