/*global chrome*/

import "./Popup.css";
import { useEffect, useRef, useState } from "react";

function Popup() {

  const toggleRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const tab = useRef();
  useEffect(
    () => {
      chrome.runtime.sendMessage({ cmd: 'IS_LOGGED_IN' }, response => {
        setIsLoggedIn(response);
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        tab.current = tabs[0].id;
      });
    }, []
  )

  // ------------- SWITCH ON / OFF NOTIFIER TO CONTENT SCRIPT --------------- 
  const toggleSwitchHandler = () => {
    const msg = {
      cmd: 'POPUP_SWITCH_STATUS',
      popupSwitchStatus: toggleRef.current.checked ? 'on' : 'off'
    }

    chrome.tabs.sendMessage(tab.current, msg, function (response) {
      console.log(response);
    });

  }

  // ------------ ON LOGIN -------- 
  const onLoginHandler = () => {
    chrome.runtime.sendMessage({ cmd: "LOGIN" }, response => {
      // current user details
      setIsLoggedIn(response.loggedIn)
      console.log(response, "<<<")
    })
  }

  // ----------------- RENDER METHOD ----------------------
  return (
    <div className="App">
      <main className="min-w-full">
        <h1>PORTAL SNAPPER</h1>


        {/* Show current user details */}
        {!isLoggedIn && <button type="button" onClick={onLoginHandler}>Login</button>}

        {/* <!-- Rounded switch --> */}
        {isLoggedIn && <label className="switch">
          <input type="checkbox" ref={toggleRef} onClick={toggleSwitchHandler} />
          <span className="slider round"></span>
        </label>}

      </main>
    </div>
  );
}

export default Popup;
