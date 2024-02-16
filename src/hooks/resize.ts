import { ResizeObserver } from '@juggle/resize-observer'; // ResizeObserver polyfill
import { useResizeObserver } from 'usehooks-ts';

if (!window.ResizeObserver) {
	window.ResizeObserver = ResizeObserver;
}
// re-export useResizeObserver by adding polyfill
export { useResizeObserver as useSizeObserver };