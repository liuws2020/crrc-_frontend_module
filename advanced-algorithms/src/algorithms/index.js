import _ from "lodash";
const _orderPrefix = "orderPrefix";

export const sortByObjAttr = function (ary, key, isDesc, depth) {
	if (!ary instanceof Array || !key) return null;
	if (!ary.length) return [];

	const orderby = `${key}`;
	let sorted = [...ary];
	const _extractKeyValueOutside = function (oOrVal) {
		const index = arguments[1];
		const orderKey = arguments[2];
        console.log(arguments)
		if (!oOrVal instanceof Object && orderKey === orderby) {
			sorted[index][`${_orderPrefix}_${orderby}`] = oOrVal;
		}
	};

	if (!depth || (!isNaN(depth) && (depth === 1 || depth < 0))) {
		return _.orderBy(sorted, [key], [isDesc ? "desc" : "asc"]);
	}

	if (!isNaN(depth) && depth > 1) {
		for (let i = 0, len = ary.length; i < len; i++) {
			TraversObject(
				ary[i],
				function (child) {
					_extractKeyValueOutside(child, i);
				},
				depth,
				0
			);
		}
    }
    
    return _.orderBy(sorted, [`${_orderPrefix}_${orderby}`], [isDesc ? "desc" : "asc"]);
};

export const TraversObject = function (obj, cb, depth, count) {
	if (count < depth || !depth) {
		if (obj instanceof Object) {
			Object.keys(obj).forEach((key) => {
				const childObj = obj[key];
				cb.call(null, childObj, key);
				if (childObj instanceof Object) {
					depth
						? TraversObject(childObj, cb, depth, count++)
						: TraversObject(childObj, cb);
				}
			});
		}
	}
};
