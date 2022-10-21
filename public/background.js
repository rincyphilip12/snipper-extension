// /*global chrome*/

// let token;
let user;
// let bgToCsPort;
// ----------- CONFIG ----------
const config = {
  clientId: 'e59f0650bd3e4982896923830e670dd2de933221',
  clientSecret: "dc75f6a7f8a271a3fe950f6609e3019136549268"
}



//  ONE TIME CONNECTION
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)

  switch (request.cmd) {
    case "IS_LOGGEDIN":
      chrome.storage.local.get(['token'], function (result) {
        console.log('Value currently is ' + result.token);
        sendResponse(!!result.token);
      });
      return true;

    case "LOGIN":
      login(sendResponse);
      return true;

    case "CAPTURE_SCREENSHOT":
      captureScreenshot(sendResponse);
      return true;

    case 'FETCH':
      const { url, method, body, headers, isAbsolute, withoutAuth } = request;
      fetcher(url, method, body, headers, isAbsolute, withoutAuth, sendResponse);
      return true;
  }

});

// ----------- AUTH URL -----------
function generateAuthURL() {
  return `https://www.teamwork.com/launchpad/login?redirect_uri=${chrome.identity.getRedirectURL()}&client_id=${config.clientId}
  `;
}

// ------------- AUTH REQUEST BODY  ----------
function generateAuthReq(code) {
  return {
    "code": code,
    "client_secret": config.clientSecret,
    "redirect_uri": chrome.identity.getRedirectURL(),
    "client_id": config.clientId
  }
}

// -------------- CAPTURE SCREENSHOT -----------
function captureScreenshot(sendResponse) {

  chrome.tabs.captureVisibleTab(null, {}, function (dataUri) {
    console.log('screeennnssshiititt')
    sendResponse({ cmd: 'SENDING_DATA_URI', dataUri });
  });
}

// ----------- LOGIN METHOD -------
function login(sendResponse) {
  try {
    // 1. GET CODE FROM TEAM WORK API
    chrome.identity.launchWebAuthFlow({ 'url': generateAuthURL(), 'interactive': true }, function (redirectUrl) {
      if (redirectUrl) {
        const code = new URL(redirectUrl).searchParams.get('code');

        // 2. GET ACCESS TOKEN FROM TEAM WORK API
        if (!code) {
          throw new Error('signin error')
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
          const token = data.access_token;

          chrome.storage.local.set({ token: token }, function () {
            console.log('Value is set to ' + value);
          });
          user = data.user;
          console.log(data)
          sendResponse({ loggedIn: true });
        })
      }
      else {
        throw new Error('signin error')
      }
    });
  }
  catch (e) {
    console.log(e)
  }

}
//------------ FETCHER : COMMON METHOD FOR CALLING API-------------------

const fetcher = (url, method, body, headers, isAbsolute, withoutAuth, sendResponse) => {

  const BASE_URL = 'https://portal.whiterabbit.group/';

  chrome.storage.local.get(['token'], function (result) {
    let token = result.token;
    
    if (!token) {// Check if token is available
      console.log('Token is invalid', url)
      return;
    }

    const customHdrs = {
      ...(!withoutAuth && { 'Authorization': `Bearer ${token}` }),
      ...headers
    }

    let options = {
      method: method,
      headers: customHdrs
    }

    if (method !== 'GET') {// If Post/Put, add body payload
      options.body = body;
    }

    try {
      fetch(`${(isAbsolute) ? '' : BASE_URL}${url}`, options)
        .then(res => res.json()).
        then(data => {
          sendResponse(data)
        })

    }
    catch (err) {
      console.error(err)
    }
  });
}
