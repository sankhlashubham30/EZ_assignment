import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KanbanState {
  cards: Record<string, { id: string; title: string }>;
  columns: Record<
    string,
    { id: string; title: string; cardIds: string[] }
  >;
  columnOrder: string[];

  addCard: (columnId: string, title: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (
    cardId: string,
    sourceCol: string,
    destCol: string,
    index: number
  ) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      cards: {},
      columns: {
        todo: { id: "todo", title: "Todo", cardIds: [] },
        inprogress: {
          id: "inprogress",
          title: "In Progress",
          cardIds: [],
        },
        done: { id: "done", title: "Done", cardIds: [] },
      },
      columnOrder: ["todo", "inprogress", "done"],

      addCard: (columnId, title) => {
        const id = crypto.randomUUID();
        const cards = {
          ...get().cards,
          [id]: { id, title },
        };

        const columns = { ...get().columns };
        columns[columnId].cardIds.push(id);

        set({ cards, columns });
      },

      deleteCard: (cardId) => {
        const columns = { ...get().columns };

        Object.values(columns).forEach((col: any) => {
          col.cardIds = col.cardIds.filter(
            (id:any) => id !== cardId
          );
        });

        const cards = { ...get().cards };
        delete cards[cardId];

        set({ cards, columns });
      },

      moveCard: (cardId, sourceCol, destCol, index) => {
        const columns = { ...get().columns };

        columns[sourceCol].cardIds =
          columns[sourceCol].cardIds.filter(
            (id) => id !== cardId
          );

        columns[destCol].cardIds.splice(index, 0, cardId);

        set({ columns });
      },
    }),
    { name: "kanban-storage" }
  )
);