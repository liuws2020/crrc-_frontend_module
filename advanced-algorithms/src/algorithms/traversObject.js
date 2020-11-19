export const traversObject = function (obj, cb, depth, count) {
	if ((depth && +count < +depth) || !depth) {
		if (obj instanceof Object) {
			Object.keys(obj).forEach((key) => {
				const childObj = obj[key];
				cb.call(null, childObj, key, depth);
				if (childObj instanceof Object) {
					depth
						? traversObject(childObj, cb, depth, count++)
						: traversObject(childObj, cb);
				}
			});
		}
	}
};