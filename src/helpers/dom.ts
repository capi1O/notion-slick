export const getDomElementOrThrow = (selector: string) => {
	const domElement = document.querySelector(selector);
	if (!domElement) throw new Error(`selector not found: "${selector}"`);
	return domElement;
};

const GET_ELEMENT_REPEAT_DELAY = 100; // 100 ms
const GET_ELEMENT_MAX_DELAY = 15000; // 15 s
export const getDomElementAsync = (selector: string): Promise<Element> =>
	new Promise((resolve) => {
		// define element getter
		const getElement = (callback?: () => void) => {
			const element = document.querySelector(selector);
			if (element) {
				if (callback) callback();
				return resolve(element);
			}
		};
		// run getter once
		getElement();

		// continue here if Promise has not resolved
		let timeElapsed = 0;

		const intervalID = setInterval(() => {
			if (timeElapsed += GET_ELEMENT_REPEAT_DELAY, timeElapsed >= GET_ELEMENT_MAX_DELAY) {
				console.error(`selector not found: "${selector}"`), clearInterval(intervalID);
				return undefined;
			}
			getElement(() => { clearInterval(intervalID); });
		}, GET_ELEMENT_REPEAT_DELAY);
	});

export const getDomElementParentAsync = async (selector: string) => {
	const element = await getDomElementAsync(selector);
	if (element) return element.parentElement;
};