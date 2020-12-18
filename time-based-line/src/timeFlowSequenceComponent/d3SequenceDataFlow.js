import React from "react";
import * as D3 from "d3";
import $ from "jquery";
import { minBy, defer } from "lodash";

const requestIdleCallback =
	"requestIdleCallback" in window ? window.requestIdleCallback : undefined;

class SequenceLine extends React.Component {
	svg = null;
	crosshairFocus = null;

	constructor(props) {
		super(props);
		const length = +props.maxDatalength;
		this.maxDatalength = !isNaN(length) ? length : 10000;
	}

	componentDidMount() {
		this.svg = D3.select(this.svgContextRef.current);
		this.constructTools();
		const { data, configPairs } = this.props;
		this.setLabelInitState(configPairs);
		if (data instanceof Array && data.length) {
			this.filtered = data.slice(0, this.maxDatalength);
			const { x_scale, y_scale, x_domain, y_domain } = this.getScales(data);
			const keys = this.getKeys(data[0]);
			this.shaps(data, x_scale, y_scale, keys, x_domain, y_domain);
		}
	}

	setLabelInitState = (configPairs) => {
		if (!(configPairs instanceof Object)) return;
		let filter;
		for (let key in configPairs) {
			const o = configPairs[key];
			if (o instanceof Object) {
				if (o.disableOnMount) {
					filter = {};
					filter[key] = true;
				}
			}
		}

		if (filter) {
			this.setState({ filter });
			for (let f in filter) {
				this.displayLines[f] = false;
			}
		}
	};

	cleanTootips = () => {
		this.svgDOM = null;
		const { chartID, configPairs } = this.props;

		this.removeLabel(configPairs, chartID);
		this.removeTitle(chartID);
		this.svg.select(`.${chartID}_cross_group`).remove();

		this.xAxisDOM = null;
		this.yAxisDOM = null;
		this.svg.select(`#${chartID}_xAxisG`).remove();
		this.svg.select(`#${chartID}_yAxisG`).remove();
	};

	constructTitle = (title, chartID, width, height) => {
		const deltaX = !isNaN(parseInt(title.deltaX)) ? +title.deltaX : 0;
		const deltaY = !isNaN(parseInt(title.deltaY)) ? +title.deltaY : 0;
		const legendTitle = this.svg
			.append("text")
			.attr("class", `${chartID}_title_text`)
			.attr("x", width * 0.05 + deltaX)
			.attr("y", height * 0.1 + deltaY)
			.attr("stroke", title ? title.stroke : "black")
			.attr("fill", title ? title.fill : "black")
			.text(title ? title.text : "")
			.attr("alignment-baseline", title ? title.align : "middle");
		$(legendTitle._groups[0][0]).css(title.style);
	};

	removeTitle = (chartID) => {
		this.svg.select(`.${chartID}_title_text`).remove();
	};

