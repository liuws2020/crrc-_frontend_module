import React from "react";
import Konva from "konva";
import "gifler";
import { resolveImage } from "canvas-constructor";

export const autoResize = (
	imgWidth,
	imgHeight,
	containerWidth,
	containerHeight
) => {
	const whr = imgWidth / imgHeight;
	if (imgWidth > containerWidth && imgHeight > containerHeight) {
		if (containerWidth > containerHeight) {
			return {
				resizedWidth: containerHeight * whr,
				resizedHeight: containerHeight,
			};
		}
		return {
			resizedWidth: containerWidth,
			resizedHeight: containerWidth / whr,
		};
	}

	if (imgWidth > containerWidth && imgHeight <= containerHeight) {
		return {
			resizedWidth: containerWidth,
			resizedHeight: containerWidth / whr,
		};
	}

	if (imgWidth <= containerWidth && imgHeight > containerHeight) {
		return {
			resizedWidth: containerHeight * whr,
			resizedHeight: containerHeight,
		};
	}

	return {
		resizedWidth: imgWidth,
		resizedHeight: imgHeight,
	};
};

class CanvasGifWrapper extends React.Component {
	layer;
	canvas;
	width = 0;
	height = 0;

	constructor(props) {
		super(props);
		this.canvas = document.createElement("canvas");

		const { maxWidth, maxHeight } = this.props;
		this.width = maxWidth ? maxWidth : this.canvas.width;
		this.height = maxHeight ? maxHeight : this.canvas.height;

		this.layer = new Konva.Layer();
		this.gifler = window.gifler;
	}

	componentDidMount() {
		const { gifURL } = this.props;
		if (gifURL) {
			resolveImage(`${gifURL}`).then(({ width, height }) => {
				this.animateGIF(width, height, gifURL);
			});
		}
	}

	animateGIF = (gifWidth, gifHeight, gifURL) => {
		const imgWidth = this.width;
		const imgHeight = this.height;

		const stage = new Konva.Stage({
			container: this.canvasContext.current,
			width: imgWidth,
			height: imgHeight,
		});

		stage.add(this.layer);

		this.gifler(`${gifURL}`).frames(this.canvas, this.onDrawFrame);

		const { resizedWidth, resizedHeight } = autoResize(
			gifWidth,
			gifHeight,
			imgWidth,
			imgHeight
		);

		this.canvas.width = gifWidth;
		this.canvas.height = gifHeight;

		let scale = 1;
		let offsetX = 0;
		let offsetY = 0;

		if (imgWidth > gifWidth && imgHeight > gifHeight) {
			const whr = gifWidth / gifHeight;

			if (this.props.gifAlign === "center") {
				if (imgWidth > imgHeight) {
					const emplifiedWidth = imgHeight * whr;
					scale = emplifiedWidth / gifWidth;
					offsetX = (-1 * (imgWidth - emplifiedWidth)) / (2 * scale);
				} else {
					const emplifiedHeight = imgWidth / whr;
					scale = emplifiedHeight / gifHeight;
					offsetY = (-1 * (imgHeight - emplifiedHeight)) / (2 * scale);
				}
			} else if (this.props.gifAlign === "top") {
				if (imgWidth < imgHeight) {
					offsetX = 0;
					offsetY = 0;
					const emplifiedHeight = imgWidth / whr;
					scale = emplifiedHeight / gifHeight;
				}
			} else if (this.props.gifAlign === "bottom") {
				if (imgWidth < imgHeight) {
					const emplifiedHeight = imgWidth / whr;
					scale = emplifiedHeight / gifHeight;
					offsetY = (-1 * (imgHeight - emplifiedHeight)) / scale;
				}
			} else if (this.props.gifAlign === "right") {
				if (imgWidth >= imgHeight) {
					const emplifiedWidth = imgHeight * whr;
					scale = emplifiedWidth / gifWidth;
					offsetX = (-1 * (imgWidth - emplifiedWidth)) / scale;
				}
			} else {
				if (imgWidth >= imgHeight) {
					offsetX = 0;
					const emplifiedWidth = imgHeight * whr;
					scale = emplifiedWidth / gifWidth;
				}
			}
		}

		if (imgWidth <= gifWidth || imgHeight <= gifHeight) {
			if (this.props.gifAlign === "center") {
				if (imgWidth > imgHeight) {
					offsetX = (-1 * (imgWidth - resizedWidth)) / 2;
				} else {
					offsetY = (-1 * (imgHeight - resizedHeight)) / 2;
				}
			} else if (this.props.gifAlign === "top") {
			} else if (this.props.gifAlign === "bottom") {
				if (imgWidth <= imgHeight) {
					offsetY = -1 * (imgHeight - resizedHeight);
				}
			} else if (this.props.gifAlign === "right") {
				if (imgWidth >= imgHeight) {
					offsetX = -1 * (imgWidth - resizedWidth);
				}
			} else {
			}
		}

		const image = new Konva.Image({
			image: this.canvas,
			width: resizedWidth,
			height: resizedHeight,
			scale: { x: scale, y: scale },
			offsetX,
			offsetY,
		});

		this.layer.add(image);
	};

	onDrawFrame = (ctx, { buffer, x, y }) => {
		const cb = this.props.onCanvasPrintCB;
		cb instanceof Function && cb.call(null, ctx);
		ctx.drawImage(buffer, x, y);
		this.layer.draw();
	};

	canvasContext = React.createRef();

	render() {
		return <div ref={this.canvasContext} id={"container"}></div>;
	}
}

export default CanvasGifWrapper;
