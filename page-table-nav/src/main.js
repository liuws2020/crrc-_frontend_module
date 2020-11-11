import React from "react";
import TablePageNav from "./table_page_nav/pageNav";

class Main extends React.Component {
	processData = () => {
		const fakeData = [];
		for (let i = 0; i < 32; i++) {
			fakeData.push({
				mfCode: { text: i, type: "text", align: "center" }, // 每个单元格对应数据， text表示显示的文本, align: right, left, center(文字位置)
				dateTime: {
					text: new Date().toLocaleDateString(),
					type: "text",
					align: "center",
				},
				level: { text: i, type: "text", align: "center" },
				mfName: { text: "二车一类故障", type: "text", align: "center" },
				moreInfo: {
					//如果一个单元格需要被渲染成按钮时，需要把它的值类型设定成"button"
					type: "button",
					align: "center",
					style: {}, // button的css样式
					cb: this.buttonCallback, // button的点击事件回调函数
					stopEventBubble: true, // 是否停止事件传播
					text: "click", // 按钮显示文字
					basic: true, // 是否仅保留边框
					inverted: true, // 是否反白
					color: "teal", // red orange yellow olive green teal blue violet purple pink brown grey black
					size: "small", //mini tiny small medium large big huge massive
					compact: true, // 是否占据最小空间
				},
			});
		}

		return fakeData;
	};

	buttonCallback = (element) => {
		// 点击后，会返回当前行所有数据
		console.log(element);
	};

	inputCallback = (input) => {
		// 点击后，会返回当前输入值
		console.log(input);
	};

	onNextPage = (pageNo) => {
		console.log(pageNo);
	};

	onPreviousPage = (pageNo) => {
		console.log(pageNo);
	};

	render() {
		return (
			<div>
				<TablePageNav
					dataList={this.processData()} // 数据：[{},{},{}...]
					rowsPerPage={6} // 每页的行数
					height={window.innerHeight} // 组件高度
					titles={[
						{ text: "故障代码", align: "center" },
						{ text: "时间", align: "center" },
						{ text: "等级", align: "center" },
						{ text: "故障名称", align: "center" },
						{ text: "故障详情", align: "center" },
					]}
					animationDuration={0.5} // 过渡动画持续时间
					controlAttr={{
						containerCss: { opacity: 0.8 }, // 控制组件容器css
						styleBtn: {}, // 控制按钮css属性
						styleInput: {}, // 控制输入栏css属性
						buttonAttr: {
							basic: true, // 是否仅保留边框
							inverted: true, // 是否反白
							color: "teal", // red orange yellow olive green teal blue violet purple pink brown grey black
							size: "small", //mini tiny small medium large big huge massive
							compact: true, // 是否最节省空间
						},
						// 控制按钮快捷属性
						inputCb: this.inputCallback, // 输入回调
						backCb: this.onPreviousPage, // 前进回调
						nextCb: this.onNextPage, // 后退回调
					}}
					// 控制翻页组件属性
					tableStyle={{ headerStyle: {}, bodyStyle: {}, opacity: 0.8 }} // 表格样式： headerStyle表头样式， bodyStyle表格body样式，剩余属性为自身css样式
					tableColor={"blue"} // 表格固定颜色：red orange yellow olive green teal blue violet purple pink brown grey black
					striped // 是否采用斑马型表格
				/>
			</div>
		);
	}
}

export default Main;
