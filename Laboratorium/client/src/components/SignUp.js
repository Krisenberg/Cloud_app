// import React, {useState} from 'react'
// import Axios from "axios";
// import Cookies from "universal-cookie"

// function SignUp() {
//     const cookies = new Cookies()
//     const [user, setUser] = useState(null)
//     const signUp = () => {
//         console.log(user)
//         Axios.post("https://localhost:44310/signup", user).then(res => {
//             const { userID, username, password } = res.data;

//             cookies.set("userID", userID);
//             cookies.set("username", username);
//             cookies.set("password", password);
//         })
//     };

//     return (
//         <div className="signUp">
//             <label>SignUp</label>
//             <input 
//                 placeholder="Username" onChange={(event) => {
//                     setUser({...user, username: event.target.value });
//                 }}>
//             </input>
//             <input
//                 type="password"
//                 placeholder="Password" onChange={(event) => {
//                     setUser({...user, password: event.target.value });
//                 }}>
//             </input>
//             <button onClick={ signUp }>Sign Up</button>
//         </div>
//     )
// }

// export default SignUp;