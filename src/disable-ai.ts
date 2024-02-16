import { getDomElementAsync } from 'src/helpers/dom';
import { insertTextAtCursor } from 'src/helpers/keyboard';
import { watchLocalStorageValueAndCall } from 'src/helpers/local-storage';
import { HIDE_Q_A_BUTTON_SETTING, DISABLE_AI_ON_SPACE_PRESS_SETTING } from 'src/constants/strings';

const grandGrandGrandParent = (element: Element) => element?.parentElement?.parentElement?.parentElement?.parentElement;

export const toggleHideNotionQandAButton = async (shouldHideQandAButton: boolean) => {
	// 1. get button's svg icon
	const targeSvgIcon  = await getDomElementAsync('svg.sparkles[role="graphics-symbol"]');
	if (!targeSvgIcon) return;
	// 2. get button root element
	const targetAncestor = grandGrandGrandParent(targeSvgIcon);
	if (!targetAncestor) return;
	// 3. hide it
	targetAncestor.style.display = shouldHideQandAButton ? 'none' : 'block';
};

// let spacePressEventListener;
const handleSpacePress = (event: KeyboardEvent) => {
	// Check if the pressed key is 'Space'
	if (event.code === 'Space' || event.keyCode === 32) {
		// Prevent the default space key action (which shows the AI popup)
		event.preventDefault();
		// get element from which the event is triggered
		// const editableElement = event.target;
		// write space character (at current cursor position)
		insertTextAtCursor(' ');
	}
};


const toggleCSS = (shouldActivateCSS: boolean) => {
	const styleId = 'notion-slick-disable-ai-placeholder.css';
	let styleElement = document.getElementById(styleId);
	console.log('toggleCSS', shouldActivateCSS);

	if (shouldActivateCSS) {
		// create <style /> if not already in DOM (first call)
		if (!styleElement) {
			console.log('adding style to DOM');
			styleElement = document.createElement('style');
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}
		// set <style /> content (can also use textContent)
		styleElement.innerHTML = `
			[contenteditable][placeholder*="Press ‘space’ for AI"]:after {
			content: "Type ‘/’ for commands";
			}
		`;
	}
	else {
		if (styleElement) {
			// Clear <style /> content (can also use textContent)
			styleElement.innerHTML = '';
		}
	}
};


const toggleDisableAIOnSpacePress = (shouldDisableAIonSpacePress?: boolean) => {
	if (shouldDisableAIonSpacePress === undefined) return;
	toggleCSS(shouldDisableAIonSpacePress);
	if (shouldDisableAIonSpacePress) document.addEventListener('keydown', handleSpacePress);
	else document.removeEventListener('keydown', handleSpacePress);
};

// hide Q&A button
watchLocalStorageValueAndCall<boolean>(HIDE_Q_A_BUTTON_SETTING, toggleHideNotionQandAButton);

// disable AI popup when pressing spacebar at beginning of line
watchLocalStorageValueAndCall<boolean>(DISABLE_AI_ON_SPACE_PRESS_SETTING, toggleDisableAIOnSpacePress);
