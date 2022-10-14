import { Arrow, Circle } from "react-konva";
import EditableTextComponent from './EditableTextComponent';

// ------------------ DRAWABLE BASE CLASS ---------- 
class Drawable {
    constructor(startx, starty) {
        this.startx = startx;
        this.starty = starty;
    }
}

// ------------------ ARROW DRAWABLE CLASS ---------- 
export class ArrowDrawable extends Drawable {
    constructor(startx, starty) {
        super(startx, starty);
        this.x = startx;
        this.y = starty;
    }
    registerMovement(x, y) {
        this.x = x;
        this.y = y;
    }
    render() {
        const points = [this.startx, this.starty, this.x, this.y];
        return <Arrow points={points} fill="black" stroke="black" />;
    }
}


// ------------------- CIRCLE DRAWABLE CLASS--------------
export class CircleDrawable extends ArrowDrawable {
    constructor(startx, starty) {
        super(startx, starty);
        this.x = startx;
        this.y = starty;
    }
    render() {
        const dx = this.startx - this.x;
        const dy = this.starty - this.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        return (
            <Circle radius={radius} x={this.startx} y={this.starty} stroke="black" />
        );
    }
}

// ------------------- CIRCLE DRAWABLE CLASS--------------
export class TextDrawable extends ArrowDrawable {
    constructor(startx, starty) {
        super(startx, starty);
        this.x = startx;
        this.y = starty;
    }
    render() {
        return (
            <EditableTextComponent x={this.startx} y={this.starty} />
        );
    }
}

