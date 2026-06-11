import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './Checkout.module.css';

async function submitOrder(form) {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, ...data };
}

export default function Checkout() {
  const { items, removeFromCart, clearCart } = useCart();

  const orderLines = Object.values(
    items.reduce((acc, item) => {
      if (acc[item.id]) {
        acc[item.id].quantity += 1;
      } else {
        acc[item.id] = { ...item, quantity: 1 };
      }
      return acc;
    }, {})
  );
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantities, setQuantities] = useState({});
  const successRef = useRef(null);

  const getQuantity = (line) =>
    quantities[line.id] !== undefined ? quantities[line.id] : line.quantity;

  const changeQuantity = (line, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [line.id]:
        (prev[line.id] !== undefined ? prev[line.id] : line.quantity) + delta,
    }));
  };

  const total = orderLines.reduce(
    (sum, line) => sum + line.price * getQuantity(line),
    0
  );

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
    const response = await submitOrder(form);
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
                      onClick={() => changeQuantity(line, -1)}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>
                      {Math.min(getQuantity(line), 20)}
                    </span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      aria-label={`Збільшити кількість ${line.name}`}
                      onClick={() => changeQuantity(line, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.summaryPrice}>
                    {(line.price * getQuantity(line)).toLocaleString('uk-UA')} грн
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
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </label>

        <label className={styles.field}>
          <span>Телефон</span>
          <input
            type="text"
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
