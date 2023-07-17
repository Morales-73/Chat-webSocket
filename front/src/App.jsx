import io from 'socket.io-client'
import { Form } from './components/Form';

const socket = io('http://localhost:5000')

function App() {

  return (
    <div className="vh-100">

      <h1 className="text-center">Chat - webSocket</h1>

      <Form socket={socket}/>
    </div>
  );
}

export default App;