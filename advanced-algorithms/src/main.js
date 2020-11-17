import React from "react";
import { sortByObjAttr } from "./algorithms";
class Main extends React.Component {
	constructor() {
		super();
		const data = [
			{
				first: {
					second: 1,
				},
			},
			{
				first: {
					second: 2,
				},
			},
			{
				first: {
					second: 3,
				},
			},
			{
				first: {
					second: 4,
				},
			},
			{
				first: {
					second: 5,
				},
			},
		];

		const sorted = sortByObjAttr(data, "second", true, 2);
		console.log(sorted);
	}

	render() {
		return <div></div>;
	}
}

export default Main;
