import React from "react";
import { View, useEventHandler, Text, Button } from "@nodegui/react-nodegui";
import { QPushButtonEvents, NativeEvent } from "@nodegui/nodegui";

export type NoteType = {
  id: number;
  createdAt: Date;
  text: string;
};

const Note: React.FC<{ note: NoteType; onRemove: (id: number) => void }> = ({
  note,
  onRemove
}) => {
  const deleteHandler = useEventHandler(
    {
      [QPushButtonEvents.clicked]: () => {
        console.log("removing note id ", note.id);
        onRemove(note.id);
      }
    },
    [onRemove]
  );

  return (
    <View id="note">
      <View>
        <Text id="content_small">{note.createdAt.toDateString()}</Text>
        <Button id="button_delete" text="🗑" on={deleteHandler} />
      </View>
      <Text id="content">{note.text}</Text>
    </View>
  );
};

export default Note;
