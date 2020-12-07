import React from "react";
import {
	Segment,
	Grid,
	Table,
	Input,
	Button,
	Icon,
	Ref,
	Popup,
	Header,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import $ from "jquery";
import _ from "lodash";
import "./animation.css";

class PageNavTable extends React.Component {
	renderTableHeaders = (tableHeaderBC) => {
		const { titles, height } = this.props;
		if (!(titles instanceof Array) || !height) return null;
		const headerJSX = titles.map((title, i) => {
			if (!title)
				return (
					<Table.HeaderCell
						key={i}
						style={{
							backgroundColor: tableHeaderBC ? tableHeaderBC : null,
						}}></Table.HeaderCell>
				);
			const {
				text,
				align,
				key,
				type,
				controlBtnAttr,
				sortCb,
				filterCb,
			} = title;
			let sortText = "";
			switch (this.state.sortControls[i].sortType) {
				case this.sortTypes[0]:
					sortText = "取消排序";
					break;
				case this.sortTypes[1]:
					sortText = "升序排序";
					break;
				default:
					sortText = "降序排序";
			}

			const popupCSS = this.props.popupStyle;

			const popupStyle = popupCSS ? popupCSS.style : {};

			const headerStyle =
				popupCSS && popupCSS.headerStyle
					? Object.assign({}, popupCSS.headerStyle)
					: {};

			const headerSize =
				popupCSS && popupCSS.headerSize ? popupCSS.headerSize : "medium";

			const inputStyle =
				popupCSS && popupCSS.inputStyle
					? Object.assign({}, popupCSS.inputStyle)
					: {};

			const popupInverted =
				popupCSS && popupCSS.inverted ? popupCSS.inverted : true;

			const buttonInverted =
				controlBtnAttr && controlBtnAttr.inverted ? true : false;

			const buttonStyle = Object.assign(
				{},
				controlBtnAttr && controlBtnAttr.style
			);

			const buttonColor =
				controlBtnAttr && controlBtnAttr.color ? controlBtnAttr.color : null;

			const titleStyle = this.props.titleStyle;
			const titleSize =
				titleStyle && titleStyle.headerSize ? titleStyle.headerSize : "medium";
			const titleCSS = titleStyle
				? Object.assign({}, titleStyle.headerStyle)
				: {};

			const sortable = title && title.sort ? true : false;
			const filterable = title && title.filter ? true : false;

			return (
				<Table.HeaderCell
					key={i}
					textAlign={align ? align : "left"}
					style={{ backgroundColor: tableHeaderBC ? tableHeaderBC : null }}>
					{type === "text" && (sortable || filterable) ? (
						<Grid>
							<Grid.Row columns={2}>
								<Grid.Column width={8} style={{ paddingTop: "2%" }}>
									<Header
										size={titleSize}
										style={titleCSS}
										inverted={tableHeaderBC ? false : true}>
										{text}
									</Header>
								</Grid.Column>
								<Grid.Column width={4} style={{ paddingTop: "2%" }}>
									<Button.Group size='small' floated={"left"}>
										{sortable ? (
											<Popup
												content={
													<Header icon style={headerStyle} size={headerSize}>
														{sortText}
													</Header>
												}
												inverted={popupInverted}
												on={"hover"}
												position={"bottom center"}
												style={popupStyle}
												trigger={
													<Button
														onClick={() =>
															this.onSortTypeChange(i, key, sortCb)
														}
														inverted={buttonInverted}
														style={buttonStyle}
														color={buttonColor}
														icon={
															<Icon
																name={this.state.sortControls[i].sortType}
																inverted={buttonInverted}
																color={
																	controlBtnAttr && controlBtnAttr.color
																		? controlBtnAttr.color
																		: "grey"
																}
															/>
														}
													/>
												}
											/>
										) : null}
										{filterable ? (
											<Popup
												content={
													<React.Fragment>
														<Header icon style={headerStyle} size={headerSize}>
															关键字过滤
														</Header>
														<Input
															placeholder='输入关键字'
															value={this.state.filterText}
															style={inputStyle}
															onChange={({ target }) =>
																this.onFilterChange(key, target.value, filterCb)
															}
														/>
													</React.Fragment>
												}
												style={popupStyle}
												inverted={popupInverted}
												on={"click"}
												position={"bottom center"}
												onUnmount={this.restoreData}
												trigger={
													<Button
														inverted={buttonInverted}
														style={buttonStyle}
														color={buttonColor}
														icon={
															<Icon
																name={"filter"}
																inverted={buttonInverted}
																color={
																	controlBtnAttr && controlBtnAttr.color
																		? controlBtnAttr.color
																		: "grey"
																}
															/>
														}
													/>
												}
											/>
										) : null}
									</Button.Group>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					) : (
						<Header
							size={titleSize}
							style={titleCSS}
							inverted={tableHeaderBC ? false : true}>
							{text}
						</Header>
					)}
				</Table.HeaderCell>
			);
		});
		return <Table.Row style={{ height: height * 0.1 }}>{headerJSX}</Table.Row>;
	};

	onFilterChange = (key, value, filterCb) => {
		const dataList = this.originList;
		filterCb instanceof Function && filterCb.call(null, key);
		if (dataList instanceof Array && dataList.length) {
			const filtered = _.filter(dataList, function (o) {
				return `${o[key].text}`.includes(value);
			});
			this.setState({ filterText: value, data: filtered });
		}
	};

	restoreData = () => {
		this.setState({ filterText: "", data: this.originList });
	};

	sortTypes = ["sort", "caret up", "caret down"];
	originList = [];

	onSortTypeChange = (i, key, sortCb) => {
		let typeIndex;
		this.setState(({ sortControls }) => {
			const control = sortControls[i];
			typeIndex = this.sortTypes.indexOf(control.sortType);
			sortCb instanceof Function &&
				sortCb.call(null, [this.sortTypes[typeIndex], key]);
			let sorted = [];
			switch (this.sortTypes[typeIndex]) {
				case "caret down":
					sorted = _.orderBy(this.state.data, [`orderBy_${key}`], ["desc"]);
					break;
				case "caret up":
					sorted = _.orderBy(this.state.data, [`orderBy_${key}`], ["asc"]);
					break;
				default:
					sorted = [...this.originList];
			}
			if (typeIndex < this.sortTypes.length - 1) {
				sortControls[i].sortType = this.sortTypes[typeIndex + 1];
				for (let j = 0, len = sortControls.length; j < len; j++) {
					if (j === i) continue;
					sortControls[j].sortType = this.sortTypes[2];
				}
				return { sortControls: [...sortControls], data: [...sorted] };
			}
			sortControls[i].sortType = this.sortTypes[0];
			for (let j = 0, len = sortControls.length; j < len; j++) {
				if (j === i) continue;
				sortControls[j].sortType = this.sortTypes[2];
			}
			return { sortControls: [...sortControls], data: [...sorted] };
		});
	};

	renderBodyElements = () => {
		const { height, animationDuration, rowClickCb } = this.props;
		const rowsPerPage = this.state.pages;
		const dataList = this.deleteOrderKeys(this.state.data);
		if (!(dataList instanceof Array) || !height) return null;
		if (!dataList.length) return null;

		return [...dataList, ...this.state.restEmptyList]
			.slice(
				this.anchor,
				!isNaN(rowsPerPage)
					? this.anchor + Math.abs(rowsPerPage)
					: dataList.length
			)
			.map((element, index) => {
				const rowStyle = {
					height: height * 0.1,
					animation: `${
						animationDuration ? animationDuration : 0.8
					}s ease-out 0s 1 ${this.state.opacity ? "easeOpacityIn" : "none"}`,
					opacity: this.state.opacity,
				};
				const cellJSX = Object.keys(element).map((key) => {
					if (element[key].type === "button" && element[key].cb) {
						if (!element[key]) return <Table.Cell key={key}></Table.Cell>;
						const {
							style,
							stopEventBubble,
							cb,
							text,
							basic,
							inverted,
							size,
							color,
							compact,
							align,
						} = element[key];
						return (
							<Table.Cell key={key} textAlign={align ? align : "left"}>
								<Button
									key={key}
									style={Object.assign({}, style)}
									basic={basic ? basic : false}
									inverted={inverted ? inverted : false}
									size={size ? size : "medium"}
									compact={compact ? compact : false}
									color={color ? color : "black"}
									onClick={(e) => {
										stopEventBubble && e.stopPropagation();
										cb instanceof Function && cb.call(null, element);
									}}>
									{text ? text : "..."}
								</Button>
							</Table.Cell>
						);
					}
					const { text, type, align } = element[key];
					return type ? (
						<Table.Cell key={key} textAlign={align ? align : "left"}>
							{text}
						</Table.Cell>
					) : null;
				});
				return (
					<Table.Row
						key={index}
						style={rowStyle}
						onClick={() => {
							this.onRowClick(element, rowClickCb);
						}}>
						{cellJSX}
					</Table.Row>
				);
			});
	};

	onRowClick = (element, cb) => {
		if (cb instanceof Function) {
			cb.call(null, element);
		}
	};

	state = {
		disableBack: true,
		disableNext: true,
		pageNumber: 1,
		opacity: 1,
		restEmptyList: [],
		data: [],
		sortControls: this.props.titles.map((title) => {
			return { ...title, sortType: this.sortTypes[2] };
		}),
		oversize: false,
		pages: this.props.rowsPerPage,
		filterText: "",
	};

	pages = 0;

	componentDidMount() {
		const { dataList, rowsPerPage } = this.props;
		if (dataList instanceof Array) {
			if (dataList.length > rowsPerPage) {
				this.setState({ disableNext: false });
				this.totalPage = Math.floor(dataList.length / rowsPerPage);
			}
			this.addOrderKeys(dataList);
			this.setState({ data: dataList });
			this.originList = dataList;
		}
	}

	componentDidUpdate(preProps, preState) {
		const { dataList } = this.props;
		const rowsPerPage = this.state.pages;
		if (preProps.dataList !== dataList) {
			if (dataList instanceof Array) {
				if (dataList.length > rowsPerPage) {
					this.setState({ disableNext: false });
					this.totalPage = Math.floor(dataList.length / rowsPerPage);
				}
				this.addOrderKeys(dataList);
				this.setState({ data: dataList });
				this.originList = dataList;
			}
		}

		if (
			this.tableRef.current.offsetHeight > this.props.height * 0.85 &&
			!this.state.oversize
		) {
			this.setState({ oversize: true });
		}

		if (this.state.oversize !== preState.oversize && this.state.oversize) {
			const unitHeight =
				this.tableRef.current.offsetHeight / (this.props.rowsPerPage + 1);
			this.setState({
				pages: Math.floor((this.props.height * 0.85) / unitHeight) - 1,
			});
		}
	}

	addOrderKeys = (dataList) => {
		for (let d of dataList) {
			const keys = Object.keys(d);
			for (let key of keys) {
				if (d[key].type === "text" && !d[`orderBy_${key}`]) {
					d[`orderBy_${key}`] = d[key].text;
				}
			}
		}
	};

	deleteOrderKeys = (dataList) => {
		return dataList.map((d) => {
			const keys = Object.keys(d);
			const element = Object.assign({}, d);
			for (let key of keys) {
				if (key.split("_")[0] === "orderBy") {
					delete element[key];
				}
			}
			return element;
		});
	};

	anchor = 0;
	totalPage = 1;

	onPageBack = () => {
		const { controlAttr } = this.props;
		const rowsPerPage = this.state.pages;
		const dataList = this.state.data;
		if (!(dataList instanceof Array)) return;
		if (!dataList.length) return;
		const rows = isNaN(+rowsPerPage) ? dataList.length : +rowsPerPage;

		if (this.anchor >= rows) {
			this.anchor = this.anchor - rows;
			const p = this.anchor / rows + 1;
			this.setState({
				disableNext: false,
				pageNumber: p,
				restEmptyList: [],
			});
			if (controlAttr && controlAttr.backCb instanceof Function) {
				controlAttr.backCb.call(null, p);
			}
		}

		if (this.anchor === 0) {
			this.setState({ disableBack: true });
		}
		this.fadeInOut();
	};

	onPageNext = () => {
		const { controlAttr } = this.props;
		const dataList = this.state.data;
		const rowsPerPage = this.state.pages;
		if (!(dataList instanceof Array)) return;
		if (!dataList.length) return;
		const rows = isNaN(+rowsPerPage) ? dataList.length : +rowsPerPage;

		if (this.anchor + rows < dataList.length) {
			this.anchor = this.anchor + rows;
			const chunkedDataList = [];
			const length = dataList.length - this.anchor;
			if (length < rows) {
				for (let i = 0, len = rows - length; i < len; i++) {
					let empty = {};
					Object.keys(dataList[0]).forEach((key) => {
						empty[key] = "";
					});
					chunkedDataList.push(empty);
				}
				this.setState({ disableNext: true, restEmptyList: chunkedDataList });
			} else {
				if (this.state.disableNext) {
					this.setState({ disableNext: false });
				}
			}
			const p = this.anchor / rows + 1;
			if (controlAttr && controlAttr.backCb instanceof Function) {
				controlAttr.nextCb.call(null, p);
			}
			this.setState({
				disableBack: false,
				pageNumber: p,
			});
			this.fadeInOut();
		}
	};

	fadeInOut = () => {
		this.setState({ opacity: 0 });
		const delay = setTimeout(() => {
			this.setState({ opacity: 1 });
			clearTimeout(delay);
		}, 0);
	};

	onPageNumberChange = ({ target }) => {
		if (target) {
			const { controlAttr } = this.props;
			const dataList = this.state.data;
			const rowsPerPage = this.state.pages;
			if (!(dataList instanceof Array)) return;
			const rows = isNaN(+rowsPerPage) ? dataList.length : +rowsPerPage;
			const inputVal = parseInt(target.value);
			if (controlAttr && controlAttr.inputCb instanceof Function) {
				controlAttr.inputCb.call(null, inputVal);
			}
			if (inputVal === this.state.pageNumber) return;
			if (inputVal <= this.totalPage + 1 && inputVal > 0 && !isNaN(inputVal)) {
				const start = inputVal * rows - rows;
				const list = [...dataList, ...this.state.restEmptyList];
				if (start >= 0 && start <= list.length) {
					this.anchor = start;
					const currentList = list.slice(this.anchor, this.anchor + rows);
					const length = currentList.length;
					const chunkedDataList = [];
					if (length < rows) {
						for (
							let i = 0, len = rows - dataList.length + this.anchor;
							i < len;
							i++
						) {
							let empty = {};
							Object.keys(dataList[0]).forEach((key) => {
								empty[key] = "";
							});
							chunkedDataList.push(empty);
						}

						this.setState({ restEmptyList: chunkedDataList });
					} else {
						this.setState({ restEmptyList: [] });
					}

					this.setState({
						pageNumber: inputVal,
						disableBack: start === 0 ? true : false,
					});
					this.fadeInOut();
					start + rows >= dataList.length
						? this.setState({ disableNext: true })
						: this.setState({ disableNext: false });
				}
			}
		}
	};

	onPageNumClick = ({ target }) => {
		if (target) {
			target.setSelectionRange(0, target.value.length);
		}
	};

	renderControls = () => {
		const { height, controlAttr } = this.props;
		const styleBtn = controlAttr ? controlAttr.styleBtn : null;
		const styleInput = controlAttr ? controlAttr.styleInput : null;
		const buttonAttr = controlAttr ? controlAttr.buttonAttr : null;

		if (!height) return null;
		return (
			<React.Fragment>
				<Grid.Column width={5} style={{ padding: 0 }}>
					<Button
						icon
						floated='right'
						onClick={this.onPageBack}
						disabled={this.state.disableBack}
						basic={buttonAttr && buttonAttr.basic ? buttonAttr.basic : false}
						inverted={
							buttonAttr && buttonAttr.inverted ? buttonAttr.inverted : false
						}
						size={buttonAttr && buttonAttr.size ? buttonAttr.size : "medium"}
						compact={
							buttonAttr && buttonAttr.compact ? buttonAttr.compact : false
						}
						color={buttonAttr && buttonAttr.color ? buttonAttr.color : "black"}
						style={{
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
							cursor: "pointer",
							height: "100%",
							...Object.assign({}, styleBtn),
						}}>
						<Icon name='left chevron' />
					</Button>
				</Grid.Column>
				<Grid.Column
					width={4}
					style={{
						padding: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Input
						placeholder='页数'
						fluid
						value={this.state.pageNumber}
						onChange={this.onPageNumberChange}
						onClick={this.onPageNumClick}
						style={{width: "100%",}}
						ref={(node) => {
							if (node && node.inputRef && node.inputRef.current) {
								this.applyDOMcss(node.inputRef.current, {
									"border-radius": 0,
									"text-align": "center",
									...Object.assign({}, styleInput),
								});
							}
						}}
					/>
				</Grid.Column>
				<Grid.Column width={5} style={{ padding: 0 }}>
					<Button
						icon
						floated='left'
						onClick={this.onPageNext}
						disabled={this.state.disableNext}
						basic={buttonAttr && buttonAttr.basic ? buttonAttr.basic : false}
						inverted={
							buttonAttr && buttonAttr.inverted ? buttonAttr.inverted : false
						}
						size={buttonAttr && buttonAttr.size ? buttonAttr.size : "medium"}
						compact={
							buttonAttr && buttonAttr.compact ? buttonAttr.compact : false
						}
						color={buttonAttr && buttonAttr.color ? buttonAttr.color : "black"}
						style={{
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0,
							cursor: "pointer",
							height: "100%",
							...Object.assign({}, styleBtn),
						}}>
						<Icon name='right chevron' />
					</Button>
				</Grid.Column>
			</React.Fragment>
		);
	};

	applyDOMcss = (DOM, css) => {
		const polyfill = function (node, cssAttrs) {
			const style = Object.assign({}, cssAttrs);
			for (let attr in style) {
				node.style[attr] = style[attr];
			}
		};
		try {
			$ instanceof Function ? $(DOM).css(css) : polyfill(DOM, css);
		} catch (error) {
			polyfill(DOM, css);
		}
	};

	tableRef = React.createRef();

	render() {
		const {
			tableStyle,
			tableColor,
			striped,
			controlAttr,
			bodyPadding,
		} = this.props;
		const headerStyle = tableStyle ? tableStyle.headerStyle : null;
		const bodyStyle = tableStyle ? tableStyle.bodyStyle : null;
		let tableCss = Object.assign({}, tableStyle);
		tableCss && delete tableCss.headerStyle;
		tableCss && delete tableCss.bodyStyle;

		const publicColor =
			tableCss && tableCss.backgroundColor ? tableCss.backgroundColor : null;
		const containerColor =
			controlAttr &&
			controlAttr.containerCss &&
			controlAttr.containerCss.backgroundColor
				? controlAttr.containerCss.backgroundColor
				: null;

		let containerBC = publicColor;
		if (containerColor) {
			containerBC = containerColor;
		}
		if (!containerBC) {
			containerBC = "white";
		}

		let tableHeaderBC;
		if (headerStyle && headerStyle.backgroundColor) {
			tableHeaderBC = headerStyle.backgroundColor;
		} else if (
			(!headerStyle || (headerStyle && !headerStyle.backgroundColor)) &&
			tableCss &&
			tableCss.backgroundColor
		) {
			tableHeaderBC = tableCss.backgroundColor;
		} else {
			tableHeaderBC = "white";
		}

		let paddingRight = "0.5%";
		let paddingLeft = "0.5%";

		if (bodyPadding) {
			const { left, right } = bodyPadding;
			paddingRight = right;
			paddingLeft = left;
		}

		return (
			<Grid>
				<Grid.Column width={16} style={{ padding: 0 }}>
					<Grid.Row>
						<Segment
							style={{
								height: this.props.height * 0.85,
								paddingTop: 0,
								paddingRight,
								paddingBottom: 0,
								paddingLeft,
								boxShadow: "none",
								border: "none",
							}}>
							<Ref innerRef={this.tableRef}>
								<Table
									color={tableColor ? tableColor : null}
									inverted={tableColor ? true : false}
									selectable
									striped={striped ? striped : false}
									style={{
										height: "inherit",
										borderBottomLeftRadius: 0,
										borderBottomRightRadius: 0,
										...Object.assign({}, tableCss),
									}}>
									<Table.Header
										style={{
											...Object.assign({}, headerStyle),
										}}>
										{this.renderTableHeaders(tableColor ? null : tableHeaderBC)}
									</Table.Header>

									<Table.Body
										style={{
											...Object.assign({}, bodyStyle),
										}}>
										{this.renderBodyElements()}
									</Table.Body>
								</Table>
							</Ref>
						</Segment>
					</Grid.Row>
					<Grid.Row>
						<Segment
							color={tableColor ? tableColor : null}
							inverted={tableColor ? true : false}
							style={{
								height: this.props.height * 0.15,
								marginRight: paddingRight,
								marginLeft: paddingLeft,
								borderTopLeftRadius: 0,
								borderTopRightRadius: 0,
								backgroundColor: containerBC,
								...Object.assign(
									{},
									controlAttr ? controlAttr.containerCss : {}
								),
							}}>
							<Grid>
								<Grid.Row
									columns={5}
									style={{
										paddingTop: "1.25%",
										zIndex: 10,
									}}>
									<Grid.Column width={1}></Grid.Column>
									{this.renderControls()}
									<Grid.Column width={1}></Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					</Grid.Row>
				</Grid.Column>
			</Grid>
		);
	}
}

export default PageNavTable;
