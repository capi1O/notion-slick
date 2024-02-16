import React from 'react';
import { PAGE_CHANGED_EVENT } from 'src/constants/strings';

import type { EffectCallback } from 'react';

export const usePageChangeEffect = (effect: EffectCallback) => {
	React.useEffect(() => {
		// Initialize any setup logic defined in the effect callback
		// effect can optionnally return a cleanup function
		const cleanupFunction = effect();

		// Event handler to detect page changes
		const onPageChange = ({ type }: Event) => {
			if (type === PAGE_CHANGED_EVENT) {
				// Execute cleanup from previous setup if available
				if (cleanupFunction) cleanupFunction();
				// Execute the effect callback again due to the page change
				effect();
			}
		};

		// Listen for messages indicating a page change
		chrome.runtime.onMessage.addListener(onPageChange);

		// Cleanup function to remove the listener
		return () => {
			chrome.runtime.onMessage.removeListener(onPageChange);
			// Also execute cleanup when the component unmounts or on re-run before setting up again
			if (cleanupFunction) cleanupFunction();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // don't add effect to the deps otherwise the web page will hang
};