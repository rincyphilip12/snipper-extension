import { useCallback, useEffect } from 'react'

const Toast = ({ toastMsg, setToastMsg }) => {

    const deleteToast = useCallback(() => {
        setToastMsg('');
    }, [toastMsg, setToastMsg]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (toastMsg) {
                deleteToast(toastMsg);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [toastMsg, deleteToast]);

    return (
        <>
            <style>
                {`.notification-container {
                        font-size: 14px;
                        box-sizing: border-box;
                        position: fixed;
                        z-index: 999999999;
                        font-family: "Roboto", sans-serif;
                    }

                    .top-right {
                        top: 12px;
                        right: 12px;
                        transition: transform .6s ease-in-out;
                        animation: toast-in-right .7s;
                    }

                    .notification {
                        background: #fff;
                        transition: .3s ease;
                        position: relative;
                        pointer-events: auto;
                        overflow: hidden;
                        margin: 0 0 6px;
                        padding: 30px;
                        margin-bottom: 15px;
                        width: 300px;
                        max-height: 100px;
                        border-radius: 3px 3px 3px 3px;
                        box-shadow: 0 0 10px #999;
                        color: #000;
                        opacity: .9;
                        background-position: 15px;
                        background-repeat: no-repeat;
                    }

                    .notification:hover {
                        box-shadow: 0 0 12px #fff;
                        opacity: 1;
                        cursor: pointer
                    }

                    .notification-title {
                        font-weight: 700;
                        font-size: 16px;
                        text-align: left;
                        margin-top: 0;
                        margin-bottom: 6px;
                        width: 300px;
                        height: 18px;
                    }

                    .notification-message {
                        margin: 0;
                        text-align: left;
                        height: 18px;
                        margin-left: -1px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .toast {
                        height: 75px;
                        width: 365px;
                        color: #fff;
                        padding: 20px 15px 10px 10px;
                    }

                    .notification-container button {
                        position: relative;
                        right: -.3em;
                        top: -.3em;
                        float: right;
                        font-weight: 700;
                        color: black;
                        outline: none;
                        border: none;
                        text-shadow: 0 1px 0 #fff;
                        opacity: .8;
                        line-height: 1;
                        font-size: 16px;
                        padding: 0;
                        cursor: pointer;
                        background: 0 0;
                        border: 0
                    }

                    @keyframes toast-in-right {
                        from {
                        transform: translateX(100%);
                        
                        }
                        to {
                        transform: translateX(0);
                        }
                    }

`}
            </style>


            <div className="notification-container top-right">
                {
                    toastMsg &&
                    <div className="notification toast top-right" >
                        <button onClick={() => deleteToast()}>X</button>
                        <div>
                            <p className="notification-title">Notification</p>
                            <p className="notification-message">{toastMsg}</p>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Toast