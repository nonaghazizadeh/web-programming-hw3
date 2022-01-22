import { IoIosAdd } from "react-icons/io";
import Messaging from "react-cssfx-loading/lib/Messaging";

const Sidebar = ({ notes, onAddNote, activeNote, setActiveNote,loading }) => {
  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <IoIosAdd onClick={() => onAddNote()} className="add-button" size="2em"></IoIosAdd>
      </div>
      {loading 
      ? 
      <Messaging className="notes-loader" />
      : 
      <div className="app-sidebar-notes">
        {notes.map(({ id, title }) => (
          <div
            className={`app-sidebar-note ${id === activeNote && "active"}`}
            onClick={() => setActiveNote(id)}
            key={id}
          >
            <div className="sidebar-note-title">
              <strong>{title}</strong>
            </div>
          </div>
        ))}
      </div> }
    </div>
  );
};

export default Sidebar;