	constructTools = (data) => {
		const { width, height, title, toolTips, chartID, configPairs } = this.props;
		this.svgDOM = this.svg._groups[0][0];
		this.svgDOM.addEventListener("mouseover", this.onShapHover);
		this.svgDOM.addEventListener("mouseleave", this.mouseLeaveShape);

		if (width && height) {
			title instanceof Object &&
				this.constructTitle(title, chartID, width, height);
			this.crosshairFocus = this.svg
				.append("g")
				.attr("class", `${chartID}_cross_group`)
				.style("display", "none");
			this.lineX = this.crosshairFocus
				.append("line")
				.attr("class", `${chartID}_x`)
				.attr("y1", 0)
				.attr("y2", height);
			this.lineY = this.crosshairFocus
				.append("line")
				.attr("class", `${chartID}_y`)
				.attr("x1", width)
				.attr("x2", width);

			if (toolTips && toolTips.type === "dashed") {
				this.lineX.attr("stroke-dasharray", "3,3");
				this.lineY.attr("stroke-dasharray", "3,3");
			}

			this.textX = this.crosshairFocus
				.append("text")
				.attr("class", `${chartID}_text_x`)
				.attr("fill", toolTips && toolTips.fill ? toolTips.fill : "black")
				.attr("stroke", toolTips && toolTips.stroke ? toolTips.stroke : "black")
				.attr(
					"font-size",
					toolTips && toolTips.fontSize ? toolTips.fontSize : "1em"
				)
				.attr(
					"font-family",
					toolTips && toolTips.fontFamily ? toolTips.fontFamily : "sans-serif"
				)
				.attr(
					"stroke-width",
					toolTips && toolTips.strokeWidth ? toolTips.strokeWidth : 1
				);

			this.textY = this.crosshairFocus
				.append("text")
				.attr("class", `${chartID}_text_y`)
				.attr("fill", toolTips && toolTips.fill ? toolTips.fill : "black")
				.attr("stroke", toolTips && toolTips.stroke ? toolTips.stroke : "black")
				.attr(
					"font-size",
					toolTips && toolTips.fontSize ? toolTips.fontSize : "1em"
				)
				.attr(
					"font-family",
					toolTips && toolTips.fontFamily ? toolTips.fontFamily : "sans-serif"
				)
				.attr(
					"stroke-width",
					toolTips && toolTips.strokeWidth ? toolTips.strokeWidth : 1
				);
			if (toolTips && toolTips.style) {
				$(this.textX._groups[0][0]).css({ ...toolTips.style });
				$(this.textY._groups[0][0]).css({ ...toolTips.style });
			}

			if (toolTips && toolTips.timePrecision && toolTips.timePrecision.split) {
				this.timePrecision = toolTips.timePrecision.split(" ");
			}

			const labelBaseHeight = !isNaN(parseInt(configPairs.labelBaseHeight))
				? +configPairs.labelBaseHeight
				: 0;
			this.appendLabel(width, height + labelBaseHeight);

			this.point = this.svgDOM.createSVGPoint();

			if (data instanceof Array && data.length) {
				const { x_scale, y_scale, x_domain, y_domain } = this.getScales(data);
				this.xAxis(x_scale, width, height);
				this.yAxis(y_scale, width, height);
				const keys = this.getKeys(data[0]);
				this.shaps(data, x_scale, y_scale, keys, x_domain, y_domain);
			}
		}
	};

	getScales = (data) => {
		const x_extent = D3.extent(data, ({ date }) => date);
		const x_domain = D3.scaleTime().domain(x_extent);
		const x_scale = x_domain.range([0, this.props.width]);
		const vals = [];
		data.forEach((d) => {
			for (let key in d) {
				if (key !== "date") {
					vals.push(d[key]);
				}
			}
		});

		let y_extent;

		this.props.rangeY
			? (y_extent = this.props.rangeY)
			: (y_extent = D3.extent(vals));

		const y_domain = D3.scaleLinear().domain(y_extent);
		const y_scale = y_domain.range([this.props.height * 0.6, 0]);
		return {
			x_domain,
			y_domain,
			x_scale,
			y_scale,
		};
	};

	state = {
		filter: {},
		coordinate: null,
		currValPair: {
			key: "",
			date: "",
			value: null,
		},
	};

	dataAreEqual = (preData, data) => {
		return data.every((d, i) => {
			if (!preData && data) return false;
			return JSON.stringify(d) === preData[i];
		});
	};

	updateData = (renderInfo) => {
		const { data, width, height } = renderInfo;
		const { x_scale, y_scale, x_domain, y_domain } = this.getScales(data);
		this.xAxis(x_scale, width, height);
		this.yAxis(y_scale, width, height);
		const keys = this.getKeys(data[0]);
		this.shaps(data, x_scale, y_scale, keys, x_domain, y_domain);
	};

	filterData = (filternames, data) => {
		return data.map((datum) => {
			let d = { ...datum };
			for (let name of filternames) {
				delete d[name];
			}
			return d;
		});
	};

	sliceData = (data, filternames, rangeY) => {
		return filternames.length && !rangeY
			? this.filterData(filternames, data).slice(0, this.maxDatalength)
			: Object.assign([], data.slice(0, this.maxDatalength));
	};

