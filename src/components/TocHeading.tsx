import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { scrollToBlock } from 'src/helpers/scroll';
import {
	HEADING_INDICATOR_WIDTH,
	HEADING_FONT_SIZE,
	HEADING_LEFT_PADDING,
	ARROW_WIDTH,
} from 'src/constants/layout';
import type { FC } from 'react';
import type { Theme } from 'src/providers/theme';

interface StyleProps {
	theme: Theme;
	level: number;
	isFocused: boolean;
}

const useStyles = createUseStyles<string, StyleProps>({

	heading: ({ theme, level, isFocused }) => ({
		paddingLeft: HEADING_LEFT_PADDING,
		margin: '4px 0',
		marginLeft: `${ARROW_WIDTH * (level - 1)}px`,
		fontSize: HEADING_FONT_SIZE,
		overflowWrap: 'break-word',
		borderLeftWidth: HEADING_INDICATOR_WIDTH,
		borderLeftStyle: 'solid',
		borderColor: 'transparent',

		'&:hover': {
			textDecoration: 'underline',
			borderColor: theme.borderColor,
		},

		// conditional block
		...(isFocused ? {
			fontWeight: 700,
			color: theme.focusColor,
			borderColor: theme.focusColor,
			'&:hover': {
				borderColor: theme.focusColor,
			},
		} : {}),
	}),
});


interface TocHeadingProps {
	blockId: string;
	isFocused: boolean;
	level: number;
	text: string;
}

const TocHeading:FC<TocHeadingProps> = ({ blockId, isFocused, level, text }) => {

	const theme: Theme = useTheme();
	const classes = useStyles({ theme, level, isFocused });

	return (
		<div
			key={blockId}
			className={classes.heading}
			role="button"
			onClick={() => {
				location.hash = `#${blockId.replaceAll('-', '')}`;
				scrollToBlock(blockId);
			}}
		>
			{text}
		</div>
	);
};

const MemoizedTocHeading = React.memo(TocHeading);
export default MemoizedTocHeading;
