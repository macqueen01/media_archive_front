import { linear } from 'svelte/easing'

function loginToSignIn(node, {
    delay = 0,
    duration = 400,
    easing: easing$1 = linear
} = {}) {
    const w = +getComputedStyle(node).width;
    return {
        delay,
        duration,
        easing: easing$1,
        css: t => `width: ${400 + t * 560}px`
    }
}

module.exports = {
    loginToSignIn
}