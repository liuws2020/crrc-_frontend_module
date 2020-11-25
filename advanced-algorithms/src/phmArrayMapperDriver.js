import React from "react";
import {
	mapRestArrayByLongestArray, // 以最长素组为标准进行映射
	mergeArrayByKey, // 根据某一键值进行映射
} from "./algorithms/MapRestArrayByArray";
import $ from "jquery";

class Main extends React.Component {
	componentDidMount() {
		$.get("./data.txt").done((data) => {
			let parsed = JSON.parse(data);
			parsed.PhaseWCurrentList = [
				...parsed.PhaseWCurrentList,
				...parsed.PhaseWCurrentList.map((elem) => {
					return { date: elem.date, more: "test" };
				}),
			];
			// console.log(parsed)
			const result = mergeArrayByKey(parsed, "date");
			console.log(result);
		});
	}

	render() {
		return <div>请打开控制台</div>;
	}
}

export default Main;
