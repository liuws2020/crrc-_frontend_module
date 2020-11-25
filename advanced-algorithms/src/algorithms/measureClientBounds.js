export const measureClientBounds = function (DOM, edge_1, edge_2) {
	const dir = ["top", "bottom", "left", "right"];
	if (
		!dir.includes(edge_1) ||
		!dir.includes(edge_2) ||
		!(DOM instanceof HTMLElement)
	) {
		return null;
	}

	const range = document.createRange();
	range.selectNodeContents(DOM);
	let gap = 0;
	if (range.getBoundingClientRect) {
		var rect = range.getBoundingClientRect();
		if (rect) {
			gap = rect[edge_1] - rect[edge_2];
		}
	}
	return gap;
};
