// array of objects:
// { uuid: string, element: HTMLElement, rect: DOMRect, style: CSSStyleDeclaration }
export let canvasText = []

export const refreshCanvasText = () => {
    canvasText = canvasText.map(opts => {
        if (opts.element) {
            return {
                ...opts,
                rect: opts.element.getBoundingClientRect(),
                style: window.getComputedStyle(opts.element),
            }
        } else {
            return false
        }
    }).filter(Boolean)
}

export const addOrUpdateText = opts => {
    const idx = canvasText.findIndex((v) => v.uuid.startsWith(opts.uuid))
    if (idx !== -1) {
        canvasText.splice(idx, 1, opts)
    } else {
        canvasText.push(opts)
    }
}

export const removeText = uuid => {
    const idx = canvasText.findIndex((v) => v.uuid.startsWith(uuid))
    if (idx !== -1) {
        canvasText.splice(idx, 1)
    }
}

export const setHovered = (uuid, hovered) => {
    const found = canvasText.find(v => v.uuid.startsWith(uuid))
    if (found) {
        found.hovered = hovered
    }
}