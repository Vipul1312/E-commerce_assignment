import { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Notification, Navbar, Footer, CartDrawer, AuthModal, ProductModal } from './components';
import { HomePage, ShopPage, CheckoutPage, OrdersPage, WishlistPage, LookbookPage, ProfilePage, AdminPage } from './pages';
import './styles/index.css';

export default function App() {
  const { page, authModal, selectedProduct } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div>
      <Notification />
      <Navbar scrolled={scrolled} />
      <CartDrawer />
      {authModal      && <AuthModal />}
      {selectedProduct && <ProductModal />}

      <main>
        {page === 'home'     && <HomePage />}
        {page === 'shop'     && <ShopPage />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'orders'   && <OrdersPage />}
        {page === 'wishlist' && <WishlistPage />}
        {page === 'lookbook' && <LookbookPage />}
        {page === 'profile'  && <ProfilePage />}
        {page === 'admin'    && <AdminPage />}
      </main>

      {page !== 'admin' && <Footer />}
    </div>
  );
}
