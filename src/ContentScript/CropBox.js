/* global chrome */

import { useImperativeHandle } from 'react';
import { ReactComponent as TickSVG } from './tick.svg';
import { useState, useRef, forwardRef, useEffect } from 'react';
const CropBox = forwardRef(({ snapshotCaptureHandler, filledBoxStyle, setFilledBoxStyle, isFabBtnActive }, ref) => {

    const filledBoxRef = useRef();
    const containerRef = useRef();
    const [lastMouseX, setLastMouseX] = useState(0);
    const [lastMouseY, setLastMouseY] = useState(0);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);


    //--------- USE EFFECT -------
    useEffect(() => {
        setFilledBoxStyle({
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            screenWidth: 0,
            screenHeight: 0

        })
    }, [])

    useImperativeHandle(ref, () => ({
        //----------- RESET CANVAS ---------
        resetCanvas() {
            setLastMouseX(0);
            setLastMouseY(0);
            setMouseX(0);
            setMouseY(0)
            setIsMouseDown(false);
            setFilledBoxStyle({
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                screenWidth: 0,
                screenHeight: 0
            })
        }
    }));

    //------------ CALCULATES RECTANGLE's CO-ORDINATES---------------
    const reCalc = () => {
        let x3 = parseInt(Math.min(lastMouseX, mouseX)); //Smaller X
        let x4 = parseInt(Math.max(lastMouseX, mouseX)); //Larger X
        let y3 = parseInt(Math.min(lastMouseY, mouseY)); //Smaller Y
        let y4 = parseInt(Math.max(lastMouseY, mouseY)); //Larger Y

        setFilledBoxStyle({
            width: x4 - x3,
            height: y4 - y3,
            top: y3,
            left: x3,
            screenWidth: containerRef?.current?.offsetWidth ?? 0,
            screenHeight: containerRef?.current?.offsetHeight ?? 0
        })
    }

    // ---------- MOUSE UP HANDLER ---------
    const mouseUpHandler = (e) => {
        setIsMouseDown(false);
    }

    // ---------- MOUSE DOWN HANDLER ---------

    const mouseDownHandler = (e) => {
        setLastMouseX(e.clientX);
        setLastMouseY(e.clientY);
        setIsMouseDown(true);
    }

    // ---------- MOUSE MOVE HANDLER ---------
    const mouseMoveHandler = (e) => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
        if (isMouseDown) {
            reCalc();
        }
    }

    return (<>
        <style>
            {`  
            .snapper-container{
                width:100vw;
                height:100vh;
                z-index:999998;
                top:0;
                position:fixed;
                cursor: crosshair;
            }
            .crop-box{
                position:absolute;
                border:1px solid grey;
                border-style:dashed;
            }
            .blk{
                background-color:rgba(0,0,0,0.5);
                position:absolute;
            }
            .top-blk{
                width:100%;
                top:0px;
                left:0px;
            }
            .left-blk{
                left:0px;
            }
            .right-blk{
                right:0;
            }
            .bottom-blk{
                left:0px;
                width:100%;
            }
            .marker-box{
                position:absolute;
            }

            .done-btn{
                width:50px;
                height:50px;
                border-radius:50%;
                border:none;
                padding:0;
                cursor:pointer;
            }
           `}
        </style>

        <section className='snapper-container' onMouseDown={(e) => { isFabBtnActive && mouseDownHandler(e) }}
            onMouseUp={(e) => { isFabBtnActive && mouseUpHandler(e) }}
            onMouseMove={(e) => { isFabBtnActive && mouseMoveHandler(e) }}
            ref={containerRef}>

            <div className="blk top-blk" style={{ height: filledBoxStyle.top }}></div>

            <div className="blk left-blk" style={{ top: filledBoxStyle.top, width: filledBoxStyle.left, height: filledBoxStyle.height + 2 }}></div>


            <div className="blk right-blk" style={{
                top: filledBoxStyle.top, left: filledBoxStyle.left + filledBoxStyle.width + 2, height: filledBoxStyle.height + 2, width: `calc(100vw - ${filledBoxStyle.left + filledBoxStyle.width}px)`
            }}></div>

            <div className="blk bottom-blk" style={{ top: filledBoxStyle.top + filledBoxStyle.height + 2, height: `calc(100vh - ${filledBoxStyle.top + filledBoxStyle.height}px)` }}></div>

            <div className="crop-box" style={filledBoxStyle} ref={filledBoxRef}></div>

            <div className="marker-box" style={{ left: filledBoxStyle.left, top: filledBoxStyle.top + filledBoxStyle.height, visibility: `${(filledBoxStyle.width > 0 || filledBoxStyle.height > 0) ? 'visible' : 'hidden'}` }}>
                <button className="done-btn" onClick={snapshotCaptureHandler}>
                    <TickSVG />
                </button>
            </div>
        </section>
    </>
    )
});

export default CropBox;