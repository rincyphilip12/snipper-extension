/*global chrome*/

import { useEffect, useRef, useState } from "react";

function Popup() {
  const toggleRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const tab = useRef();
  useEffect(() => {
    chrome.runtime.sendMessage(
      { cmd: "IS_LOGGEDIN" },
      response => {
        setIsLoggedIn(response.loggedIn);
        setUserData(response.userData);
      }
    );

    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        tab.current = tabs[0].id;
      }
    );
  }, []);

  // ------------- SWITCH ON / OFF NOTIFIER TO CONTENT SCRIPT ---------------
  const toggleSwitchHandler = () => {
    const msg = {
      cmd: "POPUP_SWITCH_STATUS",
      popupSwitchStatus: toggleRef.current.checked
        ? "on"
        : "off",
    };

    chrome.tabs.sendMessage(
      tab.current,
      msg,
      function (response) {
        console.log(response);
      }
    );
  };

  // ------------ ON LOGIN --------
  const onLoginHandler = () => {
    chrome.runtime.sendMessage(
      { cmd: "LOGIN" },
      response => {
        setIsLoggedIn(response.loggedIn);
        setUserData(response.userData);
      }
    );
  };

  // ----------- ON LOGOUT ------
  const onLogoutHandler = () => {
    chrome.runtime.sendMessage(
      { cmd: "LOGOUT" },
      response => {
        console.log("logot");
        console.log(response);
        setIsLoggedIn(!response.loggedOut);
      }
    );
  };
  // ----------------- RENDER METHOD ----------------------
  return (
    <div className="App">
      <style>
        {`

        .App {
          text-align: center;
          height: 100%;
          width: 300px;
        }

        .App-header {
          background-color: #282c34;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: calc(10px + 2vmin);
          color: white;
        }

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

        {!isLoggedIn && (
          <button type="button" onClick={onLoginHandler}>
            Login
          </button>
        )}

        {/* <!-- Rounded switch --> */}
        {isLoggedIn && (
          <>
            {userData && (
              <div>
                Welcome {userData.firstName}{" "}
                {userData.lastName}
              </div>
            )}
            <label className="switch">
              <input
                type="checkbox"
                ref={toggleRef}
                onClick={toggleSwitchHandler}
              />
              <span className="slider round"></span>
            </label>
            <button type="button" onClick={onLogoutHandler}>
              Logout
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default Popup;
