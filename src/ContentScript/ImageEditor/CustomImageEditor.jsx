import SceneWithDrawables from "./SceneWithDrawables";

function CustomImageEditor({
  coords,
  dataUri,
  uploadScreenshot,
}) {
  return (
    <SceneWithDrawables
      coords={coords}
      uploadScreenshot={uploadScreenshot}
      dataUri={dataUri}
    />
  );
}

export default CustomImageEditor;
