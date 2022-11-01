import React, { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";

export function ResizableText({
  shapeProps,
  isSelected,
  onClick,
  onDoubleClick,
  onChangeHandler,
}) {
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {

    if (isSelected && transformerRef.current !== null) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  function handleResize() {
    if (textRef.current !== null) {
      const textNode = textRef.current;
      const newWidth = textNode.width() * textNode.scaleX();
      const newHeight = textNode.height() * textNode.scaleY();
      textNode.setAttrs({
        width: newWidth,
        scaleX: 1,
      });
      // onResize(newWidth, newHeight);
      onChangeHandler({
        ...shapeProps,
        width: newWidth,
        scaleX: 1,
      });
    }
  }


  const onDblClickHandler = (e) => {
    if(transformerRef.current) 
    transformerRef.current.show();
    onDoubleClick(e);
  };

  const transformer = isSelected && (
    <Transformer
      ref={transformerRef}
      rotateEnabled={false}
      flipEnabled={false}
      enabledAnchors={["middle-left", "middle-right"]}
      boundBoxFunc={(oldBox, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      }}
    />
  );

  return (
    <>
      <Text
        {...shapeProps}
        ref={textRef}
        perfectDrawEnabled={false}
        onTransform={handleResize}
        onClick={onClick}
        onTap={onClick}
        onDblClick={onDblClickHandler}
        onDblTap={onDblClickHandler}
        onDragEnd={(e) => {
          onChangeHandler({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        draggable={true}
      />
      {transformer}
    </>
  );
}
