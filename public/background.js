// /*global chrome*/

let user;

// ----------- CONFIG ----------
const config = {
  clientId: "e59f0650bd3e4982896923830e670dd2de933221",
  clientSecret: "dc75f6a7f8a271a3fe950f6609e3019136549268",
};

//  ONE TIME CONNECTION
chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(request);

  switch (request.cmd) {
    case "IS_LOGGEDIN":
      chrome.storage.local.get(null, function (result) {
        console.log('Value currently is ' + result.token);
        console.log('Value currently is ' + result.userData);

        sendResponse({ loggedIn: !!result.token, userData: result.userData });
      });
      return true;

    case "LOGIN":
      login(sendResponse);
      return true;

    case "LOGOUT":
      logout(sendResponse);
      return true;

    case "CAPTURE_SCREENSHOT":
      captureScreenshot(sendResponse);
      return true;

  }
});

// ----------- AUTH URL -----------
function generateAuthURL() {
  return `https://www.teamwork.com/launchpad/login?redirect_uri=${chrome.identity.getRedirectURL()}&client_id=${
    config.clientId
  }
  `;
}

// ------------- AUTH REQUEST BODY  ----------
function generateAuthReq(code) {
  return {
    code: code,
    client_secret: config.clientSecret,
    redirect_uri: chrome.identity.getRedirectURL(),
    client_id: config.clientId,
  };
}

// -------------- CAPTURE SCREENSHOT -----------
function captureScreenshot(sendResponse) {
  chrome.tabs.captureVisibleTab(
    null,
    {},
    function (dataUri) {
      sendResponse({ cmd: "SENDING_DATA_URI", dataUri });
    }
  );
}

// ----------- LOGOUT METHOD -------
function logout(sendResponse) {
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      sendResponse({ loggedOut: false })
      console.error(error);
    }
    sendResponse({ loggedOut: true })
    // do something more
  });
}

// ----------- LOGIN METHOD -------
function login(sendResponse) {
  try {
    // 1. GET CODE FROM TEAM WORK API
    chrome.identity.launchWebAuthFlow(
      { url: generateAuthURL(), interactive: true },
      function (redirectUrl) {
        if (redirectUrl) {
          const code = new URL(
            redirectUrl
          ).searchParams.get("code");

          // 2. GET ACCESS TOKEN FROM TEAM WORK API
          if (!code) {
            throw new Error("signin error");
          }

          console.log(">>>>", generateAuthReq(code));
          fetch(
            "https://www.teamwork.com/launchpad/v1/token.json",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(generateAuthReq(code)),
            }
          )
            .then(res => res.json())
            .then(data => {
              // 3. STORE ACCESS TOKEN

              chrome.storage.local.set(
                {
                  token: data.access_token,
                  userData: data.user,
                },
                function () {
                  console.log("Value is set to " + value);
                }
              );
              sendResponse({
                loggedIn: true,
                userData: data.user,
              });
            });
        } else {
          throw new Error("signin error");
        }

        fetch('https://www.teamwork.com/launchpad/v1/token.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(generateAuthReq(code))
        }).then(res => res.json()
        ).then(data => {
          // 3. STORE ACCESS TOKEN

          chrome.storage.local.set({ token: data.access_token, userData: data.user }, function () {
            console.log('Value is set to ' + value);
          });
          sendResponse({ loggedIn: true, userData: data.user });
        })
      }
    );
  } catch (e) {
    console.log(e);
  }
}
