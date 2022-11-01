import React from "react";
import { Html } from "react-konva-utils";

function getStyle(shapeProps) {
  const baseStyle = {
    width: `${shapeProps.width}px`,
    height: `${shapeProps.height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    resize: "none",
    margintop: "-4px",
    color: shapeProps.fill,
    fontSize: `${shapeProps.fontSize}px`,
    fontFamily: shapeProps.fontFamily,
  };
  return baseStyle;
}

export function EditableTextInput({ shapeProps, onChangeHandler, onKeyDown }) {
  const style = getStyle(shapeProps);

  const onChangeTextAreaHandler = (e) => {
    onChangeHandler({...shapeProps,text : e.currentTarget.value})
  }
  return (
    <Html
      groupProps={{ x: shapeProps.x, y: shapeProps.y }}
      divProps={{ style: { opacity: 1 } }}
    >
      <textarea
        value={shapeProps.text}
        onChange={onChangeTextAreaHandler}
        onKeyDown={onKeyDown}
        style={style}
      />
    </Html>
  );
}
