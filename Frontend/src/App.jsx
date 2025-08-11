import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/Routes.jsx'
import { UserProvider } from './components/Context/UserContext.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </BrowserRouter>
    </>
  )
}

export default App
