/* global module */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
		webextensions: true, // allow chrome extension global variables
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '*.html'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		semi: ['error', 'always'],
		quotes: ['error', 'single'],
		indent: ['error', 'tab'],
		'comma-dangle': ['error', 'always-multiline'],
		'quote-props': ['error', 'as-needed'],
		'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
		'func-style': ['error', 'expression', { allowArrowFunctions: true }],
	},
};