	filtered;
	dataFirstCome;
	componentDidUpdate(preProps, preState) {
		const { width, height, data, rangeY, processTimeRemaining } = this.props;
		const { filter } = this.state;

		if (!this.dataFirstCome && data instanceof Array && data.length) {
			this.filtered = data;
			this.dataFirstCome = true;
		}

		if (
			data instanceof Array &&
			!this.dataAreEqual(preProps.data, data) &&
			data.length
		) {
			const timeRemaining = !isNaN(processTimeRemaining)
				? +processTimeRemaining
				: 1;
			const filternames = Object.keys(filter);
			if (requestIdleCallback) {
				requestIdleCallback((deadline) => {
					if (deadline.timeRemaining() >= timeRemaining) {
						this.filtered = this.sliceData(data, filternames, rangeY);
						this.updateData({
							data: this.filtered,
							width,
							height,
						});
					}
				});
			} else {
				this.filtered = this.sliceData(data, filternames, rangeY);
				this.updateData({ data: this.filtered, width, height });
			}
		}

		if (this.state.filter !== preState.filter && this.props.configPairs) {
			const configPairs = this.props.configPairs;
			const disableColor =
				configPairs && configPairs.disableColor
					? configPairs.disableColor
					: "gray";
			this.labelDOMs.forEach(({ labelDOM, labelActiveColor }) => {
				const $labelDOM = $(labelDOM);
				const labelKey = $labelDOM.attr("class").split("_")[0];
				this.getKeys(this.state.filter).indexOf(labelKey) !== -1
					? $labelDOM.attr("fill", disableColor)
					: $labelDOM.attr("fill", labelActiveColor);
			});
		}

		if (preProps.width !== width || preProps.height !== height) {
			if (width && height) {
				this.cleanTootips();
				this.constructTools(this.filtered);
			}
		}

		const { date, value, key } = this.state.currValPair;
		const { coordinate } = this.state;
		if (
			date &&
			value &&
			key &&
			coordinate !== preState.coordinate &&
			coordinate &&
			this.props.toolTips
		) {
			const { toolTips, height, width, configPairs, axis } = this.props;
			const { currValPair, coordinate } = this.state;
			if (!this.isHover) {
				this.crosshairFocus.style("display", "none");
			}
			if (!height || !width) return;
			this.crosshairFocus.style("display", null);
			const color = toolTips.color ? toolTips.color : "black";

			const stokeWidth = toolTips.lineWidth ? toolTips.lineWidth : 1;

			const deltaY =
				axis && axis.deltaXAxis && !isNaN(+axis.deltaXAxis.y)
					? axis.deltaXAxis.y
					: 0;

			this.lineX
				.attr("y1", height * 0.15)
				.attr("y2", height - coordinate.y + deltaY)
				.attr("stroke", color)
				.attr("stroke-width", stokeWidth)
				.attr(
					"transform",
					`translate(${coordinate.x}, ${
						coordinate.y - this.props.height * 0.15
					})`
				);

			const deltaX =
				axis && axis.deltaYAxis && !isNaN(+axis.deltaYAxis.x)
					? +axis.deltaYAxis.x
					: 0;

			this.lineY
				.attr("x1", width + deltaX)
				.attr("x2", 2 * width - width * 0.05)
				.attr("stroke", color)
				.attr("stroke-width", stokeWidth)
				.attr(
					"transform",
					`translate(${-1 * width + width * 0.05}, ${coordinate.y})`
				);

			this.textX
				.attr(
					"transform",
					`translate(${coordinate.x + width * 0.025}, ${coordinate.y * 0.95})`
				)
				.attr("stroke", color)
				.attr("stroke-width", stokeWidth)
				.text("时间: " + currValPair.date);

			let textHeight = this.measureClientBounds(
				this.textX._groups[0][0],
				"top",
				"bottom"
			);

			this.textY
				.attr(
					"transform",
					`translate(${coordinate.x + width * 0.025}, ${
						coordinate.y - textHeight
					})`
				)
				.attr("stroke", color)
				.attr("stroke-width", stokeWidth)
				.text(
					`${
						key && configPairs && configPairs[key] ? configPairs[key].text : ""
					}: ${currValPair.value ? +currValPair.value.toFixed(2) : 0}`
				);
		}

		const { title, chartID, configPairs } = this.props;
		if (
			JSON.stringify(title) !== JSON.stringify(preProps.title) &&
			title instanceof Object
		) {
			this.removeTitle(chartID);
			this.constructTitle(title, chartID, width, height);
		}

		if (
			JSON.stringify(configPairs) !== JSON.stringify(preProps.configPairs) &&
			configPairs instanceof Object
		) {
			this.removeLabel(configPairs, chartID);
			const labelBaseHeight = isNaN(parseInt(configPairs.labelBaseHeight))
				? +configPairs.labelBaseHeight
				: 0;

			this.appendLabel(width, height + labelBaseHeight);
			if (data instanceof Array && data.length) {
				const { x_scale, y_scale, x_domain, y_domain } = this.getScales(
					this.filtered
				);
				const keys = this.getKeys(this.filtered[0]);
				this.shaps(this.filtered, x_scale, y_scale, keys, x_domain, y_domain);
			}
		}
	}

