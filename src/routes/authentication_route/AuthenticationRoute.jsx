import { useEffect, useState } from "react"
import "../../stylesheets/routes/authentication_route/AuthenticationRoute.css"
import MagicNote from "./MagicNote"
import { useNavigate } from "react-router-dom"

const AuthenticationRoute = () => {
  const navigate = useNavigate()

  const [authMethod, setAuthMethod] = useState(true) // false => login, true => signup

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    fetch(`http://localhost:8000/api/verify_user/${authToken}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(res => {
        console.log(res)
        if (res.message === "valid token") {
          navigate("/")
        }
      })
      .catch(error => console.log(error))
  }, [])

  const handleSignUp = (e) => {
    e.preventDefault()

    if (username && password && confirmPassword) {
      if (password === confirmPassword) {
        fetch("http://localhost:8000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        })
          .then(response => response.json())
          .then(res => {
            localStorage.setItem("authToken", res.token)
            localStorage.setItem("user", res.user)
            navigate("/")
          })
          .catch(error => console.log(error))
      } else {
        alert("Passwords do not match")
      }
    } else {
      alert("You need to include all credentials")
    }
  }

  const handleLogIn = (e) => {
    e.preventDefault()

    if (username && password) {
      fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(response => response.json())
        .then(res => {
          localStorage.setItem("authToken", res.token)
          localStorage.setItem("user", JSON.stringify(res.user))
          navigate("/")
        })
        .catch(error => console.log(error))
    } else {
      alert("You need to include all credentials")
    }
  }

  const handleSwitch = () => {
    setAuthMethod(!authMethod)
  }

  return (
    <div className="auth-main">
      <div className="auth-form-main">
        <div className="auth-form-header">
          <p className="auth-method-title">{authMethod ? "sign up" : "log in"}</p>
          <p className="auth-method-switch" onClick={handleSwitch}>{!authMethod ? "sign up" : "log in"}</p>
        </div>
        {
          !authMethod ?
            <form className="auth-form" onSubmit={handleLogIn}>
              <input
                placeholder="Username..."
                onChange={e => setUsername(e.target.value)}
                value={username} />
              <input
                type="password"
                placeholder="Password..."
                onChange={e => setPassword(e.target.value)}
                value={password} />
              <button>log in</button>
            </form> :
            <form className="auth-form" onSubmit={handleSignUp}>
              <input
                placeholder="Username..."
                onChange={e => setUsername(e.target.value)}
                value={username} />
              <input
                type="password"
                placeholder="Password..."
                onChange={e => setPassword(e.target.value)}
                value={password} />
              <input
                type="password"
                placeholder="Confirm password..."
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword} />
              <button>sign up</button>
            </form>
        }
      </div>
      <MagicNote />
    </div>
  )
}

export default AuthenticationRoute