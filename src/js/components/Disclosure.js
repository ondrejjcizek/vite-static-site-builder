import Component from '../core/Component'

export default class Disclosure extends Component {
	static openItem = null // Track the currently open item

	constructor(element, options = {}) {
		super(element, options)

		this.ref = {
			details: []
		}
	}

	prepare() {
		class Accordion {
			constructor(el) {
				this.el = el
				this.summary = el.querySelector('summary')
				this.content = el.querySelector('.Disclosure-content')

				this.animation = null
				this.isClosing = false
				this.isExpanding = false
				this.summary.addEventListener('click', (e) => this.onClick(e))

				if (this.el.hasAttribute('open')) {
					this.summary.setAttribute('aria-expanded', 'true')
					this.el.classList.add('is-active')
					Disclosure.openItem = this.el
					this.el.AccordionInstance = this
					this.initialExpand()
				} else {
					this.summary.setAttribute('aria-expanded', 'false')
				}
			}

			onClick(e) {
				e.preventDefault()
				if (Disclosure.openItem && Disclosure.openItem !== this.el) {
					Disclosure.openItem.AccordionInstance.shrink()
					Disclosure.openItem.querySelector('summary').setAttribute('aria-expanded', 'false')
					Disclosure.openItem.classList.remove('is-active')
				}

				if (this.isClosing || !this.el.open) {
					this.summary.setAttribute('aria-expanded', 'true')
					this.el.classList.add('is-active')
					this.open()
				} else if (this.isExpanding || this.el.open) {
					this.summary.setAttribute('aria-expanded', 'false')
					this.el.classList.remove('is-active')
					this.shrink()
				}
			}

			initialExpand() {
				this.el.style.height = `${this.summary.offsetHeight + this.content.offsetHeight}px`
				this.isExpanding = false
			}

			shrink() {
				this.isClosing = true

				const startHeight = `${this.el.offsetHeight}px`
				const endHeight = `${this.summary.offsetHeight}px`

				if (this.animation) {
					this.animation.cancel()
				}

				this.animation = this.el.animate({
					height: [startHeight, endHeight]
				}, {
					duration: 600,
					easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
				})

				this.animation.onfinish = () => this.onAnimationFinish(false)
				this.animation.oncancel = () => this.isClosing = false
			}

			open() {
				this.el.style.height = `${this.el.offsetHeight}px`
				this.el.open = true
				window.requestAnimationFrame(() => this.expand())
				Disclosure.openItem = this.el
				this.el.AccordionInstance = this
			}

			expand() {
				this.isExpanding = true
				const startHeight = `${this.el.offsetHeight}px`
				const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`

				if (this.animation) {
					this.animation.cancel()
				}

				this.animation = this.el.animate({
					height: [startHeight, endHeight]
				}, {
					duration: 600,
					easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
				})

				this.animation.onfinish = () => this.onAnimationFinish(true)
				this.animation.oncancel = () => this.isExpanding = false
			}

			onAnimationFinish(open) {
				this.el.open = open
				this.animation = null
				this.isClosing = false
				this.isExpanding = false
				this.el.style.height = this.el.style.overflow = ''
			}
		}

		document.querySelectorAll('details').forEach((el) => {
			new Accordion(el)
		})
	}
}
