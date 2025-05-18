import HomePage from './components/HomePage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductPage from './pages/ProductPage.jsx'
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage.jsx'
import SignUpPage from './pages/signupPage.jsx'
import AddProduct from './pages/AddProduct.jsx'
import Cart from "./pages/Cart.jsx"
import MarketPlace from './pages/MarketPlace.jsx'

function App() {
  
  return (
    <>
    
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/marketplace" element={<MarketPlace />} />

    </Routes>
    </>
  )
  


}

export default App
