import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/Routes.jsx'
import { UserProvider } from './components/Context/UserContext.jsx'
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
