import React from "react"
import "../auth.form.scss"
import { Link } from "react-router"
import Register from "./Register"

const Login = () => {

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter Email Address" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter Your Password"/>
          </div>

          <button className="button primary-button" >Login</button>
        </form>

        <p>Don't have account <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login
