import { omit, max } from "lodash";

export const mapRestArrayByArray = function (patch, maxBy) {
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

	const merge = (longest, rest) => {
		if (
			Object.assign([], longest).every((element) => {
				return element instanceof Object;
			}) &&
			rest instanceof Object
		) {
			const resultList = [];
			const restKeys = Object.keys(rest);

			longest.forEach((res) => {
				let merged = {};
				for (let key of restKeys) {
					const restAryElem = rest[key];
					if (restAryElem instanceof Array && restAryElem.length) {
						for (let o of restAryElem) {
							if (res[maxBy] === o[maxBy]) {
								merged = {
									...res,
									...omit(o, [maxBy]),
								};
							}
						}
					}
				}
				resultList.push(merged);
			});

			return resultList;
		}

		return null;
	};

	const serialised = JSON.parse(JSON.stringify(patch));

	if (serialised instanceof Object) {
		/* {
            key_1:[...],
            key_2:[...],
            ...
           } */
		let keys = Object.keys(serialised);
		if (keys.length) {
			keys.forEach((key) => {
				serialised[key] instanceof Array && getLen(serialised[key], key);
			});
			const o = countMaxLen();
			if (o && o.index) {
				const longestAry = serialised[o.index];
				const copy = omit(serialised, [o.index]);
				return merge(longestAry, copy);
			}
		}
	}
	return null;
};
