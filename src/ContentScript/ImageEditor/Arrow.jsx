import React,{useEffect,useRef} from "react";
import { Arrow,Transformer } from "react-konva";

// export const addLine = (stage, layer, mode = "brush") => {
//     let isPaint = false;
//     let lastLine;
//     stage.on("mousedown touchstart", function (e) {
//         isPaint = true;
//         let pos = stage.getPointerPosition();
//         lastLine = new Konva.Arrow({
//             stroke: mode == "brush" ? "red" : "white",
//             strokeWidth: mode == "brush" ? 5 : 20,
//             globalCompositeOperation:
//                 mode === "brush" ? "source-over" : "destination-out",
//             points: [pos.x, pos.y],
//             draggable: mode == "brush",
//         });
//         layer.add(lastLine);
//     });
//     stage.on("mouseup touchend", function () {
//         isPaint = false;
//     });
//     stage.on("mousemove touchmove", function () {
//         if (!isPaint) {
//             return;
//         }
//         const pos = stage.getPointerPosition();
//         let newPoints = lastLine.points().concat([pos.x, pos.y]);
//         lastLine.points(newPoints);
//         layer.batchDraw();
//     });
// }
function ArrowNode({ shapeProps, isSelected, onSelect, onChange }) {
  //     console.log(pos)
  //     return <Arrow points={[0,0,100,100]} fill="red" stroke="red" draggable />;
  // }

  const shapeRef = useRef();
  const trRef = useRef();
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    } else {
      console.log(isSelected);
    }
  }, [isSelected]);

  return (
    <>
      <Arrow
        points={[0, 0, 100, 100]}
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
export default ArrowNode;
