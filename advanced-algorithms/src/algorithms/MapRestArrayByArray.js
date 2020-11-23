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
					for (let o of restAryElem) {
						if (res[maxBy] === o[maxBy]) {
							merged = {
								...res,
								...omit(o, [maxBy]),
							};
						}
					}
				}
				resultList.push(merged);
			});

			return resultList;
		}

		return null;
	};

	if (patch instanceof Object) {
		/* {
            key_1:[...],
            key_2:[...],
            ...
           } */
		const keys = Object.keys(patch);
		if (keys.length) {
			keys.forEach((key) => {
				patch[key] instanceof Array && getLen(patch[key], key);
			});
			const { index } = countMaxLen();
			const longestAry = patch[index];
			const copy = omit(patch, [index]);
			return merge(longestAry, copy);
		}
	}
};
