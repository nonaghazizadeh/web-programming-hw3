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

  useEffect(() => {
    axios.get('https://retoolapi.dev/EGJCqt/data').then((res) => {
      setNotes(res.data)
      setLoading(false)}
  )}, []);

  const onAddNote = () => {
    // const newNote = {
    //   id: uuid(),
    //   title: "Untitled Note",
    //   body: "",
    // };
    // setNotes([newNote, ...notes]);
    // setActiveNote(newNote.id);
  };

  const onDeleteNote = (noteId) => {
    axios.delete(`https://retoolapi.dev/EGJCqt/data/${noteId}`)
    .then((res) => {
      console.log(res.data)
      setNotes(notes.filter(({ id }) => id !== noteId));
      setClickedNote(false)
    })
  };

  const saveNote = (noteId, title, body) => {
    axios.patch(`https://retoolapi.dev/EGJCqt/data/${noteId}`, {title: title, body: body })
    .then((res) => {
      console.log(res.data)
    })
  };

  const setClickedNoteActive = (id) => {
    setLoadActiveNote(false)
    setActiveNote(id)
    axios.get(`https://retoolapi.dev/EGJCqt/data/${id}`)
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

  var isLoggedIn = true;
  
  if (!isLoggedIn)
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
          <button className="saveForm"> {user ? "Submit" : "Login"} </button>
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
