import { terser } from 'rollup-plugin-terser'
import sucrase from '@rollup/plugin-sucrase'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

const config = {
	input: `src/index.ts`,
	external: ['three', 'aframe'],
	output: [
		{
			format: 'cjs',
			file: pkg.main,
		},
		{
			format: 'es',
			file: pkg.module,
		},
	],

	plugins: [
		sucrase({
			exclude: ['node_modules/**'],
			transforms: ['typescript'],
		}),
		resolve({
			extensions: ['.js', '.ts'],
		}),
	],
}

const browser_config = {
	input: `src/index.ts`,
	external: ['three', 'aframe'],
	output: {
		sourcemap: true,
		format: 'umd',
		name: 'aframeskeletor',
		file: pkg.browser,
		globals: {
			three: 'THREE',
			aframe: 'AFRAME',
		},
	},
	plugins: [
		sucrase({
			exclude: ['node_modules/**'],
			transforms: ['typescript'],
		}),

		resolve({
			extensions: ['.js', '.ts'],
		}),
		// If we're building for production (npm run build
		// instead of npm run dev), minify
		terser(),
	],
}

export default [config, browser_config]
