import { createFilter } from '@rollup/pluginutils'
import path from 'path'
import sharp from 'sharp'
import { loadConfig, optimize } from 'svgo'

export default function sharpPlugin(options = {}) {
	const filter = createFilter(options.include || ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'], options.exclude)

	const excludePatterns = [
		/\/og\.png$/,
		/\/favicon/,
		/\/apple-touch/,
		/\/android-chrome/,
		/\/fantasticon\.svg$/,
	]

	return {
		name: 'vite-plugin-sharp',
		apply: 'build',
		async generateBundle(options, bundle) {
			const files = Object.keys(bundle).filter(file => typeof file === 'string' && filter(file))

			// console.log('========== [sharpPlugin] Bundle Keys ==========')
			// for (const [key, asset] of Object.entries(bundle)) {
			// 	console.log(`[key: ${key}]`, {
			// 		type: asset?.type,
			// 		name: asset?.name,
			// 		fileName: asset?.fileName,
			// 		hasSource: !!asset?.source,
			// 		sourceType: typeof asset?.source,
			// 	})
			// }
			// console.log('===============================================')

			for (const file of files) {
				const asset = bundle[file]
				if (!asset || !asset.source) {
					console.warn(`[sharpPlugin] Skipping: ${file} (no asset.source)`)
					continue
				}

				const inputBuffer = asset.source
				const basename = path.basename(file)
				const extname = path.extname(file).toLowerCase()

				// Skip excluded files
				if (excludePatterns.some(pattern => pattern.test(file) || pattern.test(basename))) {
					continue
				}

				// Only process Buffer-based assets
				if (!(inputBuffer instanceof Buffer)) {
					// console.warn(`[sharpPlugin] Skipping non-buffer asset: ${file}`)
					continue
				}

				// console.log(`[sharpPlugin] Processing: ${file}`)

				if (['.jpg', '.jpeg', '.png'].includes(extname)) {
					await handleRasterImages(file, extname, inputBuffer, asset, bundle)
				} else if (extname === '.svg') {
					await handleSVG(file, inputBuffer, asset, bundle)
				}
			}
		},
	}
}

async function handleRasterImages(file, extname, inputBuffer, asset, bundle) {
	let webpOutputBuffer
	let originalOutputBuffer
	let newFileName

	try {
		if (extname === '.jpg' || extname === '.jpeg') {
			originalOutputBuffer = await sharp(inputBuffer).jpeg({ quality: 75 }).toBuffer()
			webpOutputBuffer = await sharp(inputBuffer).webp({ quality: 75 }).toBuffer()
			newFileName = file.replace(/\.(jpg|jpeg)$/i, '.webp')
		} else if (extname === '.png') {
			originalOutputBuffer = await sharp(inputBuffer).png({ compressionLevel: 6 }).toBuffer()
			webpOutputBuffer = await sharp(inputBuffer).webp({ quality: 75 }).toBuffer()
			newFileName = file.replace(/\.png$/i, '.webp')
		}

		if (originalOutputBuffer) {
			asset.source = originalOutputBuffer
		}

		if (newFileName && webpOutputBuffer) {
			bundle[newFileName] = {
				fileName: newFileName,
				source: Buffer.from(webpOutputBuffer),
				type: 'asset',
			}
		}
	} catch (err) {
		console.error(`[sharpPlugin] Failed to process ${file}:`, err)
	}
}

async function handleSVG(file, inputBuffer, asset, bundle) {
	try {
		const config = await loadConfig()
		const result = await optimize(inputBuffer.toString(), { ...config })

		if (result.data) {
			const newFileName = `assets/img/${path.basename(file)}`
			bundle[newFileName] = {
				fileName: newFileName,
				source: Buffer.from(result.data),
				type: 'asset',
			}
		}
	} catch (err) {
		console.error(`[sharpPlugin] Failed to optimize SVG: ${file}`, err)
	}
}
