import React, { useState, useMemo } from "react";
import {
  Renderer,
  View,
  Text,
  Button,
  Window,
  LineEdit,
  useEventHandler
} from "@nodegui/react-nodegui";
import {
  QPushButtonEvents,
  QLineEditEvents,
  NativeEvent,
  QKeyEvent
} from "@nodegui/nodegui";

type Note = {
  id: number;
  createdAt: Date;
  text: string;
};

const fixedSize = { width: 500, height: 500 };
const App = () => {
  const [theme, setTheme] = useState(darkTheme);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

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
  const buttonHandler = useEventHandler(
    {
      [QPushButtonEvents.clicked]: () => {
        setNotes([
          ...notes,
          { id: Math.random(), createdAt: new Date(), text: newNote }
        ]);
        setNewNote("");
      }
    },
    [notes, newNote]
  );

  const deleteHandler = useEventHandler(
    {
      [QPushButtonEvents.clicked]: (e: NativeEvent) => {
        console.log(e);
      }
    },
    []
  );

  return (
    <Window
      minSize={fixedSize}
      maxSize={fixedSize}
      styleSheet={styleSheet(theme)}
    >
      <View id="container">
        <View id="note_list">
          <Text id="heading">Notes</Text>

          {notes.map(note => (
            <View id="note" key={note.id}>
              <View>
                <Text id="content_small">{note.createdAt.toDateString()}</Text>
                <Button id="button_delete" text="🗑" on={deleteHandler} />
              </View>
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
          <Button id="create_notes_button" text="Add" on={buttonHandler} />
        </View>
      </View>
    </Window>
  );
};

const darkTheme = {
  bg: "#111111",
  buttonbg: "#222",
  text: "white"
};

interface Theme {
  bg: string;
  buttonbg: string;
  text: string;
}

const styleSheet = (theme: Theme) => `
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
  
  #button_delete {
    background-color: ${theme.bg};
    border: 1px solid #aaa;
    width: 50px;
    margin-left: 10px;
    border-radius: 5px;
  }
  
  #content {
    font-size: 16px;
    color: ${theme.text};
    min-width: 480px;
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
  }
  #note {
    margin-vertical: 12px;
    margin-left: 5px;
  }
  #note > QWidget {
    justify-content: space-between;
    flex-direction: row;
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
