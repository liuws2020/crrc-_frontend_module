import React from "react";
import { mapRestArrayByArray } from "./algorithms/MapRestArrayByArray";

class Main extends React.Component {
	constructor() {
		super();
		this.list = {
			key_1: [
				{ key: "a", value_1: 1 },
				{ key: "b", value_1: 2 },
				{ key: "c", value_1: 3 },
				{ key: "d", value_1: 4 },
				{ key: "e", value_1: 5 },
			],
			key_2: [
				{ key: "a", value_2: 10 },
				{ key: "b", value_2: 22 },
				{ key: "c", value_2: 46 },
			],
			key_3: [
				{ key: "d", value_3: 43 },
				{ key: "e", value_3: 12 },
			],
		};
	}

	componentDidMount() {
		mapRestArrayByArray(this.list, "key");
	}

	render() {
		return <div>请打开控制台</div>;
	}
}

export default Main;
