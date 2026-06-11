import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [count] = useState(Math.min(items.length, 20));

  const handleOrder = () => {
    navigate('/checkout');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src="/f-logo.svg" alt="WebbyLab-Shop" className={styles.logoImg} />
      </Link>
      <div className={styles.actions}>
        <span className={styles.cart}>Кошик: {count}</span>
        <button className={styles.orderBtn} onClick={handleOrder}>
          Замовити
        </button>
      </div>
    </header>
  );
}
