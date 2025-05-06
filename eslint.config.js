import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"

export default [
	{
		ignores: ["build/**"],
	},
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				__DEV__: 'readonly',
				easeInOutQuad: 'readonly',
			},
		},
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"indent": ["error", "tab"],
			"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
			"semi": ["error", "never"],
			"no-useless-escape": "error",
			"no-unused-vars": "off",
			"no-unexpected-multiline": "off",
		},
	},
]
