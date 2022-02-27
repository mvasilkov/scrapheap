function initMainMenu() {
    if (isMobile) document.body.className = 'mobile'

    const qualityToggle = <HTMLInputElement>document.getElementById('q')

    const _cpaint = Cushion.prototype.paint
    const _cpaintLow = Cushion.prototype.paintLow
    const _ppaint = Piece.prototype.paint
    const _ppaintLow = Piece.prototype.paintLow

    if (isMobile) {
        qualityToggle.checked = false
        Cushion.prototype.paint = _cpaintLow
        Piece.prototype.paint = _ppaintLow
    }

    qualityToggle.addEventListener('change', event => {
        Cushion.prototype.paint = qualityToggle.checked ? _cpaint : _cpaintLow
        Piece.prototype.paint = qualityToggle.checked ? _ppaint : _ppaintLow
        paintBackground()
    })

    container.removeChild(loadingScreen)
}

handleResize()

initMainMenu()
init()
initBackground()

requestAnimationFrame(mainloop)
paintBackground()
