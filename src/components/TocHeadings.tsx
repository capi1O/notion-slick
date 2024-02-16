import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import TocHeading from './TocHeading';
import { useLocalizedText } from '../hooks/translations';
import { SCROLL_BAR_WIDTH } from '../constants/layout';
import type { HeadingItem } from '../hooks/headings';
import type { Theme } from '../providers/theme';


const shouldCustomizeScrollbar = false; // @TODO: make it a setting
interface StyleProps {
	theme: Theme,
	noHeadings: boolean;
}

const useStyles = createUseStyles<string, StyleProps>({

	headings: ({ theme, noHeadings }) => ({
		boxSizing: 'border-box',
		margin: noHeadings ? '0 0 8px 23px' : 0,
		overflow: 'hidden',
		overflowY: 'auto',
		scrollbarGutter: 'stable',

		// conditional block
		...(shouldCustomizeScrollbar ? { '&::-webkit-scrollbar': {
			width: SCROLL_BAR_WIDTH,
			backgroundColor: theme.notionBackgroundColor,
		}}: {}),
	}),
});

interface TocHeadingsProps {
	headingItems: HeadingItem[];
	lightensLast?: boolean;
}

const TocHeadings = React.forwardRef<HTMLDivElement, TocHeadingsProps>(({ headingItems, 
}, ref) => {

	const noHeadings = headingItems.length === 0;

	const noHeadingsText = useLocalizedText('no_headings');
	const theme: Theme = useTheme();
	const classes = useStyles({ theme, noHeadings });

	return (
		<div ref={ref} className={classes.headings}>
			{ noHeadings ? noHeadingsText :
				headingItems.map((headingItem) => <TocHeading key={headingItem.blockId} {...headingItem} />) }
		</div>
	);
});

const MemoizedTocHeadings = React.memo(TocHeadings);
export default MemoizedTocHeadings;
