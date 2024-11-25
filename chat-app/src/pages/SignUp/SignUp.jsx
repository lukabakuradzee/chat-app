import React from 'react'
import Form from '../../components/SignUpForm/Form'
import styles from "../SignUp/SignUpPage.module.scss"

function SignUp() {
  return (
    <section className={styles.signUpPage}> 
      <h2>Sign Up <i className="fa-brands fa-microblog app-logo"></i></h2>
      <Form/>
    </section>
  )
}

export default SignUp