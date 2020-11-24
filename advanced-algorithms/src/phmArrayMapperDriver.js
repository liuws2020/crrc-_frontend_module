import React from "react";
import { mapRestArrayByArray } from "./algorithms/MapRestArrayByArray";
import $ from "jquery";

class Main extends React.Component {
	componentDidMount() {
		$.get("./data.txt").done((data) => {
			const result = mapRestArrayByArray(JSON.parse(data), "key");
			console.log(result);
		})
	}

	render() {
		return <div>请打开控制台</div>;
	}
}

export default Main;
