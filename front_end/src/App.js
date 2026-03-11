import logo from './logo.svg';
import './App.css';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <div className="App">
      <Posts />
      <CreatePost />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
