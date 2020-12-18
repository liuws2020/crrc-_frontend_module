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
				dates: dataX,
				seriesDataUpdate: [
					{
						name: "流量",
						type: "line",
						data: dataY1,
						rest: {
							areaStyle: {},
							emphasis: {
								focus: "series",
							},
						},
					},
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
				],
				legend: {
					data: ["流量"],
					textStyle: {
						fontFamily: "Times New Roman",
					},
				},
				title: {
					textStyle: {
						fontFamily: "Times New Roman",
					},
				},
			});
			setTimeout(() => {
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
					/* title: {
						textStyle: {
							fontFamily: "Microsoft YaHei",
						},
					}, */
				});
			}, 3000);
		});
	}

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
			/>
		);
	}
}
