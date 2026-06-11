import { Link, useParams } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const { id } = useParams();
  const { items, addToCart, decrementItem } = useCart();
  const product = products.find((p) => p.id === Number(id));

  const quantity = product
    ? items.filter((item) => item.id === product.id).length
    : 0;

  if (!product) {
    return (
      <div className={styles.page}>
        <p>Товар не знайдено.</p>
        <Link to="/" className={styles.back}>
          ← Назад до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Назад до каталогу
      </Link>
      <div className={styles.content}>
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>
            {product.price.toLocaleString('uk-UA')} грн
          </div>
          <p className={styles.description}>{product.description}</p>
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
        </div>
      </div>
    </div>
  );
}
