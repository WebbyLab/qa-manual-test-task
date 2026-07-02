import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './Checkout.module.css';

async function submitOrder(form, items) {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: form,
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, ...data };
}

export default function Checkout() {
  const { items, addToCart, decrementItem, removeFromCart, clearCart } =
    useCart();

  const orderLines = items;
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef(null);

  const total = orderLines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );

  useEffect(() => {
    document.title = 'Замовлення | WebbyLab-Shop';
  }, []);

  useEffect(() => {
    if (!success || !successRef.current) {
      return;
    }
    successRef.current.querySelectorAll('script').forEach((node) => {
      const script = document.createElement('script');
      if (node.src) {
        script.src = node.src;
      }
      script.textContent = node.textContent;
      node.replaceWith(script);
    });
  }, [success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = 'Введіть ім’я';
    }
    if (!form.email.includes('@')) {
      nextErrors.email = 'Введіть коректний номер телефону';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Введіть коректний номер телефону';
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    const response = await submitOrder(form, items);
    if (response.ok) {
      setLoading(false);
      setSuccess(true);
      clearCart();
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successBox} ref={successRef}>
          <h2>Дякуємо за замовлення!</h2>
          <p
            className={styles.successName}
            dangerouslySetInnerHTML={{ __html: form.name }}
          />
          <p>Ми зв’яжемося з вами найближчим часом.</p>
          <Link to="/" className={styles.back}>
            ← Повернутися до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Оформлення замовлення</h1>

      <section className={styles.summary}>
        <h2 className={styles.summaryTitle}>Ваше замовлення</h2>
        {orderLines.length === 0 ? (
          <p className={styles.emptyCart}>Кошик порожній</p>
        ) : (
          <>
            <ul className={styles.summaryList}>
              {orderLines.map((line) => (
                <li key={line.id} className={styles.summaryItem}>
                  <img
                    src={line.imageUrl}
                    alt={line.name}
                    className={styles.summaryImg}
                  />
                  <span className={styles.summaryName}>{line.name}</span>
                  <div className={styles.qtyStepper}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      aria-label={`Зменшити кількість ${line.name}`}
                      onClick={() => decrementItem(line.id)}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{line.quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      aria-label={`Збільшити кількість ${line.name}`}
                      onClick={() => addToCart(line)}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.summaryPrice}>
                    {(line.price * line.quantity).toLocaleString('uk-UA')} грн
                  </span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    aria-label={`Видалити ${line.name}`}
                    onClick={() => removeFromCart(line.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.summaryTotal}>
              <span>Разом:</span>
              <span>{total.toLocaleString('uk-UA')} грн</span>
            </div>
          </>
        )}
      </section>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span>Ім’я та прізвище</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>

        <label className={styles.field}>
          <span>Телефон</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </label>

        <label className={styles.field}>
          <span>Адреса</span>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Обробка...' : 'Підтвердити замовлення'}
        </button>
      </form>
    </div>
  );
}