	getKeys = (d) => {
		return Object.keys(d).filter((key) => key !== "date");
	};

	measureClientBounds = (DOM, edge_1, edge_2) => {
		const range = document.createRange();
		range.selectNodeContents(DOM);
		let gap = 0;
		if (range.getBoundingClientRect) {
			var rect = range.getBoundingClientRect();
			if (rect) {
				gap = rect[edge_1] - rect[edge_2];
			}
		}
		return gap;
	};

	xAxisDOM = null;
	yAxisDOM = null;
	labelDOMs = [];

	xAxis = (x_scale, width, height) => {
		const {
			duration,
			axisColor,
			xTicks,
			dateStrFormatter,
			rotateX,
			chartID,
			axis,
		} = this.props;
		if (!width || !height) return;
		const x_axis = D3.axisBottom().scale(x_scale);

		if (xTicks && !isNaN(xTicks)) x_axis.ticks(xTicks);
		let transAxisX = 0;
		let transAxisY = 0;
		if (axis && axis.deltaXAxis) {
			transAxisX = axis.deltaXAxis.x ? +axis.deltaXAxis.x : 0;
			transAxisY = axis.deltaXAxis.y ? +axis.deltaXAxis.y : 0;
		}

		dateStrFormatter && x_axis.tickFormat(D3.timeFormat(dateStrFormatter));
		if (!this.xAxisDOM) {
			const g = this.svg
				.append("g")
				.attr("id", `${chartID}_xAxisG`)
				.attr(
					"transform",
					`translate(${width * 0.05 + transAxisX}, ${
						height * 0.85 + transAxisY
					})`
				);

			axisColor && g.style("stroke", axisColor);
			axis &&
				axis.xFontStyle &&
				$(g._groups[0][0]).css(Object.assign({}, axis.xFontStyle));

			g.transition()
				.duration(duration ? duration : 0)
				.call(x_axis);

			axisColor && this.applyAxisColor(g, axisColor);

			rotateX && this.rotateText(g, rotateX, undefined);

			this.xAxisDOM = g;
		} else {
			const g = this.xAxisDOM;

			g.transition()
				.duration(duration ? duration : 0)
				.call(x_axis);
			axisColor && g.selectAll(`.tick line`).attr("stroke", axisColor);
			rotateX && this.rotateText(g, rotateX, undefined);
		}
	};

	removeLabel = (configPairs, chartID) => {
		let colorPairCopy = Object.assign({}, configPairs);
		configPairs.disableColor && delete colorPairCopy["disableColor"];
		configPairs.labelCircleR && delete colorPairCopy["labelCircleR"];
		configPairs.labelBaseHeight && delete colorPairCopy["labelBaseHeight"];
		for (let key in colorPairCopy) {
			this.svg.select(`.${key}_${chartID}_label`).remove();
			this.svg.select(`.${key}_${chartID}_text`).remove();
			this.svg.selectAll(`.${chartID}_${key}`).remove();
			this.svg.selectAll(`.${key}_${chartID}_circle`).remove();
		}
	};

