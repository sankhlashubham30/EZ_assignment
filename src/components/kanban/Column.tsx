import {
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useKanbanStore } from "./kanban.store";
import { Card } from "./Card";

interface ColumnProps {
  columnId: string;
}

const Column = ({ columnId }: ColumnProps) => {
  const column = useKanbanStore((s) => s.columns[columnId]);
  const addCard = useKanbanStore((s) => s.addCard);

  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const handleAddCard = () => {
    const title = prompt("Enter card title");
    if (!title) return;
    addCard(columnId, title);
  };

  return (
    <div className="column">
      <h3>{column.title}</h3>

      <button onClick={handleAddCard}>+ Add Card</button>

      <div ref={setNodeRef} className="column-body">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {column.cardIds.map((cardId:any) => (
            <Card key={cardId} cardId={cardId} columnId={columnId} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;