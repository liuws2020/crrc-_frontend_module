import { omit, max, clone, merge } from "lodash";

export const mapRestArrayByLongestArray = function (patch, maxBy) {
	const lengthAry = [];

	const getLen = (aryNode, i) => {
		if (aryNode instanceof Array) {
			lengthAry.push({ len: aryNode.length, index: i });
		}
	};

	const countMaxLen = () => {
		const maxlen = max(
			lengthAry.map(({ len }) => {
				return len;
			})
		);

		return lengthAry.find(({ len }) => {
			return len === maxlen;
		});
	};

	const mergeObj = (longest, rest) => {
		if (
			Object.assign([], longest).every((element) => {
				return element instanceof Object;
			}) &&
			rest instanceof Object
		) {
			let resultList = [];
			let hasMerged = false;
			const restKeys = Object.keys(rest);

			longest.forEach((res) => {
				let merged = {};
				for (let key of restKeys) {
					const restAryElem = rest[key];
					if (restAryElem instanceof Array && restAryElem.length) {
						for (let o of restAryElem) {
							merged = { ...res };
							if (res[maxBy] === o[maxBy]) {
								if (!hasMerged) {
									hasMerged = true;
								}
								merged = {
									...merged,
									...omit(o, [maxBy]),
								};
							}
						}
					}
				}

				if (Object.keys(merged).length) {
					resultList.push(merged);
				}
			});

			return resultList;
		}

		return null;
	};

	if (patch instanceof Object) {
		let keys = Object.keys(patch);
		if (keys.length) {
			keys.forEach((key) => {
				patch[key] instanceof Array && getLen(patch[key], key);
			});
			const o = countMaxLen();
			if (o && o.index) {
				const longestAry = patch[o.index];
				const copy = omit(patch, [o.index]);
				return mergeObj(longestAry, copy);
			}
		}
	}
	return null;
};

export const mergeArrayByKey = function (patch, mapBy) {
	const mergeBy = function (keys, patch, mapBy) {
		let ary = [];

		for (let key of keys) {
			const aryElem = patch[key];
			if (aryElem instanceof Array && aryElem.length) {
				for (let o of aryElem) {
					ary.push(o);
				}
			}
		}

		if (ary.length) {
			let looper = clone(ary);
			let generator = clone(ary);
			let mergedObjs = [];

			looper.forEach((c) => {
				const filtered = generator.filter((ch) => {
					return c[mapBy] === ch[mapBy];
				});

				if (filtered.length > 1) {
					let o = {};
					filtered.forEach((f) => {
						o = { ...merge(o, f) };
					});

					mergedObjs.push(o);
				} else {
					filtered.length && mergedObjs.push(filtered[0]);
				}
			});

			return mergedObjs;
		}
	};

	if (patch instanceof Object) {
		let keys = Object.keys(patch);
		if (keys.length) {
			return mergeBy(keys, patch, mapBy);
		}
	}
	return null;
};
