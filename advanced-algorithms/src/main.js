import React from "react";
import { sortByObjAttr } from "./algorithms";
class Main extends React.Component {
	constructor() {
		super();
		const data = [
			{
				first: {
					second: 1,
					third:{
						name: 100
					}
				},
			},
			{
				first: {
					second: 2,
					third:{
						name: 200
					}
				},
			},
			{
				first: {
					second: 3,
					third:{
						name: 300
					}
				},
			},
			{
				first: {
					second: 4,
					third:{
						name: 400
					}
				},
			},
			{
				first: {
					second: 5,
					third:{
						name: 500
					}
				},
			},
		];

		// 功能： 根据对象数组的某一键值来排序这个数组
		// arg 1: 待排列数组 
		// arg 2：根据哪一个键值来排序
		// arg 3：是否降序
		// arg 4：当前键值深度（可选，可缩小查找范围提高性能，可以减少同名变量造成的问题）
		const sorted_1 = sortByObjAttr(data, "name", true, 3);
		console.log("提供深度", sorted_1);

		const sorted_2 = sortByObjAttr(data, "second", true);
		console.log("不提供深度", sorted_2);
	}

	render() {
		return <div>请打开控制台</div>;
	}
}

export default Main;
