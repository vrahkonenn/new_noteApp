import { useState } from 'react'
import noteService from '../services/notes'
import loginService from '../services/login'


const LoginForm = ({ userSetter, errorMessageSetter }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      userSetter(user)
      console.log(`Logged in as ${username}`)
      setUsername('')
      setPassword('')
    } catch {
      errorMessageSetter('wrong credentials')
  	}
  }
  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
     	      type='text'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm