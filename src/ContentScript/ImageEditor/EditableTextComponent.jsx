import React, { useState } from "react";
import EditableTextUsage from './EditableTextUsage';
function EditableTextComponent ({x,y})  {
  const [text, setText] = useState("Click to resize. Double click to edit.");
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [selected, setSelected] = useState(false);

  return (
    
        <EditableTextUsage
          x={x}
          y={y}
          text={text}
          colour="#FFDAE1"
          width={width}
          height={height}
          selected={selected}
          onTextChange={(value) => setText(value)}
          onTextResize={(newWidth, newHeight) => {
            setWidth(newWidth);
            setHeight(newHeight);
          }}
          onClick={() => {
            setSelected(!selected);
          }}
          onTextClick={(newSelected) => {
            setSelected(newSelected);
          }}
        />
  );
};

export default EditableTextComponent;
