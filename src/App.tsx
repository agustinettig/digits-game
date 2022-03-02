import { Game } from './components/game';

import './styles.scss';

export function App() {  
  return (
    <div className="container">
      <div className="content">
        <div className="intro">
          <h1>Three digits game</h1>
          <p>Try to guess the number combination in 10 attempts</p>
        </div>
        <Game />
      </div>
    </div>
  );
}
