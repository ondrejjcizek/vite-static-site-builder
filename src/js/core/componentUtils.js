import { queries } from '../core/config'
import { queryAll } from '../utils/dom'
import Component from './Component'

const components = {}

// Check if a media query matches the current viewport size
function isMediaQueryMatch(mediaQuery) {
	if (!mediaQuery) return true  // If no media query, assume it matches

	let mediaQueryString = queries[mediaQuery]
	if (!mediaQueryString) {
		mediaQueryString = mediaQuery  // Use the provided string if it's not a key in queries
	}

	const media = window.matchMedia(mediaQueryString)
	return media.matches
}

// Handle component initialization on window resize
function handleResize() {
	const elements = queryAll('[data-component]')
	elements.forEach(element => initializeComponent(element, false))
}

// Set up a resize listener to manage responsive components
function setupResizeListener() {
	window.removeEventListener('resize', handleResize)  // Prevent duplicate listeners
	window.addEventListener('resize', handleResize)
}

// Load and initialize components within a given context (e.g., the document or a specific element)
export async function loadComponents(context = document.documentElement, initialLoad = false) {
	const elements = queryAll('[data-component]', context)
	elements.forEach(element => initializeComponent(element, initialLoad))
	setupResizeListener()  // Make sure resize listener is always active
}

// Initialize a single component based on its associated DOM element
function initializeComponent(element, initialLoad) {
	const instance = Component.getFromElement(element)
	const componentName = element.dataset.component
	const mediaQuery = element.dataset.media

	if (!isMediaQueryMatch(mediaQuery)) {
		if (instance) {
			instance.destroy()  // Destroy component if it doesn't match the current media query
			if (__DEV__) {
				console.log(`💥 Destroyed component '${instance._name}' due to media query mismatch.`)
			}
			element.component = null
		}
		return
	}

	// Skip reinitialization for persistent components unless it's the initial load
	if (!initialLoad && element.dataset.persistent === 'true' && instance) {
		if (__DEV__) {
			console.log('⏩ Persistent component:', componentName)
		}
		return
	}

	// Load and initialize the component if it's not already instantiated
	if (!instance) {
		loadSingleComponent(componentName, element).catch(error => {
			console.error(`Error loading component ${componentName}:`, error)
		})
	}
}

// Remove non-persistent components within a given context
export function removeComponents(context = document.documentElement) {
	const elements = queryAll('[data-component]', context)
	elements.forEach(element => {
		const instance = Component.getFromElement(element)
		if (instance && element.dataset.persistent !== 'true') {
			instance.destroy()  // Destroy component if it's not marked as persistent
			if (__DEV__) {
				console.log(`💥 ${instance._name}`)
			}
			element.component = null
		}
	})
}

// Dynamically load and initialize a single component by name
async function loadSingleComponent(name, element) {
	if (!components[name]) {
		try {
			const module = await import(`../components/${name}.js`)
			components[name] = module.default || module[name]  // Handle default or named exports
		} catch (error) {
			console.error(`Error loading component ${name}:`, error)
			return
		}
	}
	const ComponentClass = components[name]
	if (typeof ComponentClass === 'function') {
		const component = new ComponentClass(element)
		component.prepare()
		if (__DEV__) {
			console.log(`✅ ${name}`)
		}
	}
}

// Reinitialize components, typically used after page transitions
export function reinitComponents(context = document.documentElement) {
	loadComponents(context, true)
}
