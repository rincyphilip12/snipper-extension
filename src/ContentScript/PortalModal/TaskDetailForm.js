import { useRef, useState } from 'react';
function TaskDetailForm({ pendingFileRef, projects, fetcher, showToastMessage, showLoader }) {

    const [taskList, setTaskLists] = useState([]);
    const selectedTaskId = useRef();
    const selectedProjectId = useRef();
    const selectedPriority = useRef();
    const contentRef = useRef();
    const descriptionRef = useRef();
    const [taskListLoader, setTaskListLoader] = useState(false);

    // --------------- PROJECTS DROPDOWN HANDLR------------------
    const projectsDropdownChangeHandler = async (e) => {
        const id = e?.target?.value;
        if (!id)
            return;
        try {
            setTaskLists([]);
            setTaskListLoader(true);
            const payload = await fetcher(`projects/${id}/tasks.json`, 'GET');

            if (payload.STATUS == 'OK') {
                selectedProjectId.current = id;
                setTaskLists(payload['todo-items']);
                setTaskListLoader(false);
            }
            else throw new Error('Error in project dropdown')
        }
        catch (e) {
            setTaskListLoader(false);
            console.error(e);
        }
    }

    // ----------TASKS DROPDOWN HANDLER------------------
    const tasksDropdownChangeHandler = (e) => {
        selectedTaskId.current = e?.target?.value || null;
    }

    // ------------- PRIORITY HANDLR---------------
    const priorityDropdownHandlr = (e) => {
        selectedPriority.current = e?.target?.value;
    }

    // ------------- CREATE SUB TASK HANDLER ------------

    const createSubTaskHandler = async (e) => {

        if (!(contentRef?.current?.value && descriptionRef?.current?.value && pendingFileRef?.current && selectedPriority?.current && selectedTaskId?.current)) {
            showToastMessage('Please enter complete details');
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
            const res = await fetcher(`tasks/${selectedTaskId?.current}.json`, 'POST', JSON.stringify(reqBody));
            if (res?.STATUS === 'OK') {
                showLoader(false)
                showToastMessage('Subtask has been created succesfully',true)
            }
            else if (res?.STATUS === 'Error')
                throw new Error(res?.MESSAGE)

        } catch (e) {
            showLoader(false)
            showToastMessage('Error in subtask creation')
            console.log(e)
        }
    }

    return (
        <>
            <form action="">

                {/* -------------- PROJECTS DROPDOWN ------------------- */}
                <div className="l-col">
                    {projects[0] && <label htmlFor="">
                        <span>Projects </span>
                        <select onChange={projectsDropdownChangeHandler} >
                            <option value=''>-- SELECT A PROJECT --</option>
                            {projects.map(
                                project =>
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                            )}
                        </select>
                    </label>}
                </div>


                {/* -------------- TASKS DROPDOWN ------------------- */}
                <div className="l-col">
                    {<label htmlFor="">
                        <span>Tasks</span>
                        <select onChange={tasksDropdownChangeHandler}>
                            <option value=''>-- SELECT A TASK --</option>
                            {taskList[0] &&
                                taskList.map(
                                    task =>
                                        <option key={task.id} value={task.id}>
                                            {task.content}
                                        </option>
                                )
                            }
                            {
                                taskListLoader && <option value=''>Loading...</option>
                            }
                        </select>
                    </label>}
                </div>

                {/* ----------- SUB TASK CREATION FORM---------------- */}
                <h2 class="l-title l-title--xs">Create a sub tasks</h2>
                    <div class="l-col">
                        <label htmlFor="">
                            <span>Content</span>
                            <input type="text" ref={contentRef} />
                        </label>
                    </div>
                    <div class="l-col">
                        <label htmlFor="">
                            <span>Description</span>
                            <input type="text" ref={descriptionRef} />
                        </label>
                    </div>
                    <div class="l-col">
                        <label htmlFor="">
                            <span>Priority</span>
                            <select onChange={priorityDropdownHandlr}>
                                <option value=''>Not Set</option>
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>
                        </label>
                    </div>



                <button class="l-btn l-btn--dark" type="button" onClick={createSubTaskHandler} >Create Subtask</button>
            </form></>
    )
}

export default TaskDetailForm;