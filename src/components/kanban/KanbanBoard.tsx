import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";

import { useKanbanStore } from "./kanban.store";
import Column from "./Column";

const KanbanBoard = () => {
  const columnOrder = useKanbanStore((s) => s.columnOrder);
  const moveCard = useKanbanStore((s) => s.moveCard);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const destCol = String(over.data.current?.columnId);

    moveCard(cardId, "todo", destCol, 0);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {columnOrder.map((colId) => (
          <Column key={colId} columnId={colId} />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;