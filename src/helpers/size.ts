import { BOTTOM_GAP } from 'src/constants/layout';

export const updateTocHeadingMaxHeight = (tocHeaderHeight: number, tocHeadingsRef: React.RefObject<HTMLDivElement>,	tocContainerOffsetTop: number) => {
	const maxHeight = window.innerHeight - tocContainerOffsetTop - tocHeaderHeight - BOTTOM_GAP; // px
	if (tocHeadingsRef.current)
		tocHeadingsRef.current.style.maxHeight = `${maxHeight}px`;
};
