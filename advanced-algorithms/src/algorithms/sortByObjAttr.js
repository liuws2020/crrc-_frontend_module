import _ from "lodash";
import { traversObject } from "./traversObject";
const _orderPrefix = "orderPrefix";
var index;

export const sortByObjAttr = function (ary, key, isDesc, depth) {
	if (!ary instanceof Array || !key) return null;
	if (!ary.length) return [];
	if (ary.length === 1) return [...ary];

	index = 0;
	const orderby = `${key}`;
	let sorted = [...ary];
	const _extractKeyValueOutside = function (oOrVal) {
		const orderKey = arguments[1];
		const currDepth = arguments[2];

		if (!(oOrVal instanceof Object) && orderKey === orderby) {
			if (!currDepth || (currDepth && currDepth === depth)) {
				sorted[index][`${_orderPrefix}_${orderby}`] = oOrVal;
			}
		}
	};

	if (parseInt(depth) === 1 || parseInt(depth) < 0) {
		return _.orderBy(sorted, [key], [isDesc ? "desc" : "asc"]);
	}

	if (!isNaN(depth) && depth > 1) {
		for (let i = 0, len = ary.length; i < len; i++) {
			traversObject(ary[i], _extractKeyValueOutside, depth, 0);
			index++;
		}
	}

	if (!depth) {
		for (let i = 0, len = ary.length; i < len; i++) {
			traversObject(ary[i], _extractKeyValueOutside);
			index++;
		}
	}

	let resultList = _.orderBy(
		sorted,
		[`${_orderPrefix}_${orderby}`],
		[isDesc ? "desc" : "asc"]
	);

	for (let result of resultList) {
		for (let name in result) {
			if (name.split("_")[0] === _orderPrefix) {
				delete result[name];
			}
		}
	}

	return resultList;
};
