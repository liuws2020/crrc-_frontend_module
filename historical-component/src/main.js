import React from "react";
import $ from "jquery";
import HistoricalComponent from "./historicalChart";

export default class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			title: {
				text: "雨量流量关系图",
				align: "right",
				textStyle: {
					fontFamily: "Times New Roman",
				},
				left: 150,
			},
			grid: {
				bottom: 80,
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					animation: false,
					label: {
						backgroundColor: "#505765",
					},
				},
			},
			legend: {
				data: ["流量", "降雨量"],
				left: 0,
			},
			dataZoom: [
				{
					show: true,
					realtime: true,
					start: 65,
					end: 85,
				},
				{
					type: "inside",
					realtime: true,
					start: 65,
					end: 85,
				},
			],
			xAxis: [
				{
					type: "category",
					boundaryGap: false,
					axisLine: { onZero: false },
					data: [],
				},
			],
			yAxis: {
				name: "m^3/s",
				type: "value",
				max: 500,
			},
			series: [
				/* {
					name: "流量",
					type: "line",
					lineStyle: {
						width: 1,
					},
					emphasis: {
						focus: "series",
					},
					data: [],
				},
				{
					name: "降雨量",
					type: "line",
					lineStyle: {
						width: 1,
					},
					emphasis: {
						focus: "series",
					},
					data: [],
				}, */
			],
			restOptions: {}, // echarts其他属性
			seriesDataUpdate: [], // Y轴的各个数据序列
			dates: [], // X轴时间字符串序列
		};
	}

	componentDidMount() {
		$.getJSON("./resources/data.json").done((data) => {
			const { dataX, dataY1, dataY2, dataY3 } = data;
			// 更新数据：Y轴数据需要提供name，以及对应的数据数组
			this.setState({
				title: {
					text: "历史数据",
					textStyle: {
						color: "#85FFFF",
						fontSize: "120%",
						fontWeight: "bold",
						fontFamily: "monospace",
					},
					left: "2%",
					top: "3%",
					align: "right",
				},
				grid: {
					// bottom: "20%",
					containLabel: true,
				},
				toolbox: {
					show: false,
					feature: {
						dataZoom: {
							yAxisIndex: "none",
						},
						restore: {},
						saveAsImage: {},
					},
					left: "70%",
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						animation: false,
						label: {
							backgroundColor: "#505765",
						},
					},
				},
				legend: {
					data: [
						"GHChannel1",
						"GHChannel2",
						"GHChannel3",
						"GHChannel4",
						"GHChannel5",
						"GHChannel6",
						"GHChannel8",
						"GHChannel9",
						"GHChannel10",
						"GHChannel11",
						"GHChannel12",
						"GHChannel13",
						"GHChannel14",
					],
					left: "12%",
					top: "3%",
					width: `${this.props.width * 1.5}px`,
					height: "200px",
					// itemHeight:'1000px',
					itemGap: 25,
					textStyle: {
						color: "#85FFFF",
						fontSize: "80%",
						fontWeight: "bold",
						fontFamily: "chinese_char_design",
					},
					inactiveColor: "white",
					icon: "circle",
				},
				dataZoom: [
					{
						show: true,
						realtime: true,
						start: 65,
						end: 85,
						handleIcon:
							"M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
						handleSize: "80%",
						handleStyle: {
							color: "white",
							shadowBlur: 3,
							shadowColor: "rgba(0, 0, 0, 0.6)",
							shadowOffsetX: 2,
							shadowOffsetY: 2,
						},
						textStyle: {
							color: "white",
						},
					},
					{
						type: "inside",
						realtime: true,
						start: 65,
						end: 85,
					},
				],
				xAxis: [
					{
						name: "时间",
						type: "category",
						boundaryGap: false,
						axisLabel: {
							color: "white",
						},
						axisLine: {
							onZero: false,
							lineStyle: {
								color: "white",
							},
						},
						data: [],
					},
				],
				yAxis: {
					name: "值",
					type: "value",
					//max: 120,
					axisLabel: {
						color: "white",
					},
					axisLine: {
						lineStyle: {
							color: "white",
						},
					},
					nameTextStyle: {
						color: "white",
					},
					splitLine: { show: false },
				},
				series: [
					{
						name: "GHChannel1",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel2",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel3",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel4",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel5",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel6",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel8",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel9",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel10",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel11",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel12",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel13",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
					{
						name: "GHChannel14",
						type: "line",
						areaStyle: {},
						lineStyle: {
							width: 1,
						},
						emphasis: {
							focus: "series",
						},
						data: [],
					},
				],
				restOptions: {}, // echarts其他属性
			});
			
		});
	}

	/*setTimeout(() => {
				this.setState({
					dates: dataX,
					seriesDataUpdate: [
						{
							name: "降雨量",
							type: "line",
							data: dataY2,
							rest: {
								areaStyle: {},
								emphasis: {
									focus: "series",
								},
							},
						},
						{
							name: "其他",
							type: "line",
							data: dataY3,
							rest: {
								areaStyle: {},
								emphasis: {
									focus: "series",
								},
							},
						},
					],
					legend: {
						data: ["降雨量", "其他"],
						textStyle: {
							fontFamily: "Microsoft YaHei",
						},
					},
					title: {
						textStyle: {
							fontFamily: "Microsoft YaHei",
						},
					},
				});
			}, 3000);*/

	onDatazoom = (args) => {
		console.log(args);
	};

	render() {
		const {
			title,
			grid,
			toolbox,
			tooltip,
			legend,
			dataZoom,
			xAxis,
			yAxis,
			series,
			restOptions,
			// 以上全是样式初始化，创建组件时可以初始化一次
			// 需要调整时可以后来单独传入，组件会更新

			// 以下是更新数据
			seriesDataUpdate, // Y轴所有更新数据
			dates, // X轴的时间
		} = this.state;
		return (
			<HistoricalComponent
				title={title}
				grid={grid}
				toolbox={toolbox}
				tooltip={tooltip}
				legend={legend}
				dataZoom={dataZoom}
				xAxis={xAxis}
				yAxis={yAxis}
				series={series}
				seriesDataUpdate={seriesDataUpdate}
				dates={dates}
				restOptions={restOptions}
				onDatazoom={this.onDatazoom}
				debounceDatazoomDuration={1000}
			/>
		);
	}
}
