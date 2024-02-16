import React from 'react';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorageValue } from '../hooks/local-storage';
import type { FC } from 'react';

interface StyleProps {
}

const useStyles = createUseStyles<string, StyleProps>({

	flagSetting: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 5,
		position: 'relative',
		borderStyle: 'solid',
		borderRadius: 5,
		paddingLeft: 5,
		paddingRight: 5,
		borderColor: 'transparent',
		'&:hover': {
			borderColor: 'black',
		},
	},

	label: {
		whiteSpace: 'nowrap',
		position: 'relative',
		zIndex: 0,
	},
	
	// Hide the default checkbox
	toogleCheckbox: {
		position: 'absolute',
		zIndex: 1,
		opacity: 0,
		left: 0,
		width: '100%',
		top: 0,
		height: '100%',
		cursor: 'pointer',
	},
	
	toogleIcon: {
		marginLeft: 20,
		fontSize: 24,
		position: 'relative',
		zIndex: 0,
	},


});

interface FlagSettingProps {
	name: string;
	_key: string;
	defaultValue: boolean;
}


const FlagSetting:FC<FlagSettingProps> = ({ name, _key: key, defaultValue }) => {
	const [isSettingEnabled, setIsEnabled] = useLocalStorageValue<boolean>(key, defaultValue);
	const classes = useStyles();

	const isEnabled = isSettingEnabled ?? defaultValue;

	// useCallback ?
	const onToggle = () => {
		console.log('toggle', !isSettingEnabled);
		setIsEnabled(!isSettingEnabled);
	};

	return (
		<div className={classes.flagSetting}>
			<label htmlFor={name} className={classes.label}>{name}</label>
			<input
				type="checkbox"
				id={key}
				checked={isEnabled}
				onChange={onToggle}
				className={classes.toogleCheckbox}
			/>
			<FontAwesomeIcon icon={isEnabled ? faToggleOn : faToggleOff} className={classes.toogleIcon} />
		</div>
	);
};

const MemoizedFlagSetting = React.memo(FlagSetting);
export default MemoizedFlagSetting;
