import { useRef, useState } from 'react';
function TaskDetailForm({ pendingFileRef, projects, fetcher }) {

    const [taskList, setTaskLists] = useState([]);
    const selectedTaskId = useRef();
    const selectedProjectId = useRef();
    const selectedPriority = useRef();
    const contentRef = useRef();
    const descriptionRef = useRef();
    // --------------- PROJECTS DROPDOWN HANDLR------------------
    const projectsDropdownChangeHandler = async (e) => {
        const id = e?.target?.value;
        if (!id)
            return;
        try {
            const payload = await fetcher(`projects/${id}/tasks.json`, 'GET');

            if (payload.STATUS == 'OK') {
                selectedProjectId.current = id;
                setTaskLists(payload['todo-items']);
            }
            else throw new Error('Error in project dropdown')
        }
        catch (e) {
            console.error(e);
        }
    }

    // ----------TASKS DROPDOWN HANDLER------------------
    const tasksDropdownChangeHandler = (e) => {
        selectedTaskId.current = e?.target?.value || null;
    }

    // ------------- PRIORITY HANDLR---------------
    const priorityDropdownHandlr = (e) => {
        selectedPriority.current = e?.target?.value || '';
    }

    // ------------- CREATE SUB TASK HANDLER ------------

    const createSubTaskHandler = async (e) => {

        if (!(contentRef?.current?.value && descriptionRef?.current?.value && pendingFileRef?.current && selectedPriority?.current && selectedTaskId?.current)){
            alert('Please enter complete details');
            return;
        }
        try {
            const reqBody = {
                'todo-item': {
                    'content': contentRef?.current?.value || '',
                    'description': descriptionRef?.current?.value || '',
                    'pendingFileAttachments': pendingFileRef?.current || '',
                    'priority': selectedPriority?.current || 'not set'
                }
            }

            const res = await fetcher(`tasks/${selectedTaskId?.current}.json`, 'POST', JSON.stringify(reqBody));
            if (res?.STATUS === 'OK')
                alert('SUB TASK SUCCESSFULLY CREATED')
            else if (res?.STATUS === 'Error')
                throw new Error(res?.MESSAGE)

        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <form action="">

                {/* -------------- PROJECTS DROPDOWN ------------------- */}
                {projects[0] && <label htmlFor="">
                    <p>Projects </p>
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

                {/* -------------- TASKS DROPDOWN ------------------- */}

                {<label htmlFor="">
                    <p>Tasks</p>
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
                    </select>
                </label>}


                {/* ----------- SUB TASK CREATION FORM---------------- */}
                <p>CREATE A SUB TASKS</p>

                <label htmlFor="">Content <input type="text" ref={contentRef} /> </label>
                <label htmlFor="">Description <input type="text" ref={descriptionRef} /> </label>
                <label htmlFor="">Priority
                    <select onChange={priorityDropdownHandlr}>
                        <option value='not set'>Not Set</option>
                        <option value='low'>Low</option>
                        <option value='medium'>Medium</option>
                        <option value='high'>High</option>

                    </select></label>

                <button type="button" onClick={createSubTaskHandler} >Create SubTask</button>
            </form></>
    )
}

export default TaskDetailForm;