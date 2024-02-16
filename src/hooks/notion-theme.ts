import React from 'react';
import { getDomElementAsync } from '../helpers/dom';
import { NOTION_LIGHT_THEME_CLASS, NOTION_DARK_THEME_CLASS } from '../constants/selectors';


export const useNotionTheme = () => {
	const [isDark, setIsDark] = React.useState<boolean | undefined>(undefined);
	
	React.useLayoutEffect(() => {

		const getThemeDomElement = async () => await getDomElementAsync(`.${NOTION_LIGHT_THEME_CLASS}, .${NOTION_DARK_THEME_CLASS}`);

		// keep ref of observer to remove it on unmount
		let observer: MutationObserver;

		// IIFE needed to wrap async calls (await) in useEffect
		(async () => {

			// get DOM element containing notion theme class
			const themeElement = await getThemeDomElement();

			// function to check if notion dark theme class is present in DOM element and set flag
			const checkThemeAndSetFlag = async (themeElement2?:Element) => {
				const themeElement = themeElement2 ?? (await getThemeDomElement());
				setIsDark(themeElement.matches(`.${NOTION_DARK_THEME_CLASS}`));
			};
			// execute it once
			checkThemeAndSetFlag(themeElement);

			// setup watch for notion theme class changes (because change Notion theme does not reload the page)
			observer = new MutationObserver(() => { checkThemeAndSetFlag(); });
			observer.observe(themeElement, {
				attributes: true, // watch for changes in attributes
				attributeFilter: ['class'], // only for the 'class' attribute
				// subtree: true, // watch for changes in descendants as well (not needed)
			});
		})();

		// cleanup remove listener on unmout
		return () => observer && observer.disconnect();

	}, []);

	return isDark; // Return the current theme class
};

