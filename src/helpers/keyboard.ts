export const insertTextAtCursor = (text: string) => {

	// way 1, deprecated
	document.execCommand('insertText', false, text);

	// way 2
	// const sel = window.getSelection();
	// if (sel && sel.rangeCount > 0) {
	// 	const range = sel.getRangeAt(0);
	// 	range.deleteContents(); // Optional: delete selected text
    
	// 	// Create a new text node and insert it
	// 	const textNode = document.createTextNode(text);
	// 	range.insertNode(textNode);
    
	// 	// Move the cursor to the end of the inserted text
	// 	range.setStartAfter(textNode);
	// 	range.setEndAfter(textNode);
	// 	sel.removeAllRanges(); // Clear existing selections
	// 	sel.addRange(range); // Update the selection to the new range
	// }
};