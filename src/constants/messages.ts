import type { ReactElement } from 'react';

export const supportedLocales = ['en'] as const;
export type SupportedLocale = typeof supportedLocales[number];

type MessagesForLocale = {
	[locale: string]: string | ReactElement;
}

type Messages = {
	[locale in SupportedLocale]: MessagesForLocale;
}

const messages: Messages = {
	en: {
		no_headings: 'No headings',
		table_of_contents: 'Table of contents',
		example_with_values: 'Foo is: $1, bar is: $2.',
	},
};

export default messages;