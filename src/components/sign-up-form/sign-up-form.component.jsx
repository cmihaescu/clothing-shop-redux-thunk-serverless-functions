import { useState } from "react"
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase.utils"
import FormInput from "../form-input/form-input.component"
import Button from "../button/button.component"
import './sign-up-form.styles.scss'

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { displayName, email, password, confirmPassword } = formFields
    const resetFormFields = () => { setFormFields(defaultFormFields) }


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("passwords do not match")
            return
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password)
            await createUserDocumentFromAuth(user, { displayName })
            console.log("user successfully created")
            resetFormFields()
        } catch (error) {
            if (error.code === "auth/email-already-in-use") { alert("user creation failed, email already in use") }
            else { console.log(error.message) }
        }
    }

    return (
        <div className="sign-up-container">
            <h2>I do not have an account yet </h2>
            <span> Sign up with email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Display Name"
                    type='text'
                    required
                    onChange={handleChange}
                    name='displayName'
                    value={displayName}
                />
                <FormInput
                    label="Email"
                    type='email'
                    required
                    onChange={handleChange}
                    name='email'
                    value={email}
                />
                <FormInput
                    label="Password"
                    type='password'
                    required
                    onChange={handleChange}
                    name='password'
                    value={password}
                />
                <FormInput
                    label="Confirm Password"
                    type='password'
                    required
                    onChange={handleChange}
                    name='confirmPassword'
                    value={confirmPassword}
                />
                <Button buttonType={'default'} type="submit">Sign Up</Button>
            </form>
        </div>
    )
}

export default SignUpForm