import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createOrUpdateNote = (e) => {
    e.preventDefault();

    if (editingNote) {
      api
        .put(`/api/notes/update/${editingNote.id}/`, { title, content })
        .then((res) => {
          if (res.status === 200) alert("Note updated!");
          else alert("Failed to update note.");
          setEditingNote(null);
          setTitle("");
          setContent("");
          getNotes();
        })
        .catch((err) => alert(err));
    } else {
      api
        .post("/api/notes/", { title, content })
        .then((res) => {
          if (res.status === 201) {
            alert("Note created!");
            setTitle("");
            setContent("");
          } else {
            alert("Failed to make note.");
          }
          getNotes();
        })
        .catch((err) => alert(err));
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        <a href="/logout">
          <button>Logout</button>
        </a>

        {notes.map((note) => (
          <div key={note.id}>
            <Note
              note={note}
              onDelete={deleteNote}
              onEdit={startEditing} 
            />
          </div>
        ))}
      </div>
      <h2>{editingNote ? "Edit Note" : "Create a Note"}</h2>
      <form onSubmit={createOrUpdateNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value={editingNote ? "Update Note" : "Submit"} />
        {editingNote && <button onClick={cancelEditing}>Cancel</button>}
      </form>
    </div>
  );
}

export default Home;

