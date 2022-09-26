import { useLayoutEffect, useRef, useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import TaskDetailForm from './TaskDetailForm';
function PortalModal({ imageData: { dataUri, coords }, closePortalModalHandler, showToastMessage }) {

    const previewImageCanvasRef = useRef(null);
    const [formActive, setFormActive] = useState(false);
    const [isLoaderOn, setIsLoaderOn] = useState(false);
    const [projects, setProjects] = useState([]);
    const pendingFileRef = useRef();
    const encodedToken = useRef();

    // ------------------- INIT FUNCTION  - GETS SAVED CREDS-----------------------
    useEffect(() => {
        try {
            getStoredEncodedToken();

        }
        catch (e) {
            console.error(e)
        }
    }, []);


    // ----------------- IMAGE CREATION FROM CO-ORDINATES ----------------------------------
    useLayoutEffect(() => {
        try {
            processDataURItoImage();
        }
        catch (e) {
            console.error(e)
        }
    });

    // ----------------- PROCESS DATA URI TO IMAGE -------------------
    const processDataURItoImage = () => {
        var img = new Image();
        img.src = dataUri;
        img.onload = function () {
            const aspectRatioY = img.height / coords.screenHeight;
            const aspectRatioX = img.width / coords.screenWidth;
            previewImageCanvasRef.current.width = coords.width * aspectRatioX;
            previewImageCanvasRef.current.height = coords.height * aspectRatioY;
            const context = previewImageCanvasRef.current.getContext('2d');
            context.drawImage(img, coords.left * aspectRatioX + 2, coords.top * aspectRatioY + 2, coords.width * aspectRatioX, coords.height * aspectRatioY, 0, 0, previewImageCanvasRef.current.width, previewImageCanvasRef.current.height);
        };
    }

    // --------------GET PROJECTs LIST from API AND SHOW DETAILS FORM --------------
    const getProjects = async (firstTimeLoginCreds) => {
        try {
            showLoader(true);
            const res = await fetcher("projects.json", 'GET');
            if (res?.STATUS === 'OK') {
                setFormActive('details');
                showLoader(false);
                setProjects(res?.projects || []);
                uploadScreenshot();
                if (firstTimeLoginCreds) // saves userid password of first time login users
                    await navigator.credentials.store(firstTimeLoginCreds);
            }
            else
                throw new Error('get projects failed')
        }
        catch (e) {
            showLoader(false);
            showToastMessage('Incorrect Credentials')
        }
    }


    // ----------------- SUBMIT LOGIN INFO ----------------------------------

    const submitLoginFormHandr = async (username, pwd) => {
        try {
            if (window.PasswordCredential || window.FederatedCredential) {

                if (username && pwd)
                    encodedToken.current = (btoa(`${username}:${pwd}`));
                else {
                    showToastMessage('Enter the credentials')
                    return
                }
                const creds = new window.PasswordCredential({
                    id: username,
                    password: pwd,
                    name: username
                });

                getProjects(creds);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    // ------------------- GET STORED ENCODED TOKEN ------------
    const getStoredEncodedToken = async () => {
        showLoader(true);
        try {
            const userCreds = await navigator.credentials.get({
                password: true,
                federated: {
                    providers: [
                        'https://accounts.google.com'
                    ]
                },
                unmediated: true
            });

            if (userCreds?.id && userCreds?.password) {// CREDS ALREADY AVAILABLE
                encodedToken.current = (btoa(`${userCreds?.id}:${userCreds?.password}`));
                getProjects();
            }
            else {

                throw new Error('credentials retrieving failed')
            }
        }
        catch (e) {
            console.log(e)
            setFormActive('login');
            showLoader(false);
        }

    }
    //------------------UPLOAD SCREENSHOTS------------

    const uploadScreenshot = async () => {
        try {
            previewImageCanvasRef.current.toBlob(async (blob) => {
                const convertedFile = new File([blob], "sample.jpeg", { type: "image/jpeg" });
                const formData = new FormData();
                formData.append('file', convertedFile);
                const res = await fetcher(`pendingfiles.json`, 'POST', formData);
                if (res?.pendingFile)
                    pendingFileRef.current = res.pendingFile?.ref;
                else throw new Error(res?.STATUS)
            }, 'image/jpeg');

        }
        catch (e) {
            console.error(e)
        }
    }


    //------------ FETCHER : COMMON METHOD FOR CALLING API-------------------

    const fetcher = async (url, method, body, headers, isAbsolute, withoutAuth) => {

        const BASE_URL = 'https://portal.whiterabbit.group/';

        if (!encodedToken.current) {// Check if token is available
            showToastMessage('Token is invalid', url)
            return;
        }

        const customHdrs = {
            ...(!withoutAuth && { 'Authorization': `Basic ${encodedToken.current}` }),
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
            const response =
                await fetch(
                    `${(isAbsolute) ? '' : BASE_URL}${url}`, options);
            return await response.json();
        }
        catch (err) {
            console.error(err)
        }
    }


    const showLoader = (status) => {
        setIsLoaderOn(status);
    }
    return (<>
        <style>
            {` /* The Modal (background) */
          .modal {
            font-family: "Roboto", sans-serif;
            position: fixed; /* Stay in place */
            z-index: 1000000; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
         
          }

          /* Modal Content/Box */
          .modal-content {
            background-color: #fefefe;
            margin: 2% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
            max-width:1080px;
            border-radius:10px;
            position: relative;
          }
          .modal-content header{
              padding-bottom:26px;
              position:relative
          }
          .modal-content header:after{
              content:'';
              position:absolute;
              left:50%;
              transform: translateX(-50%);
              bottom:0;
              width:calc(100% + 40px);
              height:1px;
              background:rgba(0,0,0,0.12);
          }
          .modal-header-text{
              display:block;
              font-size:20px;
              line-height:32px;
          }
          .screenshot-wrapper{
            max-height: 80vh;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-wrap: wrap;
            padding-top:20px;
          }
          .screenshot__form{
            flex-basis: 40%;
            padding-right:40px;
          }

          #preview-image{
              border:1px dashed;
                max-width:100%;
          }
          /* The Close Button */
          .close {
            color: #343434;
            position:absolute;
            top:10px;
            right:0;
            display:flex;
            transition:0.3s ease-in-out
          }

          .close:hover,
          .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
            transform:scale(1.1);
          }
          .result-preview{
            max-height:500px;
        }
        input,
        select,
        textarea{
            height:32px;
            padding: 0 5px;
            color: #333;
            border:1px solid #cfcfcf;
            border-radius: 3px;
            width:100%;
        }
        textarea{
            height:96px;
            resize:none;
        }
        *{
            box-sizing:border-box;
            margin:0;
            padding:0;
        }
        h1,h2,h3,h4,h5,h6,p,.l-title{
            color:#343434;
        }
        .l-title{
            margin-bottom:20px;
        }
        .l-title--xs{
            font-size:14px;
            line-height:20px;
            margin-bottom:10px;
            font-weight:400;
            color:#333333;
        }
        .l-btn{
            background: #343434;
            border: none;
            color: #fff;
            padding: 10px 20px;
            transition:0.3s ease-in-out;
            cursor:pointer;
        }
        .l-btn--dark{
            background: #343434;
        }
        .l-btn--dark:hover{
            background:#000;
        }
        .l-btn:hover{
            background:#000;
        }
        .l-row{
            display:flex;
            flex-wrap:wrap;
            margin:0 -10px;
        }
        .l-row .l-col{
            padding: 0 10px;
        }
        .l-col{
            margin-bottom:24px;
        }
        .l-col--3{
            flex-basis:25%;
        }
        .l-col--4{
            flex-basis: 33.33333333%;
        }
        .l-col--6{
            flex-basis:50%;
        }
        label span{
            display:inline-block;
            margin-bottom:6px;
            color:#555555;
            font-size:13px;
            line-height:19px;
        }
        .screenshot__preview{
            flex-basis: 60%;
        }
        .screenshot__preview .l-title{
            font-size: 13px;
            line-height:19px;
            color: #555555;
            margin-bottom:6px;
            font-weight:400;
        }
        .screenshot-wrapper::-webkit-scrollbar {
            width: 8px;
        }
        .screenshot-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .screenshot-wrapper::-webkit-scrollbar-thumb {
            background: #343434;
        }
        .screenshot-wrapper::-webkit-scrollbar-thumb:hover {
            background: #000;
        }
        .loader-wrap{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.4);
            display:none;
            border-radius:9px;
        }
        .loader-wrap.is-active{
            display:block;
        }
        .loader-wrap span {
           width:45px;
           height:45px;
           top: 50%;
           left: 50%;
           transform: translate(-50%,-50%);
           position: absolute;
           display:inline-block;
           padding:0px;
           border-radius:100%;
           border:5px solid;
           border-top-color: rgba(255, 255, 255, 1);
           border-bottom-color: rgba(255,255,255, 0.3);
           border-left-color: rgba(255, 255, 255, 1);
           border-right-color: rgba(255,255,255, 0.3);
           -webkit-animation: loader4 1s ease-in-out infinite;
           animation: spinner 1s ease-in-out infinite;
        }
        @keyframes spinner {
           from {transform: rotate(0deg);}
           to {transform: rotate(360deg);}
        }
        @-webkit-keyframes spinner {
           from {-webkit-transform: rotate(0deg);}
           to {-webkit-transform: rotate(360deg);}
        }`
            }
        </style>



        <div id="portalModal" className="modal" >

            {/* <!-- Modal content --> */}
            <div className="modal-content">

                {/* ---------- LOADER -------------- */}
                <div className={`loader-wrap ${isLoaderOn ? 'is-active' : ''}`} >
                    <span></span>
                </div>
                {/* ---------- HEADER ------- */}
                <header>
                    <h1 className="modal-header-text">Portal App - White Rabbit Group</h1>
                    <span className="close" onClick={closePortalModalHandler}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.03125 5L10.25 1.8125L10.9062 1.15625C11 1.0625 11 0.90625 10.9062 0.78125L10.2188 0.09375C10.0938 0 9.9375 0 9.8438 0.09375L6 3.96875L2.125 0.09375C2.03125 0 1.875 0 1.75 0.09375L1.0625 0.78125C0.96875 0.90625 0.96875 1.0625 1.0625 1.15625L4.9375 5L1.0625 8.875C0.96875 8.9688 0.96875 9.125 1.0625 9.25L1.75 9.9375C1.875 10.0312 2.03125 10.0312 2.125 9.9375L6 6.0625L9.1875 9.2812L9.8438 9.9375C9.9375 10.0312 10.0938 10.0312 10.2188 9.9375L10.9062 9.25C11 9.125 11 8.9688 10.9062 8.875L7.03125 5Z" fill="#0B0E1F"/>
                    </svg>

                    </span>
                </header>
                <div className="screenshot-wrapper">
                    <div className="screenshot__form">

                        {/* ------------- LOGIN ------------ */}
                        {
                            formActive === 'login' && <LoginForm submitLoginFormHandr={submitLoginFormHandr} showToastMessage={showToastMessage} />
                        }

                        {/* ----------- DETAILS ---------- */}
                        {
                            formActive === 'details' && <TaskDetailForm
                                pendingFileRef={pendingFileRef} projects={projects} fetcher={fetcher} showToastMessage={showToastMessage} showLoader={showLoader} />

                        }
                    </div>
                    {/* ------------- IMAGE PREVIEW -------------- */}
                    <div className="screenshot__preview">
                        <h2 className="l-title l-title--xs">Image preview</h2>
                        <canvas className="result-preview" id="preview-image" ref={previewImageCanvasRef} >
                        </canvas>
                    </div>

                </div>
            </div>
        </div>


    </>
    )
}

export default PortalModal;
