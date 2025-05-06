import Lenis from 'lenis'

import Component from '../core/Component'

const lenis = new Lenis({
	prevent: (node) => node.id === 'cms-top',
	lerp: 0.1,
	smooth: true,
})

const initialScrollY = window.scrollY

let animationFrameId
let lastScroll = 0

const callbacks = []

const onScrollChange = (callback) => {
	callbacks.push(callback)
}

const startRaf = () => {
	const raf = (time) => {
		lenis.raf(time)
		if (lastScroll !== lenis.scroll) {
			callbacks.forEach(callback => callback(lenis.scroll))
			lastScroll = lenis.scroll
		}
		animationFrameId = requestAnimationFrame(raf)
	}
	animationFrameId = requestAnimationFrame(raf)
}

const stopRaf = () => {
	cancelAnimationFrame(animationFrameId)
}

const scrollToId = (hash, link) => {
	const target = document.getElementById(hash)
	if(target) {
		link.addEventListener('click', () => {
			if(link.closest('[data-component="Dialog"]')) {
				const instanceOfDialog = Component.getFromElement(link.closest('[data-component="Dialog"]'))
				instanceOfDialog.handleClose()
			}
			lenis.scrollTo(target, { duration: 0.6, easing: (t) => t * (2 - t) })
		})
	}
}

/**
 * Scrolls to the specified element or position.
 * 
 * @param {HTMLElement|number|string} where - top, left, start, bottom, target or scroll value
 * @param {number} [duration] - The duration of the scroll animation in seconds.
 */
const scrollTo = (where, duration = 0.6) => {
	lenis.scrollTo(where, { duration: duration, easing: (t) => t * (2 - t) })
}

export { initialScrollY,lenis, onScrollChange, scrollTo, scrollToId, startRaf, stopRaf }