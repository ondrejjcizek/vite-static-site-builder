import { queryAll } from '../utils/dom'

class Component {
	constructor(element, options = {}) {
		this.element = element
		this.element.component = this
		this._name = this.constructor.name
		this.options = this.element.dataset.options ? JSON.parse(this.element.dataset.options) : options
		this._ref = {}
		this._callbacks = {}
		this.initializeRefs() // Automatically setup refs on construction
		
		this.bindAllMethods()
	}

	bindAllMethods() {
		// Get all property names of the instance
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
		// Bind all methods to this instance
		methods.forEach(method => {
			if (typeof this[method] === 'function' && method !== 'constructor') {
				this[method] = this[method].bind(this)
			}
		})
	}

	get ref() {
		return this._ref
	}

	set ref(items = {}) {
		const allRefs = queryAll('[data-ref]', this.element)
		this._ref = Object.keys(items).reduce((acc, key) => {
			const isArray = Array.isArray(items[key])
			const name = isArray ? key.slice(0, -1) : key
			const prefixedName = `${this._name}:${name}`

			let refs = allRefs.filter(el => el.dataset.ref === (isArray ? prefixedName : name))
			if (refs.length === 0) {
				refs = allRefs.filter(el => el.dataset.ref === name)
			}

			if (!isArray) {
				refs = refs.length ? refs[0] : null
			}

			acc[key] = refs || items[key]
			return acc
		}, {})
	}

	initializeRefs() {
		const allRefs = queryAll('[data-ref]', this.element)
		allRefs.forEach(el => {
			const refName = el.dataset.ref
			if (!this._ref[refName]) {
				this._ref[refName] = []
			}
			this._ref[refName].push(el)
		})

		Object.keys(this._ref).forEach(key => {
			if (this._ref[key].length === 1) {
				this._ref[key] = this._ref[key][0]
			}
		})
	}

	get options() {
		return this._options
	}

	set options(options) {
		this._options = { ...this._options, ...options }
	}

	prepare() {
		if (__DEV__) {
			console.warn(`Component ${this._name} does not have "prepare" method.`)
		}
	}

	destroy() {
		// Add cleanup code here
	}

	static getFromElement(element) {
		// console.log('Retrieving component:', element.component)
		return element.component
	}
}

export default Component
