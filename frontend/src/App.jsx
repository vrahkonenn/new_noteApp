import { useState, useEffect, useRef } from 'react'
import noteService from './services/notes'
import Footer from './components/Footer'
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        errorMessageSetter(`Note '${note.content}' was already removed from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const userSetter = (user) => {
    setUser(user)
  }

  const errorMessageSetter = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const noteFormRef = useRef()

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user &&
        <Togglable buttonLabel='login'>
          <LoginForm
            userSetter={userSetter}
            errorMessageSetter={errorMessageSetter}
          />
        </Togglable>
      }
      {user &&
        <div>
          <div className='logOut'>
            <p>Logged in as {user.username}</p>
            <button onClick={logOut}>Log out</button>
          </div>
          <Togglable buttonLabel='new note' ref={noteFormRef}>
            <NoteForm createNote={addNote}/>
          </Togglable>
        </div>
      }

      <div>
        <hr></hr>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  )
}

export default App
