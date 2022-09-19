import { useRef } from 'react';

function LoginForm({ submitLoginFormHandr }) {

    const usernameRef = useRef('');
    const passwordRef = useRef('');



    // ------------------- RENDER -----------------
    return (
        <section className="login-form">
            <h2 class="l-title l-title--sm">PORTAL LOGIN</h2>

            <form action="" >
                <div class="l-col">
                    <label htmlFor="">
                        <span>USER NAME </span>
                        <input type="text" name="file" ref={usernameRef} />
                    </label>
                </div>
                <div class="l-col">
                    <label htmlFor="">
                        <span>PASSWORD </span>
                        <input type="password" ref={passwordRef} />
                    </label>
                </div>

                <button class="l-btn l-btn--dark" type="button" onClick={(e) => submitLoginFormHandr(usernameRef.current.value, passwordRef.current.value)}>LOGIN</button>
            </form>
        </section>
    )
}
export default LoginForm;