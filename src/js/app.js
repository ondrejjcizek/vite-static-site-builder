import 'overlayscrollbars/overlayscrollbars.css'
import '../css/fantasticon/fantasticon.css'

import SwupBodyClassPlugin from '@swup/body-class-plugin'
import { OverlayScrollbars } from 'overlayscrollbars'
import Swup from 'swup'

import { loadComponents, reinitComponents, removeComponents } from './core/componentUtils'
import { scrollTo, scrollToId, startRaf, stopRaf } from './core/Lenis'

OverlayScrollbars({ 
	target: document.body,
	cancel: {
		nativeScrollbarsOverlaid: true,
		body: null,
	}
}, {})

if(!document.documentElement.classList.contains('no-swup')) {
	const swup = new Swup({
		containers: ['#swup'],
		linkSelector: 'main[id="swup"] a:not([data-no-swup]), .header a:not([data-no-swup]), .footer a:not([data-no-swup])',
		plugins: [new SwupBodyClassPlugin({
			prefix: ''
		})]
	})

	swup.hooks.on('content:replace', async () => {
		scrollTo('top', 0.1)
		await reinitComponents()
		startRaf()
	
		document.querySelectorAll('a:not([href="#todo"])').forEach(link => {
			if(!link.getAttribute('href')) {
				return
			}
			if (link.getAttribute('href').startsWith('#')) {
				const hash = link.getAttribute('href').split('#').pop()
				scrollToId(hash, link)
			}
		})
	})
	
	swup.hooks.on('animation:out:start', async () => {
		await removeComponents()
		stopRaf()
	})
	
	swup.hooks.on('enable', async () => {
		await loadComponents()
		startRaf()
	
		document.querySelectorAll('a:not([href="#todo"])').forEach(link => {
			if(!link.getAttribute('href')) {
				return
			}
			if (link.getAttribute('href').startsWith('#')) {
				const hash = link.getAttribute('href').split('#').pop()
				scrollToId(hash, link)
			}
		})
	})
} else {
	loadComponents()
	startRaf()
}