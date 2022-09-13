import { useLayoutEffect, useRef, useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import TaskDetailForm from './TaskDetailForm';

function PortalModal({ imageData: { dataUri, coords }, closePortalModalHandler }) {

    const previewImageCanvasRef = useRef(null);
    const [formActive, setFormActive] = useState(false);
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
    const getProjects = async () => {
        try {
            const res = await fetcher("projects.json", 'GET');
            if (res?.STATUS === 'OK') {
                setFormActive('details');
                setProjects(res?.projects || []);
                uploadScreenshot();
            }
            else
                throw new Error('get projects failed')
        }
        catch (e) {
            console.error('incorrect username password')
        }
    }


    // ----------------- SUBMIT LOGIN INFO ----------------------------------
    // u
    const submitLoginFormHandr = async (username, pwd) => {
        try {
            if (window.PasswordCredential || window.FederatedCredential) {

                const creds = new window.PasswordCredential({
                    id: username,
                    password: pwd,
                    name: username
                });

                const res = await navigator.credentials.store(creds);
                if (username && pwd)
                    encodedToken.current = (btoa(`${username}:${pwd}`));
                else
                    alert('Enter the credentials')
                getProjects();
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    // ------------------- GET STORED ENCODED TOKEN ------------
    const getStoredEncodedToken = async () => {
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

            if (userCreds?.password && userCreds?.password) {// CREDS ALREADY AVAILABLE
                encodedToken.current =(btoa(`${userCreds?.id}:${userCreds?.password}`)); 
                getProjects();
            }
            else {
                setFormActive('login');
                throw new Error('credentials retrieving failed')
            }
        }
        catch (e) {
            console.error(e)
            setFormActive('login')
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
                else throw new Error(res.STATUS)
            }, 'image/jpeg');

        }
        catch (e) {
            console.error(e)
        }
    }


    //------------ FETCHER : COMMON METHOD FOR CALLING API-------------------

    const fetcher = async (url, method, body, headers, isAbsolute, withoutAuth) => {

        const BASE_URL = 'https://portal.whiterabbit.group/';
        const HEADER = {
            // "Content-type": "application/json",
        }
        console.log(encodedToken)
        if (!encodedToken.current) {// Check if token is available
            alert('Token is invalid', url)
            return;
        }

        const customHdrs = {
            ...HEADER,
            ...(!withoutAuth && { 'Authorization': `Basic ${encodedToken.current}` }),
            ...headers
        }

        console.log(customHdrs)

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

    return (<>
        <style>
            {` /* The Modal (background) */
          .modal {
            font-family: "Roboto", sans-serif;
            display:block;
            position: fixed; /* Stay in place */
            z-index: 1000000; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
         
          }

          /* Modal Content/Box */
          .modal-content {
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
            border-radius:20px;

          }
          .modal-header-text{
              display:inline-block;
          }

          #preview-image{
              border:1px dashed;
                max-width:100%;
          }
          /* The Close Button */
          .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close:hover,
          .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }`
            }
        </style>

        <div id="portalModal" class="modal" >

            {/* <!-- Modal content --> */}
            <div class="modal-content">

                <header>
                    <h1 class="modal-header-text">PORTAL APP - WHITE RABBIT GROUP</h1>
                    <span class="close" onClick={closePortalModalHandler}>&times;</span>
                </header>

                {/* ------------ LOGIN -------------  */}
                {
                    formActive === 'login' && <LoginForm submitLoginFormHandr={submitLoginFormHandr} />
                }

                {
                    formActive === 'details' && <TaskDetailForm pendingFileRef={pendingFileRef} projects={projects} fetcher={fetcher} />

                }
                {/* ------------- IMAGE PREVIEW -------------- */}
                <section>
                    <h3>IMAGE PREVIEW</h3>
                    <canvas id="preview-image" ref={previewImageCanvasRef} >
                    </canvas>
                </section>
            </div>
        </div>
    </>
    )
}

export default PortalModal;
