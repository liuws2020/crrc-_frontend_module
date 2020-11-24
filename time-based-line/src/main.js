import React from "react";
import TimeSequenceLine, {
	requestInterval,
	cancelInterval,
	// clearScreen
} from "./timeFlowSequenceComponent/d3SequenceDataFlow";
class Driver extends React.Component {
	state = {
		width: window.innerWidth,
		height: window.innerHeight / 2,
		data: [],
		configPairs: {
			tweets: {
				color: "#5eaec5",
				text: "发推数",
				lineType: "default",
				style: { fontSize: "1em" },
			}, // 曲线图
			retweets: {
				color: "#92c463",
				text: "重发数",
				lineType: "step",
				style: { fontSize: "100%" },
			}, // 直方图
			favourites: {
				color: "#fe9a22",
				text: "喜欢数",
				lineType: "curve",
				style: { fontSize: "80%" },
			}, // 默认折线图
			disableColor: "green",
			labelCircleR: 5,
			labelBaseHeight: 20, // label基础高度
		},
	};

	loopID = null;

	randomDataIniter = () => {
		const data = [];
		for (let i = 0; i < 10; i++) {
			data.push({
				date: new Date() - Math.random() * 1000,
				tweets: Math.random() * 10,
				retweets: Math.random() * 20,
				favourites: Math.random() * 50,
			});
		}
		this.setState(() => {
			return { data };
		});
	};

	randomDataGenerator = () => {
		this.setState((preState) => {
			const d = preState.data;
			d.shift();
			d.push({
				date: new Date() - Math.random() * 1000,
				tweets: Math.random() * 5,
				retweets: Math.random() * 20,
				favourites: Math.random() * 50,
			});
			return { data: [...d] };
		});
	};

	simulate = () => {
		this.randomDataIniter();
		this.loopID = requestInterval(this.randomDataGenerator, 3500);
	};

	componentDidMount() {
		this.simulate();
		/* setTimeout(() => {
			// 使用清屏效果，必须提供必要的键值, chart的唯一标识, 消散持续时间（非必须）
			// clearScreen(["tweets", "retweets", "favourites"], "demo", 1000)
			this.setState({
				configPairs: {
					tweets: {
						color: "#5eaec5",
						text: "发推数----",
						lineType: "default",
						style: { fontSize: "1em" },
					}, // 曲线图
					retweets: {
						color: "#92c463",
						text: "重发数",
						lineType: "step",
						style: { fontSize: "100%" },
					}, // 直方图
					favourites: {
						color: "#fe9a22",
						text: "喜欢数",
						lineType: "curve",
						style: { fontSize: "80%" },
					}, // 默认折线图
					disableColor: "green",
					labelCircleR: 5,
					labelBaseHeight: 20, // label基础高度
				},
			});
		}, 7000); */
	}

	componentWillUnmount() {
		if (this.loopID) {
			cancelInterval(this.loopID.timeStamp);
		}
	}

	render() {
		const { data, width, height } = this.state;
		// 必须先安装D3 5.16版本以上，jquery 3.51版本以上
		return (
			<TimeSequenceLine
				// 图表ID 需要清屏svg时候可用，非必须
				chartID={"demo"}
				// 绑定state的数据达到实时更新效果
				// 格式[{date:Date, key:value, ...}]
				// 时序数据每个数组元素必须含有date对象以及相应的date键
				data={data} // 必须
				// 可视化的宽度
				width={width} // 可选，默认100%
				// 可视化的高度
				height={height} // 必须
				// y轴显示数据的颜色，disableColor除外
				// disableColor是不想显示该数据时图标颜色
				configPairs={this.state.configPairs} // 必须
				displayOption={{
					line: { display: true, antiAliasing: 3, lineWidth: 2 }, // antiAliasing 0:不抗锯齿 1:性能优先 2:自动 3:品质优先
					scatter: { display: true, r: 2 },
				}}
				// 图表主题
				title={{
					text: "DEMO",
					align: "middle", // 居中，居左，居右
					stroke: "red", // 描边颜色
					fill: "orange", // 填充色
					deltaX: 10, // title横坐标位置增量
					deltaY: 5, // title纵坐标位置增量
					style: { fontSize: "120%", fontWeight: "bold" }, // 字体css
				}} // 可选
				// 动画持续时间，不想要动画传入0
				duration={3000} // 可选
				// 坐标轴颜色
				axisColor='red' // 可选
				// x轴刻度参考数
				// * xTicks={5} // 可选
				// y轴刻度参考数
				yTicks={8} // 可选
				// x轴文字旋转角度
				rotateX={30} // 可选
				// * rangeY={[0, 50]} // y轴的值固定范围
				// x轴文字旋转角度
				rotateY={15} // 可选
				// 日期格式
				dateStrFormatter={"%H:%M:%S.%L"} // 可选
				// 图表css
				style={{ marginTop: "15%" }} // 可选
				// 图表背景色
				backgroundColor={"aliceblue"} // 可选
				// 每个变量标题的字体填充色
				labelTextFill={"gray"} // 可选
				toolTips={{
					lineWidth: 1,
					color: "blue",
					fill: "aliceblue",
					stroke: "purple",
					strokeWidth: "2",
					fontSize: "smaller",
					fontFamily: "Arial",
					type: "dashed", // default:实线 dashed: 虚线
					timePrecision: "m s ms", // yy mm dd h m s ms
					predict: false,
					accuracy: {
						fix: 0, // 保留小数位数
						type: "round", // round:四舍五入 floor:保留最小数
					},
					style: {
						opacity: 0.5,
					},
				}}
				axis={{
					deltaXAxis: { x: 100, y: 10 }, // x 轴偏移量
					deltaYAxis: { x: 20, y: 60 }, // y 轴偏移量
					xFontStyle: { fontSize: "60%" }, // x 轴字体css
					yFontStyle: { fontWeight: "bold" }, // y 轴字体css
				}}
			/>
		);
	}
}

export default Driver;
