import { useState, useEffect } from 'react'
import { login } from '../../Services/authService.js';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../components/Context/UserContext.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  useEffect(() => {
    console.log("user from context", user)
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const response = await login(form)
      console.log(response.data);
      if (response.data && response.data.token) {
        sessionStorage.setItem('token', response.data.token)
        setSuccess('Login successful!')
        const USER = response.data.user;
        console.log("user from login", USER);
        setUser(USER)
        console.log("user from context", user);
        navigate('/');
      } else {
        setError('Invalid login response')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div>Dont have account? <span className='cursor-pointer' onClick={() => navigate('/register')}>Register</span></div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