	appendLabel = (width, height) => {
		const { labelTextFill, configPairs, chartID } = this.props;
		if (!configPairs) return;
		let colorPairCopy = { ...configPairs };
		configPairs.disableColor && delete colorPairCopy["disableColor"];

		const startWidth = width * 0.25;
		const gapOfLabelAndText = width * 0.015;
		let currWidth = startWidth;
		const r = configPairs.labelCircleR
			? configPairs.labelCircleR
			: height * 0.02;

		configPairs.labelCircleR && delete colorPairCopy["labelCircleR"];
		configPairs.labelBaseHeight && delete colorPairCopy["labelBaseHeight"];
		let heightTimes = 0.1;
		let preTextWidth = 0;
		for (let color in colorPairCopy) {
			if (currWidth >= width && heightTimes === 0.2) return;
			if (currWidth >= width - preTextWidth) {
				currWidth = startWidth;
				heightTimes = 0.2;
			}
			const label = this.svg
				.append("circle")
				.attr("cx", currWidth)
				.attr("cy", height * heightTimes)
				.attr("r", r)
				.attr("class", `${color}_${chartID}_label`)
				.style("cursor", "pointer")
				.attr(
					"fill",
					configPairs[color] && configPairs[color].color
						? configPairs[color].color
						: "black"
				);
			const labelDOM = label._groups[0][0];
			this.labelDOMs.push({
				labelDOM,
				labelActiveColor:
					configPairs[color] && configPairs[color].color
						? configPairs[color].color
						: "black",
			});
			$(labelDOM).on("click", () => {
				this.onLableClick(color, chartID);
			});
			const textContent =
				configPairs[color] && configPairs[color].text
					? configPairs[color].text
					: color;

			const text = this.svg
				.append("text")
				.attr("class", `${color}_${chartID}_text`)
				.attr("x", currWidth + gapOfLabelAndText)
				.attr("y", height * heightTimes)
				.attr("cursor", "default")
				.attr("fill", labelTextFill)
				.text(textContent ? textContent : "")
				.attr("alignment-baseline", "middle");

			if (
				configPairs[color].style &&
				configPairs[color].style instanceof Object
			) {
				$(text._groups[0][0]).css(configPairs[color].style);
			}

			let textWidth = this.measureClientBounds(
				text._groups[0][0],
				"right",
				"left"
			);

			currWidth += 2 * r + 2 * gapOfLabelAndText + textWidth;
			preTextWidth = textWidth;
		}
	};

	displayLines = {};

	onLableClick = (color, chartID) => {
		if (this.state.filter[color]) {
			this.setState(() => {
				let copy = { ...this.state.filter };
				delete copy[color];
				return { filter: copy };
			});
		} else {
			let copy = { ...this.state.filter };
			copy[color] = true;
			this.setState({ filter: copy });
		}

		const linePath = this.svg.select(`.${chartID}_${color}`)._groups[0][0];
		const circlePath = this.svg.selectAll(`.${color}_${chartID}_circle`);
		const circlePathDOM = circlePath ? circlePath._groups[0] : null;
		if (this.displayLines[color] || this.displayLines[color] === undefined) {
			linePath && $(linePath).fadeOut(200);
			circlePathDOM && $(circlePathDOM).fadeOut(200);
			setTimeout(() => {
				circlePath.remove();
			}, 200);
			this.displayLines[color] = false;
		} else {
			linePath && $(linePath).fadeIn(200);
			circlePath && $(circlePath).fadeIn(200);
			this.displayLines[color] = true;
		}
	};

	yAxis = (y_scale, width, height) => {
		const { duration, axisColor, yTicks, rotateY, chartID, axis } = this.props;
		if (!width || !height) return;

		const y_axis = D3.axisLeft().scale(y_scale);

		let transAxisX = 0;
		let transAxisY = 0;
		if (axis && axis.deltaYAxis) {
			transAxisX = axis.deltaYAxis.x ? +axis.deltaYAxis.x : 0;
			transAxisY = axis.deltaYAxis.y ? +axis.deltaYAxis.y : 0;
		}

		if (yTicks && !isNaN(yTicks)) y_axis.ticks(yTicks);

		if (!this.yAxisDOM) {
			const g = this.svg
				.append("g")
				.attr("id", `${chartID}_yAxisG`)
				.attr(
					"transform",
					`translate(${width * 0.05 + transAxisX}, ${
						height * 0.225 + transAxisY
					})`
				);

			axisColor && g.style("stroke", axisColor);
			axis &&
				axis.yFontStyle &&
				$(g._groups[0][0]).css(Object.assign({}, axis.yFontStyle));

			g.transition()
				.duration(duration ? duration : 0)
				.call(y_axis);

			axisColor && this.applyAxisColor(g, axisColor);

			rotateY && this.rotateText(g, rotateY, "y");

			this.yAxisDOM = g;
		} else {
			const g = this.yAxisDOM;
			g.transition()
				.duration(duration ? duration : 0)
				.call(y_axis);

			axisColor && g.selectAll(`.tick line`).attr("stroke", axisColor);
			rotateY && this.rotateText(g, rotateY, "y");
		}
	};

