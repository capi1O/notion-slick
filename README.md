<p align="center">
	<img src="logo.svg" alt="notion-slick-logo" width="128"/>
</p>

# Notion-slick

Chrome Extension that adds the following features for [Notion](https://www.notion.so/):
- 📋 Table of Contents in Sidebar
- 🚫 Q&A button hidden
- ⌨️ AI on space press (beginning of line) disabled

Each feature can be enabled/disabled in the extension settings (accessible by clicking the extension icon).

# Development

## Commands

`npm run COMMAND`

- `dev`: will build to `dist` dir with live reload. In `chrome://extensions/` you can then click "load unpacked" and select the `dist` dir.
- `build`: build for production.
- `lint`: lint all (typescript) source files.
- `version-bump`: increase package.json version (used in manifest.json), also automatically create a git tag with the version number.
- `release`: compress output from `dist` dir into zip file (named with version number) and move it to `releases` dir.

## Structure

### vite build

- `src/toc.jsx` => JS to build the Table of Contents
- `src/background.js` => used to listen for page changes and inform toc.tsx (`sendMessage`)
- `disable-ai.ts` => loads some tweaks to disable AI in Notion

Both file are referenced in manifest.json which is read by [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools) to build the output by looking at `content_scripts` and `background` keys.

### file loading

- `toc.jsx` => loaded dynamically by `toc.tsx-loader.js`
- `disable-ai.ts` => loaded dynamically by `disable-ai.ts-loader.js`
- `background.js` => loaded dynamically by `service-worker-loader.js`

## Stack
 
React + TypeScript + Vite, made from `npm create vite@latest --template react-ts`.

> This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

ESLint is used for code linting.

### HMR / Fast Refresh

This setup uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) which uses [Babel](https://babeljs.io/) for Fast Refresh. ~~Another option is to use [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) which uses [SWC](https://swc.rs/) instead~~.

The vite plugin ~~[hot-reload-extension-vite](https://github.com/isaurssaurav/hot-reload-extension-vite-plugin/)~~ [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools) is used to live build dist folder (watch source code changes and automatically re-build) ~~however as of today it does not fully work, the web page still needs to be manually reloaded to see the changes, even when not using dynamic import for content.js (see issue https://github.com/isaurssaurav/hot-reload-extension-vite-plugin/issues/8).~~

This plugin supports vite v5 even if the doc says v3:

> We've merged #841. @crxjs/vite-plugin@2.0.0-beta.23 is Vite 5 compatible now
https://github.com/crxjs/chrome-extension-tools/issues/835

It's not possible to use [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) because it's not compatible with this vite plugin.


## ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
