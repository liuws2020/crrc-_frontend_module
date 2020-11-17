import React from "react";
import GIFcanvasWrapper from "./GIFcanvasHandler";

class Main extends React.Component {
	onCanvasPrintCallback = (context) => {
		// 默认第一个参数为canvas 2d context
	};

	// * 注意：使用gif必须保证长宽比符合目标组件的长宽比
	/*
		安装canvas：
		https://www.npmjs.com/package/canvas
		安装canvas constructor：
		https://www.npmjs.com/package/canvas-constructor
		安装Konva：
		https://www.npmjs.com/package/konva
		安装Gifler：
		https://www.npmjs.com/package/gifler
	*/

	state = {
		width: 400,
		height: 200,
	};

	componentDidMount() {
		setInterval(() => {
			this.setState({
				width: Math.random() * 1000,
				height: Math.random() * 1000,
			});
		}, 5000);
	}

	render() {
		const { width, height } = this.state;
		return (
			<div>
				<GIFcanvasWrapper
					gifURL={"./resource/circle_a.gif"} // gif存储地址
					maxWidth={width} // 最大宽度
					maxHeight={height} // 最大高度
					onCanvasPrintCB={this.onCanvasPrintCallback} // 逐帧绘制时回调
					gifAlign={"right"} // gif在容器中的位置 center top bottom right left 默认居中
					style={{}}
				/>
			</div>
		);
	}
}

export default Main;
