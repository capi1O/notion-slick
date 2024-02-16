import { getDomElementOrThrow } from 'src/helpers/dom';
import { HEADER_Y_OFFSET } from 'src/constants/layout';
import { NOTION_SCROLLER_SELECTOR, NOTION_BLOCK_ID_ATTRIBUTE } from 'src/constants/selectors';
import type { HeadingItem } from 'src/hooks/headings';

// duplicate in hooks/headings.js
const getNotionFrameElementOrThrow: () => HTMLElement = () =>
	getDomElementOrThrow(NOTION_SCROLLER_SELECTOR) as HTMLElement;

// scroll to block corresponding to heading (in main view)
export const scrollToBlock = (blockId: string) => {
	const blockElement: HTMLElement = getDomElementOrThrow(`[${NOTION_BLOCK_ID_ATTRIBUTE}='${blockId}']`) as HTMLElement;
	getNotionFrameElementOrThrow().scroll({ top: blockElement.offsetTop - HEADER_Y_OFFSET });
};

// will return an updated headingItems array with one of those item with isFocused: true (corresponding to heading currently in focus)
export const updatedHeadingItemsWithCorrectIsFocus = (headingItems: HeadingItem[]) => {
	// Early return if the elements array is empty
	if (headingItems.length === 0) return headingItems;

	// Retrieve the notion frame element and calculate its effective scroll position
	const notionFrame = getNotionFrameElementOrThrow();
	const scrollPosition = notionFrame.offsetTop + notionFrame.scrollTop;

	// Clone the input array to avoid mutating the original elements
	const clonedElements = structuredClone(headingItems);

	// Initialize a variable to keep track of the element to focus
	let elementToFocus = null;

	// Iterate over the cloned elements to reset focus and identify the new element to focus
	for (const element of clonedElements) {
		// Reset focus for all elements
		element.isFocused = false; 
		// Update element to focus based on scroll position
		if (scrollPosition >= element.offset - HEADER_Y_OFFSET) elementToFocus = element;
	}

	// If no element was found to focus based on the condition, default to the first element
	// Also, ensure the selected element's isFocused property is set to true
	(elementToFocus ??= clonedElements[0]).isFocused = true;

	// Return the updated list of elements
	return clonedElements;
};
