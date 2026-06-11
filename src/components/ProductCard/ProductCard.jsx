import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { items, addToCart, decrementItem } = useCart();
  const navigate = useNavigate();

  const quantity = items.filter((item) => item.id === product.id).length;

  const handleDetails = () => {
    const selected = undefined;
    console.log('Open product', selected.id);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
      </Link>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <div className={styles.price}>{product.price.toLocaleString('uk-UA')} грн</div>
        <div className={styles.buttons}>
          {quantity === 0 ? (
            <button className={styles.buyBtn} onClick={() => addToCart(product)}>
              Додати в кошик
            </button>
          ) : (
            <div className={styles.stepper}>
              <button
                className={styles.stepperBtn}
                aria-label="Зменшити кількість"
                onClick={() => decrementItem(product.id)}
              >
                −
              </button>
              <span className={styles.qty}>{quantity}</span>
              <button
                className={styles.stepperBtn}
                aria-label="Збільшити кількість"
                onClick={() => addToCart(product)}
              >
                +
              </button>
            </div>
          )}
          <button className={styles.detailsBtn} onClick={handleDetails}>
            Детальніше
          </button>
        </div>
      </div>
    </div>
  );
}
