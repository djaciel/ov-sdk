import './App.css';
import PositionsTable from './positionTable';
import MarketsTable from './marketsTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Positions table</h1>
        <PositionsTable />

        <br />

        <h1>Markets table</h1>
        <MarketsTable />
        <br />        
        
      </header>
    </div>
  );
}

export default App;