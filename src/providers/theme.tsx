// @TODO: move file somewhere else
import React from 'react';
import { ThemeProvider } from 'react-jss';
import { useNotionTheme } from 'src/hooks/notion-theme';
import type { FC } from 'react';
import type { DefaultTheme } from 'react-jss';


export interface Theme extends DefaultTheme {
	notionBackgroundColor: string;
	borderColor: string;
	svgColor: string;
	focusColor: string;
	headerTextColor: string;
}

const lightTheme: Theme = {
	notionBackgroundColor: '##FBFBFA',
	borderColor: '#e3e3e3',
	svgColor: 'rgb(55 53 47 / 45%)',
	focusColor: 'rgb(55 53 47)',
	headerTextColor: '#656380',
};

const darkTheme: Theme = {
	notionBackgroundColor: '#202020',
	borderColor: '#3d3d3d',
	svgColor: 'rgb(255 255 255 / 48.2%)',
	focusColor: 'rgb(255 255 255 / 81%)',
	headerTextColor: 'rgb(155 155 155)',
};

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider: FC<CustomThemeProviderProps> = ({ children }) => {

	const isDark = useNotionTheme();
	const currentTheme = isDark ? darkTheme : lightTheme;

	return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
};

export default CustomThemeProvider;