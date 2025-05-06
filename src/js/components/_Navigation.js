import Component from '../core/Component'

export default class _Navigation extends Component {
	constructor(element, options = {}) {
		super(element, options)

		this.ref = {
			links: [],
			list: null,
			indicator: null
		}

		this.states = {
			startPosition: 0,
			scrollLeft: 0
		}
	
	}

	prepare() {
		const currentPath = window.location.pathname

		this.ref.list.addEventListener('scroll', event => {
			this.states.scrollLeft = event.target.scrollLeft
			this.ref.indicator.style.left = `${-event.target.scrollLeft}px`
		})
        
		this.ref.links.forEach(link => {
			const listStartingPosition = this.element.getBoundingClientRect().left

			if (currentPath === link.getAttribute('href')) {
				const linkRect = link.getBoundingClientRect()
				const leftPosition = linkRect.left - listStartingPosition
				this.ref.indicator.style.transform = `translateX(${leftPosition}px)`
				this.ref.indicator.style.width = `${link.offsetWidth}px`
				this.element.scrollLeft = -leftPosition
				link.classList.add('active')
				link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
			}

			link.addEventListener('click', event => {
				const linkRect = event.target.getBoundingClientRect()
				const listStartingPosition = this.element.getBoundingClientRect().left
				const leftPosition = linkRect.left - listStartingPosition

				const newScrollLeft = this.element.scrollLeft + leftPosition
				this.element.scrollLeft = newScrollLeft

				this.ref.indicator.style.transform = `translateX(${leftPosition +  this.states.scrollLeft}px)`
				this.ref.indicator.style.width = `${event.target.offsetWidth}px`
				this.element.scrollLeft = -leftPosition

				this.ref.links.forEach(link => link.classList.remove('active'))
				event.target.classList.add('active')

				setTimeout(() => {
					event.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
				}, 600)
			})
		})
        
		setTimeout(() => {
			this.ref.indicator.classList.remove('no-transition')
		}, 500)
	}
}