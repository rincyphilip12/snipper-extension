import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import ArrowNode from "./Arrow";
import TextNode from "./TextNode";
import URLImage from "./URLImage";
import { SHAPECONFIG } from "./ShapeConfig";

function SceneWithDrawables({
  uploadScreenshot,
  dataUri,
  coords,
}) {
  const [stageWidth, setStageWidth] = useState();
  const [stageHeight, setStageHeight] = useState();
  const [shapesArr, setShapesArr] = useState([]);
  const [selectedId, selectShape] = useState(null);
  // const [, updateState] = React.useState();
  const stageEl = useRef();
  const layerEl = useRef();
  // const [src, setSrc] = useState();
  const shapesCounter = useRef({
    rectangle: 0,
    circle: 0,
    text: 0,
    arrow: 0,
  });

  const shapeComponentsMap = {
    rectangle: Rectangle,
    circle: Circle,
    text: TextNode,
    arrow: ArrowNode,
  };

  // ----------- SET STAGE DIMENSIONS ------
  const setStageDimensions = (width, height) => {
    setStageWidth(width);
    setStageHeight(height);
  };

  // ---- ADD A SHAPE COMPONENT and CONFIG TO THE SHAPE ARR & Adding a counter _------
  // --- FORMAT --- >
  // shapesCounter : {  rectangle : 0, circle:0, arrow:0, text:0 }
  // shapesArr : [ {component: Rectangle, config : {x:0,y:0,width:100,,.... }}, {component: Circle, config : {x:0,y:0,width:100,,.... }]

  const addShape = shapeType => {
    const counter = shapesCounter.current[shapeType]; //a counter storing Num of shapes added
    shapesCounter.current[shapeType] = counter + 1;

    // GET DEFAULT CONFIG of THE SHAPES
    const config = {
      ...SHAPECONFIG[shapeType],
      id: `${shapeType}${counter}`,
    };
    // RETURNS A REACT COMPONENT WITH CONFIG PASSED
    const shapeComponent = getShapeComponent(shapeType);

    // APPEND THE COMPONENT TO SHAPES ARR
    const shapes = shapesArr.concat({
      component: shapeComponent,
      config,
    });
    setShapesArr(shapes);

  };

  // ------- GET CORRESPONDING SHAPE REACT COMPONENT ------
  const getShapeComponent = shapeType => {
    if (
      typeof shapeComponentsMap[shapeType] !== "undefined"
    )
      return shapeComponentsMap[shapeType];
  };

  // ----------- FORCE UPDATE -------------
  // const forceUpdate = React.useCallback(
  //   () => updateState({}),
  //   []
  // );

// ------------ UNDO ----------------
  const undo = () => {
    const tempShapesArr = [...shapesArr];
    tempShapesArr.pop();
    setShapesArr(tempShapesArr);
  };
  // --------------- ON EDIT COMPLETE -------–
  const onEditComplete = async () => {
    const imgDataUrl = stageEl.current.toDataURL();
    const blob = await (await fetch(imgDataUrl)).blob();
    uploadScreenshot(blob);
    // setSrc( // for testing purpose!!!
    //   URL.createObjectURL(
    //     new File([blob], "sample.jpeg", {
    //       type: "image/jpeg",
    //     })
    //   )
    // );
  };

  // ----------------- ON BACKGROUND IMAGE CLICK ----------
  const onBgImageClick = (e) => {
    selectShape(null)
  }

  return (
    <div className="home-page">
      <button
        type="button"
        onClick={e => addShape("rectangle")}
      >
        Rectangle
      </button>
      <button
        type="button"
        onClick={e => addShape("circle")}
      >
        Circle
      </button>
      <button type="button" onClick={e => addShape("text")}>
        Text
      </button>
      <button
        type="button"
        onClick={e => addShape("arrow")}
      >
        Arrow
      </button>
      <button type="button" onClick={onEditComplete}>
        Done
      </button>
      <button type="button" onClick={undo}>
        Undo
      </button>
     

      <Stage
        x={0}
        y={0}
        width={stageWidth}
        height={stageHeight}
        ref={stageEl}
      >
        <Layer ref={layerEl}>
          {/* BG IMAGE */}
          <URLImage
            src={dataUri}
            coords={coords}
            setStageDimensions={setStageDimensions}
            onClick = {onBgImageClick}
          />

          {/* SHAPES ARRAY */}
          {shapesArr.map((shapeComponent, i) => {
            const SComponent = shapeComponent.component;
            const sconfig = shapeComponent.config;
            return (
              <SComponent
                key={sconfig.id}
                shapeProps={sconfig}
                isSelected={sconfig.id === selectedId}
                onSelect={() => {
                  selectShape(sconfig.id);
                }}
                onChange={newAttrs => {
                  const tempShapesArr = [...shapesArr]
                  tempShapesArr[i].config = newAttrs;
                  setShapesArr(tempShapesArr);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
      {/* <img src={src} alt="" /> */}
    </div>
  );
}
export default SceneWithDrawables;
