
import React from "react";
import { Image } from "react-konva";


export default class URLImage extends React.Component {
    state = {
        image: null,
    };
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
    }
    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image,
        });
    };
    render() {

        if (this.state?.image) {
            const aspectRatioY = this.state.image.height / this.props.coords.screenHeight;
            const aspectRatioX = this.state.image.width / this.props.coords.screenWidth;
            const iwidth = this.props.coords.width * aspectRatioX;
            const iheight = this.props.coords.height * aspectRatioY;
            this.props.setStageDimensions(iwidth, iheight);
            return (
                <Image
                    x={0}
                    y={0}
                    width={iwidth}
                    height={iheight}
                    cropX={this.props.coords.left * aspectRatioX + 2}
                    cropY={this.props.coords.top * aspectRatioY + 2}
                    cropWidth={this.props.coords.width * aspectRatioX}
                    cropHeight={this.props.coords.height * aspectRatioY}
                    image={this.state.image}
                    ref={(node) => {
                        this.imageNode = node;
                    }}
                />
            );
        }
    }
}
