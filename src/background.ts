import { PAGE_CHANGED_EVENT } from 'src/constants/strings';

// Listen for history navigation state to detect page changes
chrome.webNavigation.onHistoryStateUpdated.addListener(
	async (event) => {
		// Send a message to the content script of the tab that experienced a navigation change
		try { await chrome.tabs.sendMessage(event.tabId, { type: PAGE_CHANGED_EVENT }); }
		// only throw if it's not a disconnection issue
		catch (error: unknown) {
			if (error instanceof Error && !error.message.includes('Could not establish connection')) throw error;
		}
	}, {
		// Filter to only listen for navigation changes on URLs starting with the Notion web app
		url: [{ urlPrefix: 'https://www.notion.so/' }],
	},
);
