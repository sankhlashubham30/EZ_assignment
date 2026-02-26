import {
  DndContext,
  closestCenter,
 type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useTreeStore } from "./tree.store";
import TreeNode from "./TreeNode";

const TreeView = () => {
  const rootIds = useTreeStore((s) => s.rootIds);
  const moveNode = useTreeStore((s) => s.moveNode);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    moveNode(
      String(active.id),
      null,
      rootIds.indexOf(String(over.id))
    );
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rootIds}
        strategy={verticalListSortingStrategy}
      >
        {rootIds.map((id) => (
          <TreeNode key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default TreeView;