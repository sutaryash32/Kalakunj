import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import coverLogo from '../kalakunj.jpeg';

export default function FlipbookUI() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const [toast, setToast] = useState('');
  const touchStartX = useRef(0);

  useEffect(() => { api.getProducts().then(setProducts).catch(() => setProducts([])); }, []);

  const compactProducts = products.length ? products : [null];
  const lastPage = compactProducts.length + 1;
  useEffect(() => { setCurrentPage((page) => Math.min(page, lastPage)); }, [lastPage]);

  function showToast(message) { setToast(message); setTimeout(() => setToast(''), 1800); }
  function addToCart(product) {
    if (cart.some((item) => item.id === product.id)) return showToast('Already in your inquiry cart');
    setCart([...cart, product]); showToast(`${product.title} added to inquiry cart`);
  }
  function removeFromCart(id) { setCart(cart.filter((item) => item.id !== id)); }
  function shareProduct(product) {
    const text = `Check out ${product.title} — ${product.description || ''}`;
    if (navigator.share) navigator.share({ title: product.title, text }).catch(() => {});
    else window.open(`https://wa.me/919392217249?text=${encodeURIComponent(message)}`, '_blank');
  }
  async function sendInquiry() {
    if (!cart.length || isSendingInquiry) return;
    const items = cart.map((product) => `- ${product.title}\n${product.imageUrl}`).join('\n\n');
    const message = `Hi, I'm interested in the following items from Kalakunj catalogue:\n\n${items}`;
    window.open(`https://wa.me/919392217249?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    setIsSendingInquiry(true);
    try {
      await api.sendInquiry(cart.map((product) => ({ productId: product.id, title: product.title })));
    } catch {
      // WhatsApp has already opened, so a backend failure never blocks the customer.
    } finally {
      setIsSendingInquiry(false);
    }
  }
  function changePage(change) { setCurrentPage((page) => Math.max(0, Math.min(lastPage, page + change))); }
  function onTouchStart(event) { touchStartX.current = event.changedTouches[0].screenX; }
  function onTouchEnd(event) { const distance = event.changedTouches[0].screenX - touchStartX.current; if (Math.abs(distance) >= 40) changePage(distance < 0 ? 1 : -1); }

  const pageLabel = currentPage === 0 ? 'Cover' : currentPage === lastPage ? 'Back cover' : `Page ${currentPage} / ${products.length}`;

  function ProductFace({ product }) {
    if (!product) return <div className="face product-face"><div className="empty-state">No products yet. Check back soon.</div></div>;
    return <div className="face product-face" onClick={() => setZoomImg(product)}><img src={product.imageUrl} alt={product.title} /><div className="p-body"><p className="p-title">{product.title}</p><p className="p-desc">{product.description || 'No description available.'}</p><div className="p-actions"><button className="p-btn primary" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to inquiry</button><button className="p-btn share" aria-label={`Share ${product.title}`} onClick={(e) => { e.stopPropagation(); shareProduct(product); }}>↗</button></div></div></div>;
  }
  function ThankYouFace() { return <div className="face"><div className="p-body thanks-body"><div><p className="p-title">Thank you</p><p className="p-desc">© 2026 Kalakunj</p></div></div></div>; }

  const pages = [{ type: 'cover' }, ...compactProducts.map((product) => ({ type: 'product', product })), { type: 'thanks' }];

  return <div className="client-page">
    <div className="topbar"><div className="brand"><span className="name">Kalakunj</span><span className="tagline">Flipbook Catalogue</span></div></div>
    <div className="stage"><div className="device-frame">
      <button className="flip-edge prev" disabled={!currentPage} aria-label="Previous page" onClick={() => changePage(-1)}>‹</button>
      <div className="book" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>{pages.map((page, index) => <div key={`${page.type}-${page.product?.id || index}`} className={`page ${index === currentPage ? 'active' : index < currentPage ? 'before' : 'after'}`}>
        {page.type === 'cover' && <div className="face cover"><div><p className="cover-greeting">Welcome to</p><img className="cover-orb" src={coverLogo} alt="Kalakunj logo" /><div className="cover-emboss">Kalakunj</div><div className="cover-sub">Catalogue 2026</div></div><span className="cover-hint">Tap the arrow to open</span></div>}
        {page.type === 'product' && <ProductFace product={page.product} />}{page.type === 'thanks' && <ThankYouFace />}
      </div>)}</div>
      <button className="flip-edge next" disabled={currentPage === lastPage} aria-label="Next page" onClick={() => changePage(1)}>›</button>
    </div></div>
    <div className="page-count">{pageLabel}</div><div className="footer">© 2026 Kalakunj</div>
    <div className="dock"><button className="dock-btn" onClick={() => setCartOpen(true)}><span className="dock-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>{cart.length > 0 && <span className="cart-count">{cart.length}</span>}</span><span>Inquiry</span></button></div>
    {zoomImg && <div className="overlay" onClick={(event) => event.target === event.currentTarget && setZoomImg(null)}><button className="overlay-close" onClick={() => setZoomImg(null)}>&times;</button><img src={zoomImg.imageUrl} alt={zoomImg.title} /></div>}
    {cartOpen && <><div className="panel-scrim" onClick={() => setCartOpen(false)} /><div className="panel"><div className="panel-handle" /><button className="panel-close" onClick={() => setCartOpen(false)}>&times;</button><h3>Inquiry cart</h3><div className="scroll-area">{!cart.length ? <p className="cart-empty">No items yet — add products you're interested in from the catalogue.</p> : cart.map((product) => <div className="cart-item" key={product.id}><img src={product.imageUrl} alt={product.title} /><div className="ci-info">{product.title}</div><button onClick={() => removeFromCart(product.id)}>&times;</button></div>)}</div><button className="send-btn" disabled={!cart.length || isSendingInquiry} onClick={sendInquiry}>{isSendingInquiry ? 'Opening WhatsApp…' : 'Send inquiry via WhatsApp'}</button></div></>}
    {toast && <div className="toast">{toast}</div>}
  </div>;
}
