import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {

    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false);
    const auth = getAuth();

    const [buttonHover, setButtonHover] = useState(false);
    const [inputHover, setInputHover] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmailSent(true);
                console.log("Reset Email Sent!");
            })
            .catch((err) => {
                alert("Unable to send reset email: " + err.message);
            })
    }

    return (
        <div className="page">
            <div className="container">
                <div className="card"> 
                    <h1> Reset Your Password </h1>
                    {!emailSent ? (
                        <>
                            <h3> 
                                Enter your email below to reset your password. 
                            </h3>
                            <form onSubmit = {handleSubmit}>
                                <input 
                                    type = "email"
                                    placeholder = "johndoe@gmail.com"
                                    value = {email}
                                    onChange = {(e) => setEmail(e.target.value)}
                                    onMouseEnter = {() => setInputHover(true)}
                                    onMouseLeave = {() => setInputHover(false)}
                                    required
                                    style = {{ 
                                        borderRadius: '10px', width: '100%', height: '40px',
                                        padding: '10px', margin: '10px 0px 30px 0px', fontSize: '1rem',
                                        border: `1px solid ${inputHover ? '#2c3544' : 'grey'}`,
                                        transition: 'border-color 0.2s ease',
                                    }}
                                />
                                <button type = "submit"
                                    onMouseEnter = {() => setButtonHover(true)}
                                    onMouseLeave = {() => setButtonHover(false)}
                                    style = {{
                                        borderRadius: '10px', width: '90px', height: '40px',
                                        fontSize: '1rem', fontWeight: 'bold', color: 'white',
                                        backgroundColor: buttonHover ? '#3f4b5e' : '#2c3544',
                                        cursor: 'pointer', border: 'none', transition: 'background-color 0.2s ease'
                                    }}> 
                                    Submit 
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h3> 
                                Reset email successfully sent! Please check your inbox / spam folder. 
                            </h3>

                            <h3>
                                Do allow up to 5 minutes for the email to be sent. 
                            </h3>
                        </>
                    )} 
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;