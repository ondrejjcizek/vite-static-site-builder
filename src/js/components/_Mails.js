import emailTemplate from '../../mails/template.html?raw'
import Component from '../core/Component'

export default class _Mails extends Component {
	constructor(element, options = {}) {
		super(element, options)

		this.ref = {
			button: null
		}

		this.state = {
			resend: null
		}
	}

	prepare() {
		this.ref.button.addEventListener('click', () => {
			this.sendEmail()
		})
	}

	sendEmail = async () => {
		this.ref.button.classList.add('is-sending')

		try {
			const response = await fetch('/api/emails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
				},
				body: JSON.stringify({
					from: 'WDF Starter Kit <onboarding@resend.dev>',
					to: ['ondrejj.cizek@gmail.com'],
					subject: 'Email Template',
					html: emailTemplate,
				}),
			})
			
			const data = await response.json()
			
			if (!response.ok) {
				throw new Error(data.message || 'Failed to send email')
			}
		} catch (error) {
			console.error('Error sending email:', error)
		} finally {
			this.ref.button.classList.remove('is-sending')
		}
	}
}