	rotateText = (context, degree, y) => {
		context
			.selectAll(`.tick text`)
			.attr("transform", `rotate(${degree})`)
			.style("text-anchor", y ? "end" : "start");
	};

	applyAxisColor = (context, color) => {
		context.selectAll(`.tick line`).attr("stroke", color);
		context.selectAll("path.domain").attr("stroke", color);
	};

	shaps = (data, xScale, yScale, keys, xDomain, yDomain) => {
		const {
			width,
			height,
			duration,
			configPairs,
			displayOption,
			chartID,
			axis,
		} = this.props;
		if (!width || !height || !keys || !displayOption || (keys && !keys.length))
			return;

		for (let key of keys) {
			if (!configPairs[key]) continue;
			if (Object.keys(this.state.filter).indexOf(key) === -1) {
				let model = D3.curveCardinal;

				switch (configPairs[key].lineType) {
					case "curve":
						model = D3.curveCardinal;
						break;
					case "step":
						model = D3.curveStep;
						break;
					default:
						model = null;
				}
				const basicCurve = D3.line()
					.x(({ date }) => xScale(date))
					.y((d) => yScale(d[key]))
					.defined((d) => {
						const date = d.date;
						const val = d[key];
						return date instanceof Date || !isNaN(val);
					});

				let curve;
				if (model) {
					curve = basicCurve.curve(model);
				} else {
					curve = basicCurve;
				}
				let color = "black";
				if (configPairs && configPairs[key]) {
					color = configPairs[key].color;
				}

				let transAxisX = 0;
				let transAxisY = 0;
				if (axis && axis.deltaYAxis) {
					transAxisX = axis.deltaXAxis.x ? +axis.deltaXAxis.x : 0;
					transAxisY = axis.deltaYAxis.y ? +axis.deltaYAxis.y : 0;
				}

				if (
					displayOption &&
					displayOption.line &&
					!configPairs[key].disableLine
				) {
					const lineWidth = +displayOption.line.lineWidth;
					const AntiAliasing = +displayOption.line.antiAliasing;

					let shapeRendering = "auto";

					switch (AntiAliasing) {
						case 0:
							shapeRendering = "crispEdges";
							break;
						case 1:
							shapeRendering = "optimizeSpeed";
							break;
						case 2:
							shapeRendering = "auto";
							break;
						case 3:
							shapeRendering = "geometricPrecision";
							break;
						default:
							shapeRendering = "auto";
					}
					const line = this.svg.selectAll(`.${chartID}_${key}`).data([data]);

					line
						.enter()
						.append("path")
						.attr("class", `${chartID}_${key}`)
						.on("mousemove", (e) => this.onLineHover(e, key, xDomain, yDomain))
						.on("mouseleave", this.mouseLeaveLine)
						.attr(
							"transform",
							`translate(${width * 0.05 + transAxisX}, ${
								height * 0.225 + transAxisY
							})`
						)
						.attr("shape-rendering", shapeRendering)
						.attr("stroke-linecap", "round")
						.merge(line)
						.transition()
						.duration(duration ? duration : 0)
						.attr("d", curve(data))
						.attr(
							"stroke-width",
							lineWidth && !isNaN(lineWidth) ? lineWidth : 1
						)
						.attr("stroke", color)
						.attr("fill", "none");
					line.exit().selectAll(`.${chartID}_${key}`).remove();
				}

				if (
					displayOption &&
					displayOption.scatter &&
					!configPairs[key].disableScatter
				) {
					const circle = this.svg
						.selectAll(`.${key}_${chartID}_circle`)
						.data(data);
					circle
						.enter()
						.append("circle")
						.attr("class", `${key}_${chartID}_circle`)
						.attr(
							"transform",
							`translate(${width * 0.05 + transAxisX}, ${
								height * 0.225 + transAxisY
							})`
						)
						.attr("cx", ({ date }) => xScale(date))
						.attr("cy", (d) => yScale(d[key]))
						.attr("r", displayOption.scatter.r ? displayOption.scatter.r : 0)
						.style("fill", color);

					circle
						.transition()
						.duration(duration ? duration : 0)
						.attr("cx", ({ date }) => xScale(date))
						.attr("cy", (d) => yScale(d[key]))

						.style("fill", color);
					circle.exit().selectAll(`.${key}_${chartID}_circle`).remove();
				}
			} else {
				const $path = $(`.${chartID}_${key}`);
				const $circle = $(`.${key}_${chartID}_circle`);
				$path[0] && $path.fadeOut(275);
				$circle[0] && $circle.fadeOut(275);
				setTimeout(() => {
					$path[0] && $path.remove();
					$circle[0] && $circle.remove();
				}, 300);
			}
		}
	};

