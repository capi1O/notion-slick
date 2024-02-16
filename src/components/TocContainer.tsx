import React, { useRef } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHeadingItems } from '../hooks/headings';
import { useLocalStorageValue } from '../hooks/local-storage';
import { ENABLE_TOC_SETTING, TOC_STATE } from '../constants/strings';
import { CONTAINER_PADDING_LEFT } from '../constants/layout';
import TocHeadings from './TocHeadings';
import TocHeader from './TocHeader';
import type { FC } from 'react';
import type { Theme } from '../providers/theme';

interface TocHeadingsWrapperProps {
	tocHeadingsRef: React.RefObject<HTMLDivElement>;
}

const TocHeadingsWrapper: FC<TocHeadingsWrapperProps> = React.memo(({ tocHeadingsRef }) => {
	const headingItems = useHeadingItems();
	return <TocHeadings headingItems={headingItems} ref={tocHeadingsRef} />;
});

interface StyleProps {
	theme: Theme;
	isFolded: boolean;
}

const useStyles = createUseStyles<string, StyleProps>({

	container: {
		padding: 0,
		paddingLeft: CONTAINER_PADDING_LEFT,
		margin: 0,
		fontSize: 14,
		borderTop: ({ theme }) => `1px solid ${theme.borderColor}`,
		borderBottom: ({ theme }) => `1px solid ${theme.borderColor}`,
		'&[role=button]': { cursor: 'pointer' },

		'& a': {
			cursor: 'pointer !important',
		},

		'& svg': {
			display: 'inline',
			flexShrink: 0,
			// @ts-expect-error: typescript bugs with 'fill' property for some reason
			fill: ({ theme }) => theme.svgColor,
			backfaceVisibility: 'hidden',
		},
	},

	main: {
		display: ({ isFolded }) => isFolded ? 'none': 'block',
	},
});

const TocContainer = () => {
	const tocContainerRef = useRef(null);
	const tocHeadingsRef = useRef(null);
	const [shouldEnableToC] = useLocalStorageValue<boolean>(ENABLE_TOC_SETTING, true);
	const [isTocFolded, setIsTocFolded] = useLocalStorageValue<boolean>(TOC_STATE, false);
	const toggleTocFold = () => setIsTocFolded(prevValue => !prevValue);
	const theme: Theme = useTheme();
	const isFolded = isTocFolded || false;
	const classes = useStyles({ theme, isFolded });

	if (shouldEnableToC) return (
		<div ref={tocContainerRef} className={classes.container}>
			<TocHeader
				tocHeadingsRef={tocHeadingsRef}
				tocContainerRef={tocContainerRef}
				isTocFolded={isFolded}
				toggleTocFold={toggleTocFold}
			/>
			<div className={classes.main}>
				<TocHeadingsWrapper tocHeadingsRef={tocHeadingsRef}/>
			</div>
		</div>
	);
	else return null;
};

export default TocContainer;
