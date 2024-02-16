export type LocalStorageValue = boolean | string;

export const readLocalStorageValue = async <T>(key: string): Promise<T | undefined> => {
	const storedValue = (await chrome.storage.local.get(key))[key];
	return storedValue;
};

export const writeLocalStorageValue = async <T>(key: string, value: T) =>
	await chrome.storage.local.set({ [key]: value });

export const watchLocalStorageValueAndCall = async <T>(key: string, callback: (value: T) => void) => {
	// 1. read value
	const storedValue = await readLocalStorageValue<T>(key);
	// 2. call callback with this inital value
	if (storedValue !== undefined) callback(storedValue);
	// 3. Watch for storage changes (in local area, not sync)
	const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
		if (areaName === 'local' && changes[key]) {
			const newValue = changes[key].newValue;
			if (newValue !== undefined) callback(newValue);
		}
	};
	chrome.storage.onChanged.addListener(handleStorageChange);
};
