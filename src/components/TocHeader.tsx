import React, { useEffect, useRef } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useWindowSize } from 'usehooks-ts';
import { useLocalizedText } from '../hooks/translations';
import { useSizeObserver } from '../hooks/resize';
import { updateTocHeadingMaxHeight } from '../helpers/size';
import Arrow from './Arrow';
import type { FC } from 'react';
import type { Theme } from '../providers/theme';


interface StyleProps {
	theme: Theme;
}

const useStyles = createUseStyles<string, StyleProps>({

	header: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '10px 0px',
		color: ({ theme }) => theme.headerTextColor,
	},

	inner: {
		display: 'flex',
		alignItems: 'center',
	},

	title: {
		marginLeft: 5,
	},
});

interface TocHeaderProps {
	tocHeadingsRef: React.RefObject<HTMLDivElement>;
	tocContainerRef: React.RefObject<HTMLDivElement>;
	isTocFolded: boolean;
	toggleTocFold: () => void;
}

const TocHeader: FC<TocHeaderProps> = ({ tocHeadingsRef, tocContainerRef, isTocFolded, toggleTocFold }) => {

	// watch TocHeader height TocContainer
	const ref = useRef(null);
	const { height = 0 } = useSizeObserver({ ref, box: 'border-box' });
	// watch window height
	const { height: windowHeight = 0 } = useWindowSize();
	// watch TocContainer offset (from top)
	// since the effect is run on window height change the offset value will always be correct
	// technically offset can chang	e on page width change but since the sidebar does not change width it is not the case in practice
	const tocContainerOffsetTop = tocContainerRef?.current?.offsetTop ?? 0;
	// recompute <ToCHeadings /> max height whenever it changes
	useEffect(() => {
		updateTocHeadingMaxHeight(height, tocHeadingsRef, tocContainerOffsetTop);
	},[height, windowHeight, tocHeadingsRef, tocContainerOffsetTop]);

	const title = useLocalizedText('table_of_contents');
	const theme: Theme = useTheme();
	const classes = useStyles({ theme });

	return (
		<div
			ref={ref}
			className={classes.header}
			onClick={() => toggleTocFold()}
			role="button"
		>
			<div className={classes.inner}>
				{/* when folded => arrow right, when expanded => arrow down;
				 it's consistent with how toggle headings are usually displayed (for instance in Notion) since the arrow in not located at the bottom but on top left. */}
				<Arrow direction={isTocFolded ? 'right' : 'down'} />
				<span className={classes.title}>{title}</span>
			</div>
		</div>
	);
};

const MemoizedTocHeader = React.memo(TocHeader);
export default MemoizedTocHeader;
