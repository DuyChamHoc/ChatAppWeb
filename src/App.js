import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AuthProvider from './components/Context/AuthProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import ChatWindow from './components/ChatRoom/ChatWindow';
import AppProvider from './components/Context/AppProvider';
import InviteMemberModal from './components/Modals/InviteMemberModal';
import Register from './components/Login/Register';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<ChatRoom />} path="/" />
            <Route  element={<Register />} path="/register" />
          </Routes>
          <InviteMemberModal />
          <AddRoomModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
