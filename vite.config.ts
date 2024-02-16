import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

import manifest from './manifest';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		crx({ manifest }),
	],
});
