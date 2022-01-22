import { RiDeleteBin5Line } from "react-icons/ri";
import { MdSaveAlt } from "react-icons/md";

const Main = ({ activeNote, onUpdateNote, onDeleteNote, saveNote, loadActiveNote }) => {
  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
    });
  };

  if (!activeNote ) return <div className="no-active-note">No active note</div>;

  return (
    <div className="app-main-note-edit">
      {loadActiveNote ? <div>loading</div> :
      <div>
        <div dir="rtl">
        <MdSaveAlt
          onClick={() => saveNote(activeNote.id, activeNote.title, activeNote.body)}
          className="save-icon"
          size="1.5em"
        />
        <RiDeleteBin5Line
          onClick={() => onDeleteNote(activeNote.id)}
          className="delete-icon"
          size="1.5em"
        />
      </div>
      <input
        type="text"
        id="title"
        placeholder="Note Title"
        value={activeNote.title}
        onChange={(e) => {
          activeNote.title = e.target.value
          onEditField("title", e.target.value)}}
        autoFocus
      />
      <textarea
        id="body"
        placeholder="Write your note here..."
        value={activeNote.body}
        onChange={(e) => {
          activeNote.body = e.target.value
          onEditField("body", e.target.value)}}
      />
      </div> 
      }
    </div>
  );
};

export default Main;
