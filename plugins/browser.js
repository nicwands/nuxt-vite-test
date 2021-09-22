import {
    resizeHandler,
    scrollHandler,
    mouseMoveHandler,
} from '~/plugins/dom-handlers'
import { throttle } from 'lodash'
import Vue from 'vue'
import MarqueeText from 'vue-marquee-text-component'
import 'shader-doodle'
import { refreshCanvasText } from '~/libs/canvasText'

// plugin
export default async ({ store, route }, inject) => {
    // require('intersection-observer')
    // require('requestidlecallback-polyfill')

    // directives
    Vue.component('marquee-text', MarqueeText)

    // setup dom listeners
    // ~16ms is 60fps
    window.addEventListener(
        'resize',
        throttle(() => {
            resizeHandler(store)
            refreshCanvasText()
        }, 30)
    )
    window.addEventListener(
        'scroll',
        throttle(() => {
            scrollHandler(store)
            refreshCanvasText()
        }, 30)
    )
    window.addEventListener(
        'mousemove',
        throttle((e) => mouseMoveHandler(e, store), 30)
    )

    // kick handlers
    // mouseMoveHandler({ x: 0, y: 0, v: 0 }, store)
    resizeHandler(store)
    scrollHandler(store)

    // load fonts
    store.dispatch('browser/LOAD_FONTS')
}
