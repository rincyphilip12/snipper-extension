/*global chrome*/

import "./Popup.css";
import { useRef } from "react";

function Popup() {

  const toggleRef = useRef(null);

  // ------------- SWITCH ON / OFF NOTIFIER TO CONTENT SCRIPT --------------- 
  const toggleSwitchHandler = () => {
    const msg = {
      msg: 'POPUP_SWITCH_STATUS',
      popupSwitchStatus: toggleRef.current.checked ? 'on' : 'off'
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0].id;
      chrome.tabs.sendMessage(tab, msg, function (response) {
        console.log(response);
      });
    });
  }


  // ----------------- RENDER METHOD ----------------------
  return (
    <div className="App">

      <style>
        {`
        /* The switch - the box around the slider */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        
        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #2196F3;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        
        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
        
        /* Rounded sliders */
        .slider.round {
          border-radius: 34px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }`}
      </style>
      <main className="App-header">
        <h1>PORTAL SNAPPER</h1>

        {/* <!-- Rounded switch --> */}
        <label className="switch">
          <input type="checkbox" ref={toggleRef} onClick={toggleSwitchHandler} />
          <span className="slider round"></span>
        </label>

      </main>
    </div>
  );
}

export default Popup;
