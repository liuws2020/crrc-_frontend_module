export const requestInterval = function (fn, delay) {
	const requestAnimeFrame = (function () {
		return (
			window.requestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			}
		);
	})();
	let start = new Date().getTime();
	let handle = {};
	function loop() {
		handle.value = requestAnimeFrame(loop);
		const current = new Date().getTime(),
			delta = current - start;
		if (delta >= delay) {
			fn.call();
			start = new Date().getTime();
		}
	}
	handle.timeStamp = requestAnimeFrame(loop);
	return handle;
};

export const cancelInterval = function (timeStamp) {
	window.cancelAnimationFrame(timeStamp);
};