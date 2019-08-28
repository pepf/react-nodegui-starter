import React from "react";
import { View, Text, Button } from "@nodegui/react-nodegui";
import { QPushButtonEvents } from "@nodegui/nodegui";

export type NoteType = {
  id: number;
  createdAt: Date;
  text: string;
};

const Note: React.FC<{
  note: NoteType;
  onRemove: (id: number) => () => void;
}> = ({ note, onRemove }) => {
  return (
    <View id="note">
      <View>
        <Text id="content_small">{note.createdAt.toDateString()}</Text>
        <Button
          id="button_delete"
          text="🗑"
          on={{ [QPushButtonEvents.clicked]: onRemove(note.id) }}
        />
      </View>
      <Text id="content">{note.text}</Text>
    </View>
  );
};

export default Note;
