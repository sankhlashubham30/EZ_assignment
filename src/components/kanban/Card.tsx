import { useSortable } from "@dnd-kit/sortable";
import { useKanbanStore } from "./kanban.store";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

interface CardProps {
  cardId: string;
  columnId: string;
}

export const Card = ({ cardId, columnId }: CardProps) => {
  const card = useKanbanStore((s) => s.cards[cardId]);
  const deleteCard = useKanbanStore((s) => s.deleteCard);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: cardId,
    data: {
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(card.title);


  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
      {...listeners}
    >
      {editing ? (
        <input
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            useKanbanStore.setState((state) => ({
              cards: {
                ...state.cards,
                [cardId]: { ...state.cards[cardId], title: value },
              },
            }));
            setEditing(false);
          }}
        />
      ) : (
        <p onDoubleClick={() => setEditing(true)}>
          {card.title}
        </p>
      )}

      <button onClick={() => deleteCard(cardId)}>🗑</button>
    </div>
  );
};