	onShapHover = ({ clientX, clientY }) => {
		this.point.x = clientX;
		this.point.y = clientY;
	};

	mouseLeaveShape = () => {
		this.setState({ coordinate: null });
	};

	findMostClosedValue = (compared, arr, key) => {
		const metafied = arr.map((element) => {
			let o = { meta: Math.abs(compared - element) };
			o[key] = element;
			return o;
		});

		const min = minBy(metafied, function (o) {
			return o.meta;
		});

		if (!min) {
			return;
		}
		return min[key];
	};

	onLineHover = (evt, key, xDomain, yDomain) => {
		let currKey = null;
		let dateStr = null;

		const coordinate = this.point.matrixTransform(
			this.svgDOM.getScreenCTM().inverse()
		);
		const { axis, toolTips } = this.props;
		let transAxisX = 0;
		if (axis && axis.deltaXAxis) {
			transAxisX = axis.deltaXAxis.x ? +axis.deltaXAxis.x : 0;
		}

		const predict = toolTips instanceof Object ? toolTips.predict : false;

		if (!evt[0]) return;

		for (let name in evt[0]) {
			if (name === key) {
				currKey = key;
				let date = null;
				const geoDate = new Date(
					xDomain.invert(coordinate.x - (this.props.width * 0.05 + transAxisX))
				);

				if (predict) {
					date = geoDate;
				} else {
					date = new Date(
						this.findMostClosedValue(
							geoDate.getTime(),
							evt.map((element) => element.date),
							"date"
						)
					);
				}

				const year = date.getFullYear();
				const month = date.getMonth() + 1;
				const day = date.getDay();
				const hour = date.getHours();
				const min = date.getMinutes();
				const sec = date.getSeconds();
				const ms = date.getMilliseconds();

				let str = `${hour}时:${min}分:${sec}秒.${ms}毫秒`;
				if (this.timePrecision && this.timePrecision.length) {
					const strAry = [];
					this.timePrecision.forEach((precision) => {
						switch (precision) {
							case "yy":
								strAry.push(year);
								strAry.push("年");
								strAry.push(":");
								break;
							case "mm":
								strAry.push(month);
								strAry.push("月");
								strAry.push(":");
								break;
							case "dd":
								strAry.push(day);
								strAry.push("日");
								strAry.push(":");
								break;
							case "h":
								strAry.push(hour);
								strAry.push("时");
								strAry.push(":");
								break;
							case "m":
								strAry.push(min);
								strAry.push("分");
								strAry.push(":");
								break;
							case "s":
								strAry.push(sec);
								strAry.push("秒");
								strAry.push(":");
								break;
							default: {
								strAry.push(ms + "毫秒");
							}
						}
						if (strAry[strAry.length - 1] === ":") {
							strAry.pop();
						}

						str = strAry.join("");
					});
				}
				dateStr = str;
			}
		}

		let transAxisY = 0;
		if (axis && axis.deltaYAxis) {
			transAxisY = axis.deltaYAxis.y ? +axis.deltaYAxis.y : 0;
		}

		const geoInvertedvalue = yDomain.invert(
			coordinate.y - (this.props.height * 0.225 + transAxisY)
		);

		this.setState({
			currValPair: {
				key: currKey,
				value: predict
					? geoInvertedvalue
					: this.findMostClosedValue(
							geoInvertedvalue,
							evt.map((datum) => {
								return datum[key];
							}),
							key
					  ),
				date: dateStr,
			},
			coordinate,
		});
	};

