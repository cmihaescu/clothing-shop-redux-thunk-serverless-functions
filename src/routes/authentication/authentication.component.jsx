
import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import '../../components/button/button.styles.scss'
import './authentication.styles.scss'

const Authentication = () => {

    return(
        <div className="authentication-container">
            <SignInForm />
            <SignUpForm />
        </div>
    )
}

export default Authentication