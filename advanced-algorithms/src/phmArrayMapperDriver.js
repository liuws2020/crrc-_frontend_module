import React from "react";
import {
	// mapRestArrayByLongestArray, // 以最长素组为标准进行映射
	mergeArrayByKey, // 根据某一键值进行映射
	fillAryWithMemo,
	/* fillAryWithDefault */
} from "./algorithms/MapRestArrayByArray";
import $ from "jquery";

class Main extends React.Component {
	componentDidMount() {
		$.get("./data.txt").done((data) => {
			let parsed = JSON.parse(data);
			parsed.PhaseWCurrentList = [
				...parsed.PhaseWCurrentList,
				...parsed.PhaseWCurrentList.map((elem) => {
					return { date: elem.date };
				}),
			];
			const result = mergeArrayByKey(parsed, "date");
			console.log(
				fillAryWithMemo(
					[
						"date",
						"Channel2",
						"Channel3",
						"Channel4",
						"Channel31",
						"Channel5",
						"Channel6",
						"Channel11",
						"Channel12",
						"Channel17",
						"Channel18",
						"Channel19",
						"Channel20",
						"Channel40",
						"Channel41",
						"Channel42",
						"Channel43",
						"Channel44",
					],
					result,
					["date"]
				)
			);
		});
	}

	render() {
		return <div>请打开控制台</div>;
	}
}

export default Main;
