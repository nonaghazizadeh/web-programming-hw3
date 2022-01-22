import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./components/note/Main";
import Sidebar from "./components/note/Sidebar";
import SignUp from "./components/login-register/SignUp.jsx";
import SignIn from "./components/login-register/SignIn.jsx";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);
  const [loading, setLoading] = useState(true)
  const [loadActiveNote, setLoadActiveNote] = useState(false)
  const [clickedNote, setClickedNote] = useState(false)
  const [user, setUser] = useState({ newUser: true });
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token'));
  const [userNameSignUp, setUserNameSignUp] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [userNameSignIn, setUserNameSignIn] = useState('');
  const [passwordSignIn, setPasswordSignIn] = useState('');
  const [errorMessageSignUp, setErrorMessageSignUp] = useState('');
  const [errorMessageSignIn, setErrorMessageSignIn] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      axios.get('http://192.168.1.239:8080/notes/', { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
      .then((res) => {
        setNotes(res.data)
        setLoading(false)}
      )
    }
    
    }, []);

  const onAddNote = () => {
    const newNote = {
      title: "Untitled Note",
      content: ""
    }
    axios.post('http://192.168.1.239:8080/notes/new',newNote,{ headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
      .then((res) =>{
        setNotes([res.data, ...notes]);
        setActiveNote(res.data.id);
        setClickedNoteActive(res.data.id)
    }).catch((err) => {
      console.error(err)
    })
  };

  const onDeleteNote = (noteId) => {
    axios.delete(`http://192.168.1.239:8080/notes/${noteId}`, { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`} })
      .then((res) => {
        console.log(res.data)
        setNotes(notes.filter(({ id }) => id !== noteId));
        setClickedNote(false)
    }).catch((err) => {
      console.error(err)
    })
  };

  const saveNote = (noteId, title, content) => {
    const body = {title: title, content: content };
    axios.put(`http://192.168.1.239:8080/notes/${noteId}`, body, { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
      .then((res) => {
        console.log(res.data)
    }).catch((err) => {
      console.error(err)
    })
  };

  const setClickedNoteActive = (id) => {
    setLoadActiveNote(false)
    setActiveNote(id)
    axios.get(`http://192.168.1.239:8080/notes/${id}`, { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
      .then((res) => {
        try{
          setClickedNote(res.data)
        }
        finally{
          console.log(res.data)
          setLoadActiveNote(false);
        }
    }).catch((err) => {
      console.error(err)
    }) 
  }

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }
      return note;
    });
    setNotes(updatedNotesArr);
  };

  const handleClick = (button) => {
    if (user && button !== "signUp") {
      setUser(false);
    } else if (!user && button !== "signIn") {
      setUser(true);
    }
  };

  const changeStatus =(user) =>{
    if (user) {
      const data = { username: userNameSignUp, password: passwordSignUp}
      axios.post('http://192.168.1.239:8080/users/register',data)
        .then((res) => {
          try{
            console.log(res.data.token)
            localStorage.setItem('token', res.data.token )
            setLoggedIn(true)
          }
          finally{
            axios.get('http://192.168.1.239:8080/notes/', { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
            .then((res) => {
              console.log(res.data)
              setNotes(res.data)
              setLoading(false)
            })
          }
      }).catch((err) => {
        setErrorMessageSignUp(err.response.data.message)
        setTimeout(() => {
          setErrorMessageSignUp('')
        }, 3000)
      })
    }else {
      const data = { username: userNameSignIn, password: passwordSignIn}
      axios.post('http://192.168.1.239:8080/users/login', data)
        .then((res) => {
          try{
            console.log(res.data.token)
            localStorage.setItem('token', res.data.token )
            setLoggedIn(true)
          }
          finally{
            axios.get('http://192.168.1.239:8080/notes/', { headers: {"Authorization" : `Token ${localStorage.getItem('token')}`}})
            .then((res) => {
              setNotes(res.data)
              setLoading(false)
            })
          }
        }).catch((err) => {
          setErrorMessageSignIn(err.response.data.message)
          setTimeout(() => {
            setErrorMessageSignIn('')
          }, 3000)
        })
      }
    }

  if (!loggedIn)
    return (
      <div className="formContainer">
        <div className="formHeader">
          <div
            className={user ? "headerActive" : "headerInActive"}
            onClick={() => handleClick("signUp")}
          >
            <button className="headerButton"> Sign Up </button>
          </div>
          <div
            className={user ? "headerInActive" : "headerActive"}
            onClick={() => handleClick("signIn")}
          >
            <button className="headerButton"> Sign In </button>
          </div>
        </div>
        <div className="formBody">
          {user 
          ? 
          <SignUp 
            userNameSignUp={userNameSignUp}
            passwordSignUp={passwordSignUp}
            setUserNameSignUp={setUserNameSignUp}
            setPasswordSignUp={setPasswordSignUp}
          /> 
          : 
          <SignIn
            userNameSignIn={userNameSignIn}
            passwordSignIn={passwordSignIn}
            setUserNameSignIn={setUserNameSignIn}
            setPasswordSignIn={setPasswordSignIn}
          />
          }
        </div>
        <div className="error-message">{ user ? errorMessageSignUp : errorMessageSignIn}</div>
        <div className="formFooter">
          <button onClick={()=>changeStatus(user)} className="saveForm"> {user ? "Submit" : "Login"} </button>
        </div>
      </div>
    );

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        activeNote={activeNote}
        setActiveNote={setClickedNoteActive}
        loading={loading}
      />
      <Main
        activeNote={clickedNote}
        onUpdateNote={onUpdateNote}
        onDeleteNote={onDeleteNote}
        saveNote={saveNote}
        loadActiveNote={loadActiveNote}
      />
    </div>
  );
}

export default App;
