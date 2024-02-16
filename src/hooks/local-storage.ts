import { useState, useEffect, useRef } from 'react';
import { readLocalStorageValue, writeLocalStorageValue } from '../helpers/local-storage';
import type { Dispatch, SetStateAction } from 'react';

type ULSVRT<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>];

// default value will be written to store if none was present 
export const useLocalStorageValue = <T>(key: string, defaultValue: T): ULSVRT<T> => {

	// flag to know when it's safe to write to local storage
	const isStoredValue = useRef(false);
	// const currentValue = useRef(undefined);

	// 1. Initialize the state with the default value
	// default value should not be stored in LS if no value is stored yet
	// isSettingStoredValue.current = true;
	const [value, setValue] = useState<T | undefined>(undefined);
	// isSettingStoredValue.current = false;

	// 2. Fetch the value from localStorage and update the state when ready
	useEffect(() => {
		// IIFE needed because cannot set effect as async directly
		(async () => {
			const storedValue = await readLocalStorageValue<T>(key);
			if (storedValue !== undefined) {
				isStoredValue.current = true;
				setValue(storedValue);
				// currentValue.current = storedValue;
				isStoredValue.current = false;
			}
			else setValue(defaultValue); // will trigger write to LS
		})();
	}, [key, defaultValue]);

	// 3. Watch for storage changes (in local area, not sync)
	useEffect(() => {
		const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
			if (areaName === 'local' && changes[key]) {
				const newValue = changes[key].newValue;
				if (newValue !== value) {
					isStoredValue.current = true;
					setValue(newValue);
					isStoredValue.current = false;
				}
			}
		};
		chrome.storage.onChanged.addListener(handleStorageChange);

		// Remove event listener on "unmount" (key change, etc...)
		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, [key, value]);

	// 4. Update localStorage whenever the value changes (when setValue is triggered)
	// /!\: effect also triggered when setting value coming from local storage, ex at step 2. after reading stored value, or at step 3 after LS change. in those case writing is not needed therefore a flag `isStoredValue` is used to prevent this
	useEffect(() => {
		if (!isStoredValue.current && (value !== undefined)) writeLocalStorageValue(key, value);
	}, [key, value]);

	return [value, setValue];
};
