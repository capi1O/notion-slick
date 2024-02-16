import { createRoot } from 'react-dom/client';
import { getDomElementParentAsync } from 'src/helpers/dom';
import { NOTION_APP_ID, NOTION_SIDEBAR_CONTENT_SELECTOR, NOTION_SLICK_TOC_CLASS } from 'src/constants/selectors.js';
import ThemeProvider from 'src/providers/theme';
import TocContainer from 'src/components/TocContainer';


// @TODO: add a setting to place ToC differently (ex before .notion-scroller)
const notionAppExists = document.getElementById(NOTION_APP_ID);
if (notionAppExists) {

	// load Table of Contents in sidebar
	(async () => {
		// get notion element in sidebar
		const notionSideBarContentElement = await getDomElementParentAsync(NOTION_SIDEBAR_CONTENT_SELECTOR);
		if (!notionSideBarContentElement) return;
		// create root div
		const notionToc = document.createElement('div');
		notionToc.className = NOTION_SLICK_TOC_CLASS;
		// insert div as first child in notion sidebar
		notionSideBarContentElement.prepend(notionToc);

		const root = createRoot(notionToc);
		root.render(
			<ThemeProvider>
				<TocContainer />
			</ThemeProvider>,
		);
	})();
}