export function runTimeout(callback, delay, loop) {
	this.timeoutId = null
	this.delay = delay
	this.remaining = delay
	this.callback = callback
	this.isPaused = false
	this.loop = loop || false
	this.startTimestamp = null

	this.start = function() {
		var self = this
		this.startTimestamp = Date.now()
		this.timeoutId = setTimeout(function() {
			self.callback()
			if (self.loop) {
				self.reset()
			}
		}, this.remaining)
	}

	this.pause = function() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
			if (this.startTimestamp !== null) {
				this.remaining -= Date.now() - this.startTimestamp
			}
			this.isPaused = true
		}
	}

	this.resume = function() {
		if (this.isPaused) {
			this.isPaused = false
			this.start()
		}
	}

	this.reset = function(newDelay) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = null
		}
		this.remaining = newDelay !== undefined ? newDelay : this.delay
		this.isPaused = false
		this.start()
	}

	this.destroy = function() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
		}
		this.timeoutId = null
		this.isPaused = false
		this.startTimestamp = null
		this.remaining = this.delay
	}

	// Start the initial timeout
	this.start()
}

// // Example usage:
// const myCallback = () => {
//     console.log("Timeout executed!");
// };

// const myTimeout = new CustomTimeout(myCallback, 5000, true);

// // To pause the timeout:
// setTimeout(() => {
//     myTimeout.pause();
//     console.log('Paused');
// }, 2000);

// // To resume the timeout:
// setTimeout(() => {
//     myTimeout.resume();
//     console.log('Resumed');
// }, 4000);

// // To reset the timeout (with the same delay):
// setTimeout(() => {
//     myTimeout.reset();
//     console.log('Reset');
// }, 6000);

// // To reset the timeout (with a new delay):
// setTimeout(() => {
//     myTimeout.reset(3000);
//     console.log('Reset with new delay');
// }, 8000);
