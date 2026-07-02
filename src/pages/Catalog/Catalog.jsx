import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './Catalog.module.css';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'Усі';
  const [sortOrder, setSortOrder] = useState('default');

  const selectCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'Усі') {
      next.delete('category');
    } else {
      next.set('category', category);
    }
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    document.title = 'Товари | WebbyLab-Shop';
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const priceCaps = {
    Аксесуари: 1000,
    Електроніка: 1300,
  };

  let visibleProducts = products;

  if (selectedCategory === 'Одяг' || selectedCategory === 'Взуття') {
    visibleProducts = visibleProducts.filter(
      (p) => p.category === selectedCategory
    );
  } else if (priceCaps[selectedCategory]) {
    visibleProducts = visibleProducts.filter(
      (p) => p.price <= priceCaps[selectedCategory]
    );
  }

  if (query) {
    const cleaned = query
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['"`’‘“”]/g, '');
    visibleProducts = visibleProducts.filter((p) => p.name.includes(cleaned));
  }

  if (sortOrder === 'asc') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'desc') {
    [...visibleProducts].sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'alpha') {
    visibleProducts = [...visibleProducts].sort((a, b) =>
      a.name.localeCompare(b.name, 'uk')
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <input
          type="text"
          className={styles.search}
          placeholder="Пошук за назвою..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.categories}>
          <button
            className={selectedCategory === 'Усі' ? styles.activeCat : styles.cat}
            onClick={() => selectCategory('Усі')}
          >
            Усі
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? styles.activeCat : styles.cat}
              onClick={() => selectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className={styles.sort}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Сортування</option>
          <option value="asc">Від дешевших</option>
          <option value="desc">Від дорожчих</option>
          <option value="alpha">За алфавітом</option>
        </select>
      </div>

      <div className={styles.grid}>
        {visibleProducts.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <p className={styles.empty}>Товарів не знайдено</p>
      )}
    </div>
  );
}
