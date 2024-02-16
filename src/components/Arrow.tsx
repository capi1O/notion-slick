import React from 'react';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'; // same icon Notion uses
import { ARROW_WIDTH } from '../constants/layout';
import type { FC } from 'react';

type Direction = 'up' | 'down' | 'right' | 'left';
interface ArrowProps {
	direction: Direction;
}
type RotateForDirection = (direction: Direction) => number;

const rotateForDirection: RotateForDirection = (direction) => {
	switch (direction) {
	case 'up': return 180;
	case 'down': return 0;
	case 'right': return -90;
	case 'left': return 90;
	default: return 0;
	}
};

const useStyles = createUseStyles<string, ArrowProps>({

	arrow: {
		width: ARROW_WIDTH,
		transform: ({ direction }) => `rotate(${rotateForDirection(direction)}deg)`,
		transition: 'transform ease-in-out 0.4s',
	},
});


const Arrow: FC<ArrowProps> = ({ direction }) => {

	const classes = useStyles({ direction });

	return (
		// <FontAwesomeIcon icon={faChevronDown} rotation={rotateForDirection(direction)} />
		<FontAwesomeIcon icon={faChevronDown} className={classes.arrow} />
	);
};

const MemoizedArrow = React.memo(Arrow);
export default MemoizedArrow;