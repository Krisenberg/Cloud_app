import React, {useState} from 'react'
import Axios from "axios";
import Cookies from "universal-cookie"

function SignUp() {
    const cookies = new Cookies()
    const [user, setUser] = useState(null)
    const signUp = () => {
        Axios.post("https://localhost:44310/signup", user).then(res => {
            const { token, username, hashedPassword } = res.data;

            cookies.set("token", token);
            cookies.set("username", username);
            cookies.set("hashedPassword", hashedPassword);
        })
    };

    return (
        <div className="signUp">
            <label>SignUp</label>
            <input 
                placeholder="Username" onChange={(event) => {
                    setUser({...user, username: event.target.value });
                }}>
            </input>
            <input
                type="password"
                placeholder="Password" onChange={(event) => {
                    setUser({...user, password: event.target.value });
                }}>
            </input>
            <button onClick={ signUp }>Sign Up</button>
        </div>
    )
}

export default SignUp;