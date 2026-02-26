import { useState } from "react";
import { useTreeStore } from "./tree.store";

interface Props {
  id: string;
}

const TreeNodeComponent: React.FC<Props> = ({ id }) => {
  const node = useTreeStore((s) => s.nodes[id]);
  const {
    toggleNode,
    addNode,
    deleteNode,
    editNode,
    lazyLoad,
  } = useTreeStore();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.name);

  const handleToggle = async () => {
    await lazyLoad(id);
    toggleNode(id);
  };

  return (
    <div className="tree-node">
      <div className="node-row">
        {node.children.length > 0 && (
          <span onClick={handleToggle}>
            {node.isExpanded ? "▼" : "▶"}
          </span>
        )}

        {editing ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              editNode(id, value);
              setEditing(false);
            }}
          />
        ) : (
          <span onDoubleClick={() => setEditing(true)}>
            {node.name}
          </span>
        )}

        <button onClick={() => addNode(id, "New Node")}>+</button>
        <button onClick={() => deleteNode(id)}>🗑</button>
      </div>

      {node.isExpanded && (
        <div className="children">
          {node.isLoading && <p>Loading...</p>}
          {node.children.map((childId) => (
            <TreeNodeComponent key={childId} id={childId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeComponent;