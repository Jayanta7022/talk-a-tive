import { Route } from 'react-router-dom';
import './app.css';
import Chatpage from './pages/Chatpage';
import Home from './pages/Home.jsx';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
