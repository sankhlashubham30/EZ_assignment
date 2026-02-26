import KanbanBoard from "./components/kanban/KanbanBoard";
import TreeView from "./components/Treeview/TreeView";


function App() {
  return (
    <div className="app-container">
      <h1>Component Assignment</h1>

      <section>
        <h2>Tree View</h2>
        <TreeView />
      </section>

      <section>
        <h2>Kanban Board</h2>
        <KanbanBoard />
      </section>
    </div>
  );
}

export default App;