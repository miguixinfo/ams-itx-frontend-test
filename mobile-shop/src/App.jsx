import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { PLP } from './components/PLP';
import { PDP } from './components/PDP';

function App() {
  return (
    <CartProvider>
      <Header />
      <Routes>
        <Route path="/" element={<PLP />} />
        <Route path="/product/:id" element={<PDP />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
