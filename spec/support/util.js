/**
 * Removes indent and line-feed from HTML string.
 *
 * @param {string} html
 */
export function trimHtml(html) {
	return html.split('\n').map(line => line.trim()).join('');
}

export async function waitLoad(el) {
	return await new Promise(resolve => {
		const hndl = setInterval(() => {
			if (el.innerHTML) {
				clearInterval(hndl);
				resolve();
			}
		}, 50);
	});
}