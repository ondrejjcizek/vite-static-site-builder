import dotenv from 'dotenv'
import fs from 'fs'
import path, { resolve } from 'path'
import { createLogger, defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import mkcert from 'vite-plugin-mkcert'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import fantasticonPlugin from './plugins/fantasticonPlugin'
import mjmlCompilator from './plugins/mjmlCompilator'
import postBuild from './plugins/postBuild'
import sharpPlugin from './plugins/sharpPlugin'

dotenv.config()

const customCodepoints = {
	'arrow-right': 0xf200,
	'arrow-left': 0xf201,
	'send-mail': 0xf202,
	'beaker': 0xf203,
	'arrow-path': 0xf204,
	'arrow-down': 0xf205,
	'school': 0xf206,
	'x-mark': 0xf207,
	'chevron-down': 0xf208
}

function customLogger() {
	const logger = createLogger()
	return {
		...logger,
		info(msg, options) {
			if (msg.includes('Collected')) {
				return
			}
			if (msg.includes('iconfont')) {
				return
			}
			if (msg.includes('page reload')) {
				return
			}
			logger.info(msg, options)
		},
	}
}

const metadata = JSON.parse(fs.readFileSync(resolve(__dirname, './src/_metadata.json')))
const fileNameList = fs.readdirSync(resolve(__dirname, './src/'))
const htmlFileList = fileNameList.filter(file => /.html$/.test(file))
const inputFiles = htmlFileList.reduce((acc, file) => {
	acc[file.slice(0, -5)] = resolve(__dirname, './src', file)
	return acc
}, {})

export default defineConfig(({ mode }) => {
	const plugins = [
		viteStaticCopy({
			targets: [
				{
					src: 'img/favicon/site.webmanifest',
					dest: './assets/webmanifest',
				},
			],
		}),
		mkcert(),
		handlebars({
			partialDirectory: [
				resolve(__dirname, './src/partials'),
				resolve(__dirname, './src/mails'),
			],
			context(pagePath) {
			  const pageData = metadata[pagePath] || {}
	  
			  const globalData = {
					main: 'js/app.js',
					secondary: '../js/app.js'
			  }
	  
			  return {
					...globalData,
					...pageData,
			  }
			},
		}),
		fantasticonPlugin({
			codepoints: customCodepoints,
			normalize: true,
		}),
		sharpPlugin(),
		postBuild(),
		mjmlCompilator(),
	]

	return {
		define: {
			__DEV__: mode === 'development'
		},
		server: {
			host: true,
			proxy: {
				'/api': {
					target: 'https://api.resend.com',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		},		
		publicDir: 'public',
		root: 'src',
		css: {
			devSourcemap: true,
			silenceDeprecations: true,
			preprocessorOptions: {
				stylus: {}
			}
		},
		build: {
			manifest: false,
			outDir: '../build',
			rollupOptions: {
				external: source => {
					return mode === 'production' && source.includes('js/components/_')
				},
				output: {
					assetFileNames: assetInfo => {
						let extType = assetInfo.name.split('.').pop()
						if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
							extType = 'fonts'
						} else if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = 'img'
						} else if (/css/i.test(extType)) {
							extType = 'css'
						} else {
							extType = 'other'
						}
						return `assets/${extType}/[name][extname]`
					},
					chunkFileNames: 'assets/js/[name].js',
					manualChunks(id) {
						if (id.includes('src/components')) {
							const name = path.basename(id).split('.')[0]
							return `component-${name}`
						}
					},
				},
				input: inputFiles,
			},
			cssCodeSplit: false,
			minify: true
		},
		plugins: plugins,
		customLogger: customLogger(),
	}
})
