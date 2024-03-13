import React, {useState} from 'react'

function SignUp() {
    const [user, setUser] = useState(null)
    const signUp = () => {

    }

    return (
        <div className="signUp">
            <label>SignUp</label>
            <input 
                placeholder="Username" onChange={(event) => {
                    setUser({...user, firstName: event.target.value });
                }}>
            </input>
            <input
                type="password"
                placeholder="Password" onChange={(event) => {
                    setUser({...user, firstName: event.target.value });
                }}>
            </input>
            <button onClick={ signUp }>Sign Up</button>
        </div>
    )
}

export default SignUp;