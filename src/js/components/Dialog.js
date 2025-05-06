import Component from '../core/Component'
import {lenis} from '../core/Lenis'

export default class Dialog extends Component {
	constructor(element, options = {}) {
		super(element, options)

		this.ref = {
			wrapper: null,
			close: null,
			open: null,
			video: null
		}
	}

	prepare() {
		this.ref.wrapper.addEventListener('click', (event) => {
			this.clickOutside(event)
		})

		this.ref.wrapper.addEventListener('close', () => this.ref.wrapper.classList.remove('open'))

		this.ref.close.addEventListener('click', () => {
			this.handleClose()
		})

		this.ref.open.addEventListener('click', () => {
			this.handleOpen()
		})		
	}

	handleOpen() {
		lenis.stop()
		this.ref.wrapper.showModal()

		const content = this.ref.wrapper.querySelector('.dialog-content')
		if(content) {
			setTimeout(() => {
				content.scrollTop = 0
			}, 20)
		}

		setTimeout(() => {
			document.activeElement.blur()
		  }, 0)

		if(this.ref.video) {
			this.ref.video.play()
		}
	}

	clickOutside(event) {
		const rect = this.ref.wrapper.getBoundingClientRect()
		const isInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
		
		if (!isInside && this.ref.wrapper.hasAttribute('open')) {
			this.handleClose()
		}
	}

	handleClose() {
		lenis.start()
		this.ref.wrapper.setAttribute('closing', '')

		this.ref.wrapper.addEventListener('animationend', () => {
			this.ref.wrapper.removeAttribute('closing')
			this.ref.wrapper.close()
		}, { once: true })

		if(this.ref.video) {
			this.ref.video.pause()
		}
	}

	destroy() {
		this.ref.wrapper.removeEventListener('click', (event) => {
			this.clickOutside(event)
		})

		this.ref.wrapper.removeEventListener('close', () => this.ref.wrapper.classList.remove('open'))

		this.ref.close.removeEventListener('click', () => {
			this.handleClose()
		})

		this.ref.open.removeEventListener('click', () => {
			this.handleOpen()
		})		
	}
}