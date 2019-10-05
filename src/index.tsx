import React, { useState, useMemo, Reducer, useReducer } from "react";
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
import Note, { NoteType } from "./Note";

const fixedSize = { width: 500, height: 500 };

interface state {
  notes: NoteType[];
}
interface action {
  type: "create" | "remove";
  value: string;
}

const reducer: Reducer<state, action> = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case "create": {
      newState.notes = [
        ...state.notes,
        {
          id: Math.floor(Math.random() * 10000),
          createdAt: new Date(),
          text: action.value
        }
      ];
      break;
    }
    case "remove": {
      const filteredNotes = state.notes.filter(
        note => note.id.toString() !== action.value
      );
      newState.notes = filteredNotes;
      break;
    }
  }
  return newState;
};

const App = () => {
  const [theme, setTheme] = useState(darkTheme);
  const [newNote, setNewNote] = useState("");
  const [state, dispatch] = useReducer(reducer, { notes: [] });

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
        dispatch({ type: "create", value: newNote });
        setNewNote("");
      }
    },
    [state.notes, newNote]
  );

  const removeNote = (id: number) => () => {
    dispatch({ type: "remove", value: id.toString() });
  };

  return (
    <Window
      minSize={fixedSize}
      maxSize={fixedSize}
      styleSheet={styleSheet(theme)}
    >
      <View id="container">
        <View id="note_list">
          <Text id="heading">{`Notes (${state.notes.length})`}</Text>
          {state.notes.map(note => (
            <Note key={note.id} onRemove={removeNote} note={note} />
          ))}
        </View>
        <View id="create_notes">
          <LineEdit
            text={newNote}
            on={lineEditHandler}
            id="create_notes_input"
            placeholderText="Remember me to.."
          />
          <Button flat id="create_notes_button" text="Add" on={buttonHandler} />
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
    background-color: #333333;
  }

  #result {
    font-size: 12px;
    flex: 1;
    color: cyan;
  }
`;

Renderer.render(<App />);
