import React from 'react';
// import { useDebounceCallback } from 'usehooks-ts';
import debounce from 'lodash.debounce';
import { usePageChangeEffect } from 'src/hooks/page-change';
import { getDomElementOrThrow, getDomElementAsync } from 'src/helpers/dom';
import { updatedHeadingItemsWithCorrectIsFocus } from 'src/helpers/scroll';
import {
	NOTION_SCROLLER_SELECTOR,
	NOTION_BLOCK_ID_ATTRIBUTE,
	NOTION_LAYOUT_CONTENT_SELECTOR,
	NOTION_HEADING_1_CLASS,
	NOTION_HEADING_2_CLASS,
	NOTION_HEADING_3_CLASS,
} from 'src/constants/selectors';
export interface HeadingItem {
	blockId: string,
	text: string,
	level: number,
	offset: number,
	isFocused: boolean
}

// Defines class names for different header levels in Notion
const headingClasses = {
	heading_1: NOTION_HEADING_1_CLASS,
	heading_2: NOTION_HEADING_2_CLASS,
	heading_3: NOTION_HEADING_3_CLASS,
};

// duplicate in helpers/scroll.js
const getNotionFrameElementOrThrow = () => getDomElementOrThrow(NOTION_SCROLLER_SELECTOR);

// Function to extract header information from Notion's DOM structure
const headingsItemsFromDOM = () => {
	let headings = [];
	// Selects all elements matching the header class names
	const elements = getNotionFrameElementOrThrow().querySelectorAll(
		Object.values(headingClasses).map(className => `.${className}`).join(','),
	) as NodeListOf<HTMLElement>;

	for (const element of elements) {
		// Extracts text content, trimming whitespace
		const textContent = (element.querySelector('[placeholder]')?.textContent || '').trim();
		if (textContent === '') continue; // Skips empty headers

		// Extracts the block ID
		const blockId = element.getAttribute(NOTION_BLOCK_ID_ATTRIBUTE);
		if (!blockId) {
			console.error('data-block-id not found in element:', element);
			continue;
		}

		// Determines the header level based on its class
		const classList = element.classList;
		/* eslint-disable */
		const level = classList.contains(headingClasses.heading_1) ? 1 :
									classList.contains(headingClasses.heading_2) ? 2 :
									classList.contains(headingClasses.heading_3) ? 3 : undefined;
		/* eslint-enable */
		if (level === undefined) {
			console.error(`header level not found in classes: "${JSON.stringify(classList)}"`);
			continue;
		}

		// Adds the header info to the headers array
		headings.push({
			text: textContent,
			level: level,
			blockId: blockId,
			offset: element.offsetTop,
			isFocused: false,
		});
	}

	// Adjusts header levels if the minimum level is not 1
	if ((headings.length !== 0) && Math.min(...headings.map(header => header.level)) !== 1) {
		headings = headings.map(header => {
			header.level--;
			return header;
		});
	}

	return headings;
};

type NHOF = HeadingItem[] | ((headingItems: HeadingItem[]) => HeadingItem[]);

export const useHeadingItems = () => {
	const [headingItems, setHeadingItems] = React.useState<HeadingItem[]>([]);
	const currentHeadingItemsRef = React.useRef<HeadingItem[]>([]);
	
	// set headingItems, but also save them to ref (for page reload) and support functional updates
	const setHeadingItemsWrapper = React.useCallback((newHeadingItemsOrFunction: NHOF) => {
		if (typeof newHeadingItemsOrFunction == 'function') {
			// if new headings getter function, use it to update based on current state
			// here setter function uses current value
			setHeadingItems((currentHeadingItems) => {
				const updatedHeadingItems = newHeadingItemsOrFunction(currentHeadingItems);
				currentHeadingItemsRef.current = updatedHeadingItems;
				return updatedHeadingItems;
			});
		}
		else {
			// Directly set new headings if it's not a function
			setHeadingItems(newHeadingItemsOrFunction);
			currentHeadingItemsRef.current = newHeadingItemsOrFunction;
		}
	}, []);

	// get updated headings data from DOM and update .isFocused based on scroll position
	const updateHeadingItems = React.useCallback(() => {
		const newHeadingItems = headingsItemsFromDOM();
		setHeadingItemsWrapper(updatedHeadingItemsWithCorrectIsFocus(newHeadingItems));
	}, [setHeadingItemsWrapper]);

	// Fetches layout content element asynchronously
	const getLayoutContentElementAsync = async () => getDomElementAsync(NOTION_LAYOUT_CONTENT_SELECTOR);

	// on page change: update headingItems
	usePageChangeEffect(() => {
		// pass current headings (if any) to preserve state (because state (headingItems) is reset on page change to [])
		if (currentHeadingItemsRef.current.length > 0) setHeadingItemsWrapper(currentHeadingItemsRef.current);
		(async () => {
			await getLayoutContentElementAsync();
			updateHeadingItems();
		})();
	});

	// on page change, (re)setup watch for notion layout content changes (will trigger headingItems update)
	usePageChangeEffect(() => {
		let observer: MutationObserver;
		(async () => {
			await getLayoutContentElementAsync();
			observer = new MutationObserver(debounce(updateHeadingItems));
			observer.observe(getNotionFrameElementOrThrow(), { childList: true, subtree: true, characterData: true });
		})();
		return () => observer && observer.disconnect();
	});

	// on page change, (re)add scroll listener (will update headingItems via setHeadingsWrapper)
	usePageChangeEffect(() => {
		const handleScroll = debounce(() => setHeadingItemsWrapper(updatedHeadingItemsWithCorrectIsFocus));
		(async () => {
			await getDomElementAsync('main');
			const notionFrame = getNotionFrameElementOrThrow();
			notionFrame.addEventListener('scroll', handleScroll);
			handleScroll();
		})();
		return () => {
			const notionFrame = getNotionFrameElementOrThrow();
			notionFrame.removeEventListener('scroll', handleScroll);
		};
	});

	return headingItems;
};