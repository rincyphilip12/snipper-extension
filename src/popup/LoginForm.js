import { useRef } from 'react';

function LoginForm({ submitLoginFormHandr }) {

    const usernameRef = useRef('');
    const passwordRef = useRef('');



    // ------------------- RENDER -----------------
    return (
        <section className="login-form">
            <h3>PORTAL LOGIN</h3>

            <form action="" >
                <label htmlFor="">
                    <p>USER NAME </p>
                    <input type="text" name="file" ref={usernameRef} />
                </label>

                <label htmlFor="">
                    <p>PASSWORD </p>
                    <input type="password" ref={passwordRef} />
                </label>

                <button type="button" onClick={(e) => submitLoginFormHandr(usernameRef.current.value, passwordRef.current.value)}>LOGIN</button>
            </form>
        </section>
    )
}
export default LoginForm;