	mouseLeaveLine = () => {
		this.isHover = false;
		setTimeout(() => {
			$(this.crosshairFocus._groups[0][0]).fadeOut(300);
		}, 675);

		setTimeout(() => {
			this.crosshairFocus.style("display", "none");
		}, 1000);
	};

	svgContextRef = React.createRef();

	render() {
		const { style, chartID, width, height, backgroundColor } = this.props;
		if (!width || !height || !chartID) {
			return null;
		}
		return (
			<svg
				id={chartID}
				width={width}
				height={height}
				ref={this.svgContextRef}
				style={style ? { ...style, backgroundColor } : { backgroundColor }}
			/>
		);
	}
}

SequenceLine.defaultProps = {
	chartID: "default_svg_id",
};

class SequenceWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			debouncedData: [],
		};
	}

	deferData = (data) => {
		return defer((data) => {
			this.setState({ debouncedData: Object.assign([], data) });
		}, data);
	};

	componentDidMount() {
		this.setState({ debouncedData: this.props.data });
	}

	componentDidUpdate(preProps) {
		const { data } = this.props;
		if (preProps.data !== data) {
			this.deferData(data);
		}
	}

	render() {
		const {
			chartID,
			width,
			height,
			configPairs,
			displayOption,
			title,
			duration,
			axisColor,
			xTicks,
			yTicks,
			rotateX,
			rangeY,
			rotateY,
			dateStrFormatter,
			style,
			backgroundColor,
			labelTextFill,
			toolTips,
			axis,
			maxDatalength,
			processTimeRemaining,
		} = this.props;
		return (
			<SequenceLine
				chartID={chartID}
				data={this.state.debouncedData}
				width={width}
				height={height}
				configPairs={configPairs}
				displayOption={displayOption}
				title={title}
				duration={duration}
				axisColor={axisColor}
				xTicks={xTicks}
				yTicks={yTicks}
				rotateX={rotateX}
				rangeY={rangeY}
				rotateY={rotateY}
				dateStrFormatter={dateStrFormatter}
				style={style}
				backgroundColor={backgroundColor}
				labelTextFill={labelTextFill}
				toolTips={toolTips}
				axis={axis}
				maxDatalength={maxDatalength}
				processTimeRemaining={processTimeRemaining}
			/>
		);
	}
}

export default SequenceWrapper;

export const clearScreen = function (attributes, chartID, fadeDuration) {
	for (let key of attributes) {
		const path = D3.select(`#${chartID}`).selectAll(`.${chartID}_${key}`);

		const circles = D3.select(`#${chartID}`).selectAll(
			`.${key}_${chartID}_circle`
		);

		if (isNaN(fadeDuration) || !fadeDuration) {
			path.remove();
			circles.remove();
			return;
		}

		$(path._groups[0][0]).fadeOut(Math.abs(fadeDuration));

		$(circles._groups[0][0]).fadeOut(Math.abs(fadeDuration));

		setTimeout(function () {
			path.remove();
			circles.remove();
		}, Math.abs(fadeDuration) + 25);
	}
};

const animatable = "requestAnimationFrame" in window;

const polifillRequestAnimation = function (callback) {
	const timeStamp = window.setTimeout(callback, 1000 / 60);
	return timeStamp;
};

const requestAnimeFrame = animatable
	? window.requestAnimationFrame
	: polifillRequestAnimation;

export const requestInterval = function (fn, delay) {
	let start = new Date().getTime();
	let handle = {};
	function loop() {
		handle.timeStamp = requestAnimeFrame(loop);
		const current = new Date().getTime();
		if (current - start >= delay) {
			fn.call();
			start = current;
		}
	}
	handle.timeStamp = requestAnimeFrame(loop);
	return handle;
};

export const cancelInterval = function (timeStamp) {
	animatable
		? window.cancelAnimationFrame(timeStamp)
		: window.clearTimeout(timeStamp);
};
