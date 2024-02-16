import React from 'react';
import messages, { supportedLocales } from '../constants/messages';
import type { ReactElement } from 'react';
import type { SupportedLocale } from '../constants/messages';

// Function to recursively replace strings in React elements and their children
const replaceStringInElement = (element: ReactElement, searchValue: RegExp, replaceValue: string):ReactElement => React.cloneElement(
	element, 
	{}, 
	React.Children.map(element.props.children, child => 
		typeof child === 'string' ? 
			child.replace(searchValue, replaceValue) : 
			React.isValidElement(child) ? 
				replaceStringInElement(child, searchValue, replaceValue) : 
				child,
	),
);

// type guard to check if a locale is supported
export const isLocaleSupported = (locale: SupportedLocale | string): locale is SupportedLocale => {
	return (supportedLocales as readonly string[]).includes(locale);
};

const defaultLocale: SupportedLocale = 'en';

const browserLanguage = navigator.language;

let selectedLocale: string | undefined;
const getSelectedLocale = (): string => {
	if (selectedLocale == null) selectedLocale = new URLSearchParams(location.search).get('locale') ?? 'defaultLocale';
	return selectedLocale;
};

let localeGetter;
const getCurrentLocale = ():SupportedLocale => localeGetter ??= (() => {
	const locale: SupportedLocale | string = (getSelectedLocale() ?? browserLanguage).slice(0, 2);
	return isLocaleSupported(locale) ? locale : defaultLocale;
})();

// Function to replace placeholders in a string or React element with values from an array
const replacePlaceholders = (message: string | ReactElement, values: string[]) => {
	// message is string
	if (typeof message === 'string') {
		for (const [index, value] of values.entries()) message = message.replaceAll(`$${index+1}`, String(value));
		return message;
	}
	// message is ReactElement
	else if (React.isValidElement(message)) {
		for (const [index, value] of values.entries())
			message = replaceStringInElement(message, new RegExp(`\\$${index+1}`, 'g'), String(value));
		return message;
	}
	else throw new Error(`message invalid: "${JSON.stringify(message)}"`);
};

// Function to get the localized message and replace placeholders if necessary
const getLocalizedMessage = (messageKey: string, ...values: string[]) => {
	const locale = getCurrentLocale();
	const messagesForLocale = messages[locale];
	const message = messagesForLocale[messageKey];
	return values.length === 0 ? message : replacePlaceholders(message, values);
};

// Custom hook to get (memoized) localized messages
// example use (without values): const noHeadingsText = useLocalizedText ('table_of_contents');
// example use (with 2 values): const noHeadingsText = useLocalizedText ('table_of_contents', foo, bar);
export const useLocalizedText = (messageKey: string, ...values: string[]) => React.useMemo(() => getLocalizedMessage(messageKey, ...values), [messageKey, values]);

