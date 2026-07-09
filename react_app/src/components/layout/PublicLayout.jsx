import Header from '../Header';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom';
import './PortalLayout.css';

export default function PublicLayout() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
