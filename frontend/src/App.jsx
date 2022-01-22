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

  var token = '3d23efb8065e433b4df4341f10d39cf6'
  useEffect(() => {
    axios.get('http://192.168.1.239:8080/notes/', { headers: {"Authorization" : `Token ${token}`}})
      .then((res) => {
        setNotes(res.data)
        setLoading(false)}
      )
    }, []);

  const onAddNote = () => {
    const newNote = {
      title: "Untitled Note",
      content: ""
    }
    axios.post('http://192.168.1.239:8080/notes/new',newNote,{ headers: {"Authorization" : `Token ${token}`}})
      .then((res) =>{
        setNotes([res.data, ...notes]);
        setActiveNote(res.data.id);
        setClickedNoteActive(res.data.id)
    })
  };

  const onDeleteNote = (noteId) => {
    axios.delete(`http://192.168.1.239:8080/notes/${noteId}`, { headers: {"Authorization" : `Token ${token}`} })
      .then((res) => {
        console.log(res.data)
        setNotes(notes.filter(({ id }) => id !== noteId));
        setClickedNote(false)
    })
  };

  const saveNote = (noteId, title, content) => {
    const body = {title: title, content: content };
    axios.put(`http://192.168.1.239:8080/notes/${noteId}`, body, { headers: {"Authorization" : `Token ${token}`}})
      .then((res) => {
        console.log(res.data)
    })
  };

  const setClickedNoteActive = (id) => {
    setLoadActiveNote(false)
    setActiveNote(id)
    axios.get(`http://192.168.1.239:8080/notes/${id}`, { headers: {"Authorization" : `Token ${token}`}})
      .then((res) => {
        try{
          setClickedNote(res.data)
        }
        finally{
          console.log(res.data)
          setLoadActiveNote(false);
        }
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
  const [loggedIn, setLoggedIn] = useState(false);
  const changeStatus =() =>{
    setLoggedIn(true)
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
        <div className="formBody">{user ? <SignUp /> : <SignIn />}</div>
        <div className="formFooter">
          <button onClick={()=>changeStatus()} className="saveForm"> {user ? "Submit" : "Login"} </button>
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
