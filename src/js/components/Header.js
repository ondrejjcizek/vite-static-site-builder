import Component from '../core/Component'

export default class Disclosure extends Component {
	constructor(element, options = {}) {
		super(element, options)
	}

	prepare() {
		console.log(this.element)
	}
}
