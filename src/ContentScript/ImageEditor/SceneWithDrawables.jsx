import { Stage, Layer } from "react-konva";
import {
  ArrowDrawable,
  CircleDrawable,
  TextDrawable,
} from "./Drawables";
import URLImage from "./URLImage";
import { useRef, useState } from "react";

function SceneWithDrawables({
  uploadScreenshot,
  dataUri,
  coords,
}) {
  const [drawables, setDrawables] = useState([]);
  const [newDrawable, setNewDrawable] = useState([]);
  const [newDrawableType, setNewDrawableType] =
    useState("ArrowDrawable");
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const stageRef = useRef();

  // ----------- GET NEW DRAWABLE TYPE ----------
  const getNewDrawableBasedOnType = (x, y, type) => {
    const drawableClasses = {
      ArrowDrawable,
      CircleDrawable,
      TextDrawable,
    };
    return new drawableClasses[type](x, y);
  };

  // ------------------ MOUSE DOWN ---------------
  const handleMouseDown = e => {
    if (newDrawable.length === 0) {
      const { x, y } = e.target
        .getStage()
        .getPointerPosition();
      const newDrawable = getNewDrawableBasedOnType(
        x,
        y,
        newDrawableType
      );
      setNewDrawable([newDrawable]);
    }
  };

  // ------------------ MOUSE UP --------------
  const handleMouseUp = e => {
    console.log(e);
    if (newDrawable.length === 1) {
      const { x, y } = e.target
        .getStage()
        .getPointerPosition();
      const drawableToAdd = newDrawable[0];
      drawableToAdd.registerMovement(x, y);
      // drawables.push(drawableToAdd);
      setNewDrawable([]);
      setDrawables(oldDrawables => [
        ...oldDrawables,
        drawableToAdd,
      ]);
    }
  };

  // ---------------- MOUSE MOVE ------------
  const handleMouseMove = e => {
    // const { newDrawable } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target
        .getStage()
        .getPointerPosition();
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      setNewDrawable([updatedNewDrawable]);
    }
  };

  // --------------- ON EDIT COMPLETE -------–
  const onEditComplete = async () => {
    const imgDataUrl = stageRef.current.toDataURL();
    const blob = await (await fetch(imgDataUrl)).blob();
    uploadScreenshot(blob);
  };

  // ----------- SET STAGE DIMENSIONS ------
  const setStageDimensions = (width, height) => {
    setStageWidth(width);
    setStageHeight(height);
  };

  // ------------ UNDO -------------
  const onUndoDrawables = () => {
    if (!drawables[0]) return;
    let oldDrawables = [...drawables];
    oldDrawables.splice(-1, 2);
    setDrawables(oldDrawables);
  };
  return (
    <div>
      <button
        onClick={e => setNewDrawableType("ArrowDrawable")}
      >
        Draw Arrows
      </button>
      <button
        onClick={e => setNewDrawableType("CircleDrawable")}
      >
        Draw Circles
      </button>
      <button
        onClick={e => setNewDrawableType("TextDrawable")}
      >
        Add Text
      </button>
      <button onClick={onUndoDrawables}>Undo!</button>
      <button onClick={onEditComplete}>Done!</button>
      <Stage
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={stageWidth}
        height={stageHeight}
      >
        <Layer>
          {/* CLIPPED IMAGE */}
          <URLImage
            src={dataUri}
            coords={coords}
            setStageDimensions={setStageDimensions}
          />

          {/* DRAWABLES  */}
          {drawables[0] &&
            [...drawables, ...newDrawable].map(drawable => {
              return drawable.render();
            })}
        </Layer>
      </Stage>
    </div>
  );
}

export default SceneWithDrawables;
