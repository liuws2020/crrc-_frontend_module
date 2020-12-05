import React from "react";
import Echarts from "echarts";

class HistoricalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.echartsContainerRef = React.createRef();
		this.historicalCharts = null;
	}

	componentDidMount() {
		this.historicalCharts = Echarts.init(this.echartsContainerRef.current);

		window.onresize = this.historicalCharts.resize;

		const option = this.initPropsToOption();
		option && this.historicalCharts.setOption(option);
	}

	componentDidUpdate(preProps) {
		const {
			seriesDataUpdate,
			dates,
			title,
			grid,
			toolbox,
			tooltip,
			legend,
			dataZoom,
		} = this.props;
		if (
			preProps.seriesDataUpdate !== seriesDataUpdate ||
			preProps.dates !== dates
		) {
            const TypeException = function() {
                this.name = "TypeException";
                this.message = "type error";
            }
			if (seriesDataUpdate instanceof Array && dates instanceof Array) {
				try {
					const series = seriesDataUpdate.map(({ name, type, data }) => {
                        if(!name || !(data instanceof Array)) {
                            throw new TypeException();
                        }
						return {
							name:`${name}`,
							type,
							data,
						};
					});
					this.historicalCharts.setOption({
						xAxis: [
							{
								data: dates,
							},
						],
						series,
					});
				} catch (error) {}
			}
		}

		if (preProps.title !== title && title instanceof Object) {
			this.historicalCharts.setOption({ title });
		}

		if (preProps.grid !== grid && grid instanceof Object) {
			this.historicalCharts.setOption({ grid });
		}

		if (preProps.toolbox !== toolbox && toolbox instanceof Object) {
			this.historicalCharts.setOption({ toolbox });
		}

		if (preProps.tooltip !== tooltip && tooltip instanceof Object) {
			this.historicalCharts.setOption({ tooltip });
		}

		if (preProps.legend !== legend && legend instanceof Object) {
			this.historicalCharts.setOption({ legend });
		}

		if (preProps.dataZoom !== dataZoom && dataZoom instanceof Object) {
			this.historicalCharts.setOption({ dataZoom });
		}
	}

	initPropsToOption = () => {
		try {
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
			} = this.props;
			let option = {
				title,
				grid,
				toolbox,
				tooltip,
				legend,
				xAxis,
				yAxis,
				dataZoom,
				series,
			};

			if(restOptions instanceof Object) {
				for(let attr in restOptions) {
					option[attr] = restOptions[attr];
				}
			}
			
			return option;
		} catch (error) {
			return null;
		}
	};

	render() {
		const { containerStyle } = this.props;
		return (
			<div
				style={{
					...containerStyle,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					overflow: "visible",
				}}>
				<div
					ref={this.echartsContainerRef}
					style={{ width: "inherit", height: "inherit" }}
				/>
			</div>
		);
	}
}

HistoricalComponent.defaultProps = {
	containerStyle: {
		width: "50%",
		height: "40vh",
		containerPadding: "5px",
		margin: "0 auto 0 auto",
	},
	seriesDataUpdate: [],
	dates: [],
	title: {
		text: "标题",
		subtext: "副标题",
		left: "center",
		align: "right",
	},
	grid: {
		bottom: 50,
	},
	toolbox: {
		feature: {
			dataZoom: {
				yAxisIndex: "none",
			},
			restore: {},
			saveAsImage: {},
		},
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
		data: ["S_1"],
		left: 10,
	},
	dataZoom: [
		{
			show: true,
			realtime: false,
			start: 0,
			end: 100,
		},
		{
			type: "inside",
			realtime: false,
			start: 0,
			end: 100,
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
		name: "Value",
		type: "value",
	},
	series: [
		{
			name: "S_1",
			type: "line",
			lineStyle: {
				width: 1,
			},
			emphasis: {
				focus: "series",
			},
			data: [],
		},
	],
	restOptions: {},
};

export default HistoricalComponent