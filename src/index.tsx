import React, { useState, useMemo } from "react";
import { Renderer, View, Text, Window, LineEdit } from "@nodegui/react-nodegui";
import {
  QPushButtonEvents,
  QLineEditEvents,
  NativeEvent,
  QKeyEvent
} from "@nodegui/nodegui";

const App = () => {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([
    { id: 1, createdAt: new Date(), text: "This is a note" }
  ]);
  const lineEditHandler = useMemo(
    () => ({
      [QLineEditEvents.textChanged]: (text: string) => {
        setNewNote(text);
      },
      [QLineEditEvents.KeyRelease]: (e: NativeEvent) => {
        const keyEvt = new QKeyEvent(e);
        const code = keyEvt.text().charCodeAt(0);
        if (code === 13) return; //ENTER button
      }
    }),
    [newNote]
  );
  const buttonHandler = useMemo(
    () => ({
      [QPushButtonEvents.clicked]: () => {
        setNotes([
          ...notes,
          { id: Math.random(), createdAt: new Date(), text: newNote }
        ]);
        setNewNote("");
      }
    }),
    [notes, newNote]
  );

  return (
    <Window minSize={fixedSize} maxSize={fixedSize} styleSheet={styleSheet}>
      <View id="container">
        <View id="note_list">
          <Text id="heading">Notes</Text>
          {notes.map(note => (
            <View id="note" key={note.id}>
              <Text id="content_small">{note.createdAt.toDateString()}</Text>
              <Text id="content">{note.text}</Text>
            </View>
          ))}
        </View>
        <View id="create_notes">
          <LineEdit
            text={newNote}
            on={lineEditHandler}
            id="create_notes_input"
            placeholderText="Remember me to.."
          />
          <Button id="create_notes_button" text="Add" on={buttonHandler}>
            Add
          </Button>
        </View>
      </View>
    </Window>
  );
};

const theme = {
  bg: "#111111",
  text: "white"
};

const styleSheet = `
  #container {
    flex: 1;
    min-height: 0;
    min-width: 0;
    width: '900';
    height: '900';
    flex-direction: column;
    min-height: '100%';
    width: '100%';
    align-items: 'flex-start';
    justify-content: 'space-between';
    background-color: ${theme.bg};
  }
  #heading {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: bold;
    color: ${theme.text};
  }
  #content {
    font-size: 16px;
    color: ${theme.text};
  }
  #content_small {
    font-size: 12px;
    color: #cccccc;
  }
  #note_list {
    flex: 1;
    flex-grow: 1;
    flex-direction: column;
    align-items: 'flex-start';
    justify-content: 'flex-start';
    padding: '5px';
    overflow: scroll;
  }
  #note {
    margin-vertical: 12px;
  }
  #create_notes {
    width: '100%';
    max-height: '40px';
    padding: 5px;
    border-top: 1px solid white;
    flex: 1;
    flex-direction: row;
  }
  #create_notes_input {
    color: ${theme.text};
    background-color: ${theme.bg};   
    flex: 1;
  }
  #create_notes_button {
    color: ${theme.text};
    background-color: ${theme.bg};
  }

  #result {
    font-size: 12px;
    flex: 1;
    color: cyan;
  }
`;

Renderer.render(<App />);
