// /*global chrome*/

// --- LISTENING TO MSGS ACROSS THE PORT ---
chrome.runtime.onConnect.addListener((port) => {

  port.onMessage.addListener((payload) => {
    if (payload.msg === 'SCREENSHOT_CAPTURED') {

      // --------- CAPTURES SCREENSHOT and SENDS DATAURI----------
      chrome.tabs.captureVisibleTab(null, {}, function (dataUri) {
        port.postMessage({msg: 'SENDING_DATA_URI',dataUri})
      });
    }
  });
});

