import fs from 'fs'
import { glob } from 'glob'
import mjml from 'mjml'
import path from 'path'

export default function mjmlPlugin(options = {}) {
	const { include = ['**/*.mjml'], exclude = [] } = options

	return {
		name: 'vite-plugin-mjml',
		apply: 'serve',
		handleHotUpdate({ file, server }) {
			if (file.endsWith('.mjml')) {
				compileMJML(file)
				server.ws.send({
					type: 'full-reload',
					path: '*',
				})
			}
		},
		async buildStart() {
			const files = glob.sync('src/mails/**/*.mjml')
			files.forEach((file) => compileMJML(file))
		},
		async generateBundle(outputOptions, bundle) {
			const files = Object.keys(bundle).filter((file) =>
				include.some((pattern) => new RegExp(pattern).test(file))
			)

			for (const file of files) {
				const asset = bundle[file]
				const inputBuffer = asset.source
				const extname = path.extname(file).toLowerCase()

				if (extname === '.mjml') {
					await handleMJML(file, inputBuffer, asset, bundle)
				}
			}
		},
		closeBundle() {
			moveHtmlFiles()
		},
	}
}

function compileMJML(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8')
	const result = mjml(content)

	const outputPath = filePath.replace('/mjml/', '/').replace('.mjml', '.html')

	fs.writeFileSync(outputPath, result.html)
}

async function handleMJML(file, inputBuffer, asset, bundle) {
	const content = inputBuffer.toString()
	const result = mjml(content)

	const newFileName = file.replace('src/mails/mjml', 'build/assets/mails').replace('.mjml', '.html')

	if (result.html) {
		bundle[newFileName] = {
			fileName: newFileName,
			source: Buffer.from(result.html),
			type: 'asset',
		}
	}
}

function moveHtmlFiles() {
	const sourceDir = './src/mails/'
	const targetDir = './build/assets/mails/'
	const htmlFiles = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.html') && file !== 'index.html')

	htmlFiles.forEach((file) => {
		const sourceFilePath = path.join(sourceDir, file)
		const targetFilePath = path.join(targetDir, file)

		fs.mkdirSync(path.dirname(targetFilePath), { recursive: true })
		fs.renameSync(sourceFilePath, targetFilePath)
	})
}
