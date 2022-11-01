/* global chrome*/

import { useRef, useEffect, useState } from "react";
import CustomImageEditor from "../ImageEditor/CustomImageEditor";
import TaskDetailForm from "./TaskDetailForm";

function PortalModal({
    imageData: { dataUri, coords },
    closePortalModalHandler,
    showToastMessage,
}) {
    const [isLoaderOn, setIsLoaderOn] = useState(false);
    const [projects, setProjects] = useState([]);
    const pendingFileRef = useRef();
    const [showTaskDetailForm, setShowTaskDetailForm] = useState(false);
    useEffect(() => {
        getProjects();
    }, [])

    // --------------GET PROJECTs LIST from API AND SHOW DETAILS FORM --------------
    const getProjects = async () => {
        try {
            showLoader(true);
            const res = await fetcher("projects.json", 'GET');
            if (res?.STATUS === 'OK') {
                showLoader(false);
                setProjects(res?.projects || []);
            }
            else
                throw new Error('get projects failed')

        }
        catch (e) {
            showLoader(false);
        }
    };

    //------------------UPLOAD SCREENSHOTS------------
    const uploadScreenshot = async (blob) => {
        try {
            const convertedFile = new File([blob], "sample.jpeg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append('file', convertedFile);
            const res = await fetcher(`pendingfiles.json`, 'POST', formData);
            showLoader(true);
            if (res?.pendingFile) {
                pendingFileRef.current = res.pendingFile?.ref;
                showLoader(false);
                showToastMessage('Image has been uploaded successfully.');
                setShowTaskDetailForm(true)
            }
            else throw new Error(res?.STATUS)
        }
        catch (e) {
            console.error(e)
            showToastMessage('Error in Image Upload.')
            setShowTaskDetailForm(false);
            showLoader(false);
        }

    };

    // -------------- SHOW LOADER -------------------
    const showLoader = status => {
        setIsLoaderOn(status);
    };


    //------------ FETCHER : COMMON METHOD FOR CALLING API-------------------
    const fetcher = async (url, method, body, headers, isAbsolute, withoutAuth) => {

        const BASE_URL = 'https://portal.whiterabbit.group/';

        let token = await readLocalStorage('token');

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
            const res = await fetch(`${(isAbsolute) ? '' : BASE_URL}${url}`, options);
            const data = await res.json();
            return data;
        }
        catch (err) {
            console.error(err)
        }
    }

    //-------  READ FROM LOCAL STORAGE ---------
    const readLocalStorage = async (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], function (result) {
                if (result[key] === undefined) {
                    reject();
                } else {
                    resolve(result[key]);
                }
            });
        });
    };

    // --------------- RENDER -----------------

    return (
        <>
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
        }`}
            </style>
            <div id="portalModal" className="modal">
                {/* <!-- Modal content --> */}
                <div className="modal-content">

                    {/* ---------- LOADER -------------- */}
                    <div className={`loader-wrap ${isLoaderOn ? 'is-active' : ''}`} >
                        <span></span>
                    </div>
                    {/* ---------- HEADER ------- */}
                    <header>
                        <h1 className="modal-header-text">PORTAL APP - WHITE RABBIT GROUP</h1>
                        <span className="close" onClick={closePortalModalHandler}>&times;</span>
                    </header>
                    <div className="screenshot-wrapper">

                        {/* ------------- IMAGE PREVIEW -------------- */}
                        {!showTaskDetailForm && <div className="screenshot__preview">
                            <h2 className="l-title l-title--sm">IMAGE PREVIEW</h2>
                            <CustomImageEditor
                                coords={coords}
                                dataUri={dataUri}
                                uploadScreenshot={uploadScreenshot}
                                
                            />  
                        </div>}

                        {/* ----------- DETAILS FORM ---------- */}
                        {showTaskDetailForm && <div className="screenshot__form">
                            <TaskDetailForm
                                pendingFileRef={pendingFileRef} projects={projects} fetcher={fetcher} showToastMessage={showToastMessage} showLoader={showLoader} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PortalModal;
