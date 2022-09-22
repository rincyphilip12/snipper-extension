/*global chrome*/
import { useRef, useState, useEffect } from "react";
import CropBox from "./CropBox";
import PortalModal from "./PortalModal/PortalModal";
import Toast from "./Toast";
function ContentScript() {

  // ------- INITS -----

  const [isFabBtnActive, setIsFabBtnActive] = useState(false);
  const [isFabBtnVisible, setIsFabBtnVisible] = useState(false);
  const [portalModalData, setPortalModalData] = useState({});
  const [filledBoxStyle, setFilledBoxStyle] = useState({});
  const [toastMsg, setToastMsg] = useState('');
  const cropBoxRef = useRef();

  // ----------------------- SHOW TOAST MESSAGE ----------- 
  const showToastMessage = (msg, closeModal) => {
    setToastMsg(msg);
    if (closeModal)
      setTimeout(() => closePortalModalHandler(), 2000);
  }

  // --------  PORT -------- 
  let port = chrome.runtime.connect({ name: "FAB_BTN_PORT" });

  //----------------- MSG LISTENER FROM BACKGROUND SCRIPT -----------------
  port.onMessage.addListener((payload) => {

    switch (payload.msg) {
      case 'SENDING_DATA_URI':
        setPortalModalData({
          isOpen: true,
          dataUri: payload.dataUri
        })
        break;
    }
  });

  //------------------MSG LISTENER FROM POPUP ------------------
  chrome.runtime.onMessage.addListener(
    function (payload, sender, sendResponse) {
      switch (payload.msg) {
        case 'POPUP_SWITCH_STATUS':
          setIsFabBtnVisible(payload.popupSwitchStatus === 'on');
          sendResponse({ msg: "RECEIVED-POPUP-SWITCH_STATUS" });
          break;
      }
    }
  );

  //--------- FAB BTN CLICK HANDLER --------
  const fabBtnClickHandler = () => {
    setIsFabBtnActive(isFabBtnActive => {
      const newBtnMode = !isFabBtnActive;
      if (!newBtnMode)
        cropBoxRef.current.resetCanvas();
      return newBtnMode;
    });
  }

  //--------- CLOSE MODAL HANDLER -----
  const closePortalModalHandler = () => {
    setPortalModalData({
      isOpen: false,
      dataUri: null
    })
  }

  //----------- RENDER FUNCTION ------
  return (
    <>

      {/* ----- STYLES ----  */}
      <style>
        {
          `.fab{
              bottom: 10px;
              right: 10px;
              position: fixed;
              z-index: 999999;
              border: none;
              border-radius: 50%;
              width: 57px;
              height: 57px;
              color:white;
              font-size:24px;
              font-weight:800;
              background:black;
              cursor:pointer;
          }
          .fab.on-mode{
            background:white;
            color:black;
            box-shadow: 0px 0px 40px 4px #fff, 0px 0px 0px 2px rgb(255 255 255 / 19%);
          }
          .fab.off-mode{
            background:black;
          }

        
        `}
      </style>

      {/* ---- FAB BTN ----*/}

      {isFabBtnVisible && <button className={`fab ${isFabBtnActive ? 'on-mode' : 'off-mode'}`} type="button" onClick={fabBtnClickHandler}>S</button>}

      {/*---- CROP BOX ----- */}
      {isFabBtnActive &&
        <CropBox port={port} ref={cropBoxRef} filledBoxStyle={filledBoxStyle} setFilledBoxStyle={setFilledBoxStyle} isFabBtnActive={isFabBtnActive} />
      }

      {/* --- MODAL --- */}
      {portalModalData?.isOpen &&
        <PortalModal imageData={{ dataUri: portalModalData?.dataUri, coords: filledBoxStyle }}
          closePortalModalHandler={closePortalModalHandler} showToastMessage={showToastMessage} />}

      {/* ---------------TOAST---------------- */}
      <Toast toastMsg={toastMsg} setToastMsg={setToastMsg} />
    </>
  );
}

export default ContentScript;



