import fs from 'fs'
import path from 'path'

export default function postBuild() {
	return {
		name: 'post-build-url-replace',
		closeBundle() {
			const cssFilePath = path.resolve(__dirname, '../build/assets/css/style.css')
			if (fs.existsSync(cssFilePath)) {
				let content = fs.readFileSync(cssFilePath, 'utf-8')
				
				// Fix the paths and ensure proper closing quotes
				content = content.replace(/url\((\/assets\/fonts\/fantasticon\.[^)]*)\)/g, "url('../fonts/fantasticon$1')")
                
				// Also, make sure to remove the "/assets/fonts/" part
				content = content.replace(/url\('\.\.\/fonts\/fantasticon\/assets\/fonts\//g, "url('../fonts/")
                
				// New replacement logic to change 'assets' to '..'
				content = content.replace(/url\((\/assets\/[^)]*)\)/g, (match, p1) => {
					const updatedPath = p1.replace('/assets/', '../')
					return `url('${updatedPath}')`
				})

				fs.writeFileSync(cssFilePath, content, 'utf-8')
			}
		}
	}
}