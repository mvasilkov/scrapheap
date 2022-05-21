'use strict'

export function setupAutoScale(container, containerWidth, containerHeight, autoRotate = false) {
    const containerAspectRatio = containerWidth / containerHeight

    function viewportHandler() {
        const viewportWidth = visualViewport.width
        const viewportHeight = visualViewport.height
        const viewportAspectRatio = viewportWidth / viewportHeight

        let scale, left, top
        if (containerAspectRatio < viewportAspectRatio) {
            // fit height
            scale = viewportHeight / containerHeight
            left = visualViewport.offsetLeft + 0.5 * (viewportWidth - scale * containerWidth)
            top = visualViewport.offsetTop
        }
        else {
            // fit width
            scale = viewportWidth / containerWidth
            left = visualViewport.offsetLeft
            top = visualViewport.offsetTop + 0.5 * (viewportHeight - scale * containerHeight)
        }
        container.style.transform = `translate(${left}px, ${top}px) scale(${scale})`
    }

    viewportHandler()

    visualViewport.addEventListener('scroll', viewportHandler)
    visualViewport.addEventListener('resize', viewportHandler)

    addEventListener('resize', viewportHandler)
}
