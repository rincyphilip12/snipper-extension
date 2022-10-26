/* global chrome */

import { useLayoutEffect, useRef, useState } from 'react';
function TaskDetailForm({ pendingFileRef, projects, showToastMessage, showLoader, fetcher }) {

    const [taskList, setTaskLists] = useState([]);
    const selectedTaskId = useRef();
    const selectedProjectId = useRef();
    const selectedPriority = useRef();
    const contentRef = useRef();
    const descriptionRef = useRef();
    const [taskListLoader, setTaskListLoader] = useState(false);

    // -------- ON LOAD ------
    useLayoutEffect(() => {
        getBrowserOSDetails()
    }, []);

    // ---------- GET BROWSER DETAILS : DISPLAY OS AND BROWSER DETAILS IN THE TEXTAREA -----
    const getBrowserOSDetails = () => {
        const nAgt = navigator.userAgent;
        // -------- BROWSER INFO ----------
        // In Chrome, the true version is after "Chrome" 
        const browserName = "Chrome";
        const verOffset = nAgt.indexOf("Chrome");
        let fullVersion = nAgt.substring(verOffset + 7);
        let ix;
        let OSName = "Unknown OS";

        // trim the fullVersion string at semicolon/space if present

        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        // ----- OS INFO -----

        if (nAgt.indexOf("Win") != -1) OSName = "Windows";
        if (nAgt.indexOf("Mac") != -1) OSName = "MacOS";
        if (nAgt.indexOf("X11") != -1) OSName = "UNIX";
        if (nAgt.indexOf("Linux") != -1) OSName = "Linux";

        descriptionRef.current.value = `OS : ${OSName}\nBrowser name : ${browserName}\nBrowser Full version : ${fullVersion}\nScreen Resolution :  width ${window.screen.availWidth} X height ${window.screen.availHeight}\nnavigator.userAgent : ${nAgt} `;

    }
    // --------------- PROJECTS DROPDOWN HANDLR------------------
    const projectsDropdownChangeHandler = async (e) => {
        const id = e?.target?.value;
        if (!id)
            return;
        try {
            setTaskLists([]);
            setTaskListLoader(true);

            const res = await fetcher(`projects/${id}/tasks.json`, 'GET');
            if (res.STATUS == 'OK') {
                selectedProjectId.current = id;
                setTaskLists(res['todo-items']);
                setTaskListLoader(false);
            }
            else throw new Error('Error in project dropdown')
        }
        catch (e) {
            setTaskListLoader(false);
        }
    }

    // ----------TASKS DROPDOWN HANDLER------------------
    const tasksDropdownChangeHandler = e => {
        selectedTaskId.current = e?.target?.value || null;
    };

    // ------------- PRIORITY HANDLR---------------
    const priorityDropdownHandlr = e => {
        selectedPriority.current = e?.target?.value;
    };

    // ------------- CREATE SUB TASK HANDLER ------------

    const createSubTaskHandler = async (e) => {

        if (!(contentRef?.current?.value && descriptionRef?.current?.value && selectedPriority?.current && selectedTaskId?.current)) { // IF FORM IS INCOMPLETE
            showToastMessage('Please enter complete details');
            return;
        }

        else if (!pendingFileRef?.current) { // IF IMAGE FILE NOT ADDED
            showToastMessage('Please edit the image and click on done button');
            return;
        }

        try {
            const reqBody = {
                'todo-item': {
                    'content': contentRef?.current?.value,
                    'description': descriptionRef?.current?.value,
                    'pendingFileAttachments': pendingFileRef?.current,
                    'priority': selectedPriority?.current
                }
            }

            showLoader(true);

            const res = await fetcher(`tasks/${selectedTaskId?.current}.json`, 'POST', JSON.stringify(reqBody))
            if (res?.STATUS === 'OK') {
                showLoader(false)
                showToastMessage('Subtask has been created successfully.', true,'CREATED SUBTASK LINK:',`https://portal.whiterabbit.group/app/tasks/${res.id}`)
            }
            else if (res?.STATUS === 'Error')
                throw new Error(res?.MESSAGE)

        } catch (e) {
            showLoader(false)
            showToastMessage('Error in subtask creation')
            console.log(e)
        }
    };

    return (
        <>
            <form action="">
                {/* -------------- PROJECTS DROPDOWN ------------------- */}
                <div className="l-col">
                    {projects[0] && (
                        <label htmlFor="">
                            <span>Projects </span>
                            <select
                                onChange={projectsDropdownChangeHandler}
                            >
                                <option value="">
                                    -- SELECT A PROJECT --
                                </option>
                                {projects.map(project => (
                                    <option
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                </div>

                {/* -------------- TASKS DROPDOWN ------------------- */}
                <div className="l-col">
                    {
                        <label htmlFor="">
                            <span>Tasks</span>
                            <select onChange={tasksDropdownChangeHandler}>
                                <option value="">
                                    -- SELECT A TASK --
                                </option>
                                {taskList[0] &&
                                    taskList.map(task => (
                                        <option key={task.id} value={task.id}>
                                            {task.content}
                                        </option>
                                    ))}
                                {taskListLoader && (
                                    <option value="">Loading...</option>
                                )}
                            </select>
                        </label>
                    }
                </div>

                {/* ----------- SUB TASK CREATION FORM---------------- */}
                <h2 class="l-title l-title--xs">
                    Create a sub tasks
                </h2>
                <div class="l-col">
                    <label htmlFor="">
                        <span>Content</span>
                        <input type="text" ref={contentRef} />
                    </label>
                </div>
                <div class="l-col">
                    <label htmlFor="">
                        <span>Description</span>
                        <textarea ref={descriptionRef}></textarea>
                    </label>
                </div>
                <div class="l-col">
                    <label htmlFor="">
                        <span>Priority</span>
                        <select onChange={priorityDropdownHandlr}>
                            <option value="">Not Set</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>
                </div>

                {/* ---------- SUBMIT BTN ----- */}
                <button
                    class="l-btn l-btn--dark"
                    type="button"
                    onClick={createSubTaskHandler}
                >
                    Create Subtask
                </button>
            </form>
        </>
    );
}

export default TaskDetailForm;
