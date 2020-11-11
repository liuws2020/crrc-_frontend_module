import React from "react";
import { Segment, Grid, Table, Input, Button, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import $ from "jquery";
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
						style={{ backgroundColor: tableHeaderBC }}></Table.HeaderCell>
				);
			const { text, align } = title;
			return (
				<Table.HeaderCell
					key={i}
					textAlign={align ? align : "left"}
					style={{ backgroundColor: tableHeaderBC }}>
					{text}
				</Table.HeaderCell>
			);
		});
		return <Table.Row style={{ height: height * 0.1 }}>{headerJSX}</Table.Row>;
	};

	renderBodyElements = () => {
		const { dataList, height, animationDuration, rowsPerPage } = this.props;

		if (!(dataList instanceof Array) || !height) return null;
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
					<Table.Row key={index} style={rowStyle}>
						{cellJSX}
					</Table.Row>
				);
			});
	};

	state = {
		disableBack: true,
		disableNext: true,
		pageNumber: 1,
		opacity: 1,
		restEmptyList: [],
	};

	componentDidMount() {
		const { dataList, rowsPerPage } = this.props;
		if (dataList instanceof Array) {
			if (dataList.length > rowsPerPage) {
				this.setState({ disableNext: false });
				this.totalPage = Math.floor(dataList.length / rowsPerPage);
			}
		}
	}

	componentDidUpdate(preProps, preState) {
		const { dataList, rowsPerPage } = this.props;
		if (preProps.dataList !== dataList) {
			if (dataList instanceof Array) {
				if (dataList.length > rowsPerPage) {
					this.setState({ disableNext: false });
					this.totalPage = Math.floor(dataList.length / rowsPerPage);
				}
			}
		}
	}

	anchor = 0;
	totalPage = 1;

	onPageBack = () => {
		const { dataList, rowsPerPage, controlAttr } = this.props;
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
		const { dataList, rowsPerPage, controlAttr } = this.props;
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
			const { dataList, rowsPerPage, controlAttr } = this.props;
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
				<Grid.Column width={4} style={{ padding: 0 }}>
					<Input
						placeholder='页数'
						fluid
						value={this.state.pageNumber}
						onChange={this.onPageNumberChange}
						onClick={this.onPageNumClick}
						ref={(node) => {
							if (node && node.inputRef && node.inputRef.current) {
								const inputDOM = node.inputRef.current;
								$(inputDOM).css({
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

	render() {
		const { tableStyle, tableColor, striped, controlAttr } = this.props;
		const headerStyle = tableStyle ? tableStyle.headerStyle : null;
		const bodyStyle = tableStyle ? tableStyle.headerStyle : null;

		let tableCss = tableStyle;
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

		const tableHeaderBC =
			tableCss && tableCss.backgroundColor ? tableCss.backgroundColor : "white";

		return (
			<Grid>
				<Grid.Column width={16} style={{ padding: 0 }}>
					<Grid.Row>
						<Segment
							style={{
								height: this.props.height * 0.85,
								paddingTop: 0,
								paddingRight: "0.5%",
								paddingBottom: 0,
								paddingLeft: "0.5%",
								boxShadow: "none",
								border: "none",
							}}>
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
									{this.renderTableHeaders(tableHeaderBC)}
								</Table.Header>
								<Table.Body style={Object.assign({}, bodyStyle)}>
									{this.renderBodyElements()}
								</Table.Body>
							</Table>
						</Segment>
					</Grid.Row>
					<Grid.Row style={{ paddingRight: "0.5%", paddingLeft: "0.5%" }}>
						<Segment
							color={tableColor ? tableColor : "white"}
							inverted={tableColor ? true : false}
							style={{
								height: this.props.height * 0.15,
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
