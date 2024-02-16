#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';


// read version from package.json
import packageJson from '../package.json';
const version: string = packageJson.version;

// paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootPath = path.resolve(__dirname, '..'); // Adjust the ".." as necessary
const zipFileName: string = `notion-slick-${version}.zip`;
const distPath: string = path.join(projectRootPath, 'dist/');
const releasesPath: string = path.join(projectRootPath, 'releases', zipFileName);

// Create a zip file
const output = fs.createWriteStream(releasesPath);

// archiver setup
const archive = archiver('zip', {	zlib: { level: 9 } }); // Compression level = 9
output.on('close', () => {
	console.log('Archive created:', releasesPath, `${archive.pointer()} total bytes`);
});
archive.on('error', (err: Error) => {
	throw err;
});
archive.pipe(output);

// compress
archive.directory(distPath, false);
archive.finalize();
