import { create } from "zustand";
import { type TreeNode } from "./tree.types";

interface TreeState {
  nodes: Record<string, TreeNode>;
  rootIds: string[];

  toggleNode: (id: string) => void;
  addNode: (parentId: string | null, name: string) => void;
  deleteNode: (id: string) => void;
  editNode: (id: string, name: string) => void;
  moveNode: (id: string, newParentId: string | null, index: number) => void;
  lazyLoad: (id: string) => Promise<void>;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  nodes: {},
  rootIds: [],

  toggleNode: (id) => {
    const node = get().nodes[id];
    set({
      nodes: {
        ...get().nodes,
        [id]: { ...node, isExpanded: !node.isExpanded },
      },
    });
  },

  addNode: (parentId, name) => {
    const id = crypto.randomUUID();

    const newNode: TreeNode = {
      id,
      name,
      parentId,
      children: [],
      isExpanded: false,
    };

    const nodes = { ...get().nodes, [id]: newNode };

    if (parentId) {
      nodes[parentId].children.push(id);
    }

    set({
      nodes,
      rootIds: parentId
        ? get().rootIds
        : [...get().rootIds, id],
    });
  },

  deleteNode: (id) => {
    const { nodes } = get();

    const deleteRecursively = (nodeId: string) => {
      nodes[nodeId].children.forEach(deleteRecursively);
      delete nodes[nodeId];
    };

    deleteRecursively(id);

    set({
      nodes: { ...nodes },
      rootIds: get().rootIds.filter((r) => r !== id),
    });
  },

  editNode: (id, name) => {
    set({
      nodes: {
        ...get().nodes,
        [id]: { ...get().nodes[id], name },
      },
    });
  },

  moveNode: (id, newParentId, index) => {
    const { nodes } = get();
    const node = nodes[id];

    // remove from old parent
    if (node.parentId) {
      nodes[node.parentId].children =
        nodes[node.parentId].children.filter((c) => c !== id);
    }

    // assign new parent
    node.parentId = newParentId;

    if (newParentId) {
      nodes[newParentId].children.splice(index, 0, id);
    }

    set({ nodes: { ...nodes } });
  },

  lazyLoad: async (id) => {
    const nodes = get().nodes;

    if (nodes[id].hasLoaded) return;

    set({
      nodes: {
        ...nodes,
        [id]: { ...nodes[id], isLoading: true },
      },
    });

    await new Promise((r) => setTimeout(r, 1000));

    const child1 = crypto.randomUUID();
    const child2 = crypto.randomUUID();

    nodes[child1] = {
      id: child1,
      name: "Lazy Child 1",
      parentId: id,
      children: [],
      isExpanded: false,
    };

    nodes[child2] = {
      id: child2,
      name: "Lazy Child 2",
      parentId: id,
      children: [],
      isExpanded: false,
    };

    nodes[id] = {
      ...nodes[id],
      children: [child1, child2],
      isLoading: false,
      hasLoaded: true,
    };

    set({ nodes: { ...nodes } });
  },
}));