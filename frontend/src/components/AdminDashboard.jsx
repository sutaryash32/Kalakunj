import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImageFile, rotateImageSrc } from '../utils/cropImage.js';

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin-token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [toast, setToast] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef(null);

  useEffect(() => {
    if (token) refreshList();
  }, [token]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  function handleLogout() {
    sessionStorage.removeItem('admin-token');
    setToken(null);
    setLoginError('');
  }

  function handleApiError(e, fallback) {
    if (e.status === 401) {
      handleLogout();
      showToast('Session expired — please log in again');
    } else {
      showToast(fallback);
    }
  }

  async function refreshList() {
    try {
      setProducts(await api.getProducts());
      if (token) {
        try {
          await api.getUnreadCount(token);
        } catch {
          // decoy call — ignore failures
        }
      }
    } catch (e) {
      handleApiError(e, 'Could not load products');
    }
  }

  async function handleLogin() {
    try {
      const res = await api.login(username, password);
      sessionStorage.setItem('admin-token', res.token);
      setToken(res.token);
      setLoginError('');
    } catch (e) {
      setLoginError('Incorrect username or password.');
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
      setRotation(0);
      setCompletedCrop(null);
      setCropModalOpen(true);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  }

  async function handleRotationChange(newRotation) {
    if (!rawImageSrc) return;
    const rotated = await rotateImageSrc(rawImageSrc, newRotation);
    setRawImageSrc(rotated);
    setRotation(newRotation);
    setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
    setCompletedCrop(null);
  }

  async function confirmCrop() {
    if (!rawImageSrc || !completedCrop || !imgRef.current) return;
    try {
      const croppedFile = await getCroppedImageFile(rawImageSrc, completedCrop, imgRef.current, 'product.jpg');
      const res = await api.uploadImage(token, croppedFile);
      setUploadedUrl(res.url);
      setPreview(res.url);
    } catch (e) {
      handleApiError(e, 'Upload failed — check Cloudinary credentials on the backend');
    } finally {
      setCropModalOpen(false);
      setRawImageSrc(null);
      setCompletedCrop(null);
      setRotation(0);
    }
  }

  function cancelCrop() {
    setCropModalOpen(false);
    setRawImageSrc(null);
    setCompletedCrop(null);
  }

  async function handleAdd() {
    if (!form.title || !uploadedUrl) {
      showToast('Title and image are required');
      return;
    }
    try {
      await api.addProduct(token, {
        title: form.title,
        description: form.description,
        imageUrl: uploadedUrl,
      });
      setForm({ title: '', description: '' });
      setPreview(null);
      setUploadedUrl(null);
      showToast('Product added');
      refreshList();
    } catch (e) {
      handleApiError(e, 'Could not add product');
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteProduct(token, id);
      showToast('Product removed');
      refreshList();
    } catch (e) {
      handleApiError(e, 'Could not remove product');
    }
  }

  async function handleMove(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= products.length) return;
    const next = [...products];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setProducts(next);
    try {
      await api.reorderProducts(token, next.map((p) => p.id));
      showToast('Order updated');
    } catch (e) {
      handleApiError(e, 'Could not update order');
      refreshList();
    }
  }

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...products];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setProducts(next);
    setDragIndex(index);
  }

  async function handleDrop() {
    setDragIndex(null);
    try {
      await api.reorderProducts(token, products.map((p) => p.id));
      showToast('Order saved');
    } catch (e) {
      handleApiError(e, 'Could not save order');
      refreshList();
    }
  }

  if (!token) {
    return (
      <div className="admin-wrap">
        <div className="login-screen">
          <div className="orb" />
          <h2>Admin dashboard</h2>
          <p>Sign in to manage the catalogue</p>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
          />
          {loginError && <p className="error-msg">{loginError}</p>}
          <button className="btn" onClick={handleLogin}>Sign in</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      {cropModalOpen && (
        <div className="crop-overlay">
          <div className="crop-box">
            <h3>Crop image</h3>
            <div className="crop-stage">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img ref={imgRef} src={rawImageSrc} alt="Crop preview" />
              </ReactCrop>
            </div>
            <div className="crop-actions">
              <button className="logout-btn" onClick={cancelCrop}>Cancel</button>
              <button className="btn" onClick={confirmCrop}>Crop & upload</button>
            </div>
            <div className="crop-actions">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  className={`rotation-btn ${rotation === deg ? 'active' : ''}`}
                  onClick={() => handleRotationChange(deg)}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div>
          <h1>Kalakunj</h1>
          <span className="sub">Admin dashboard</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>

      <div className="admin-card">
        <h3>Add product</h3>
        <label className="upload-box">
          {preview ? (
            <div className="upload-preview">
              <img src={preview} alt="preview" />
              <div className="upload-overlay">
                <span className="upload-overlay-title">{form.title || 'Untitled'}</span>
                {form.description && <span className="upload-overlay-desc">{form.description}</span>}
              </div>
            </div>
          ) : (
            <span className="upload-placeholder">Tap to upload an image, or drop one here</span>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <label>Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name" />
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
        <button className="btn" onClick={handleAdd}>Add to catalogue</button>
      </div>

      <div className="admin-card">
        <h3>Current products</h3>
        <div className="product-list">
          {products.length === 0 && <p className="empty">No products yet — add your first one above.</p>}
          {products.map((p, index) => (
            <div
              className="product-row"
              key={p.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              onDragEnd={() => setDragIndex(null)}
            >
              <span className="drag-handle" aria-label="Drag handle">⋮⋮</span>
              <img src={p.imageUrl} alt={p.title} />
              <div className="info">
                <div className="t">{p.title}</div>
              </div>
              <div className="row-actions">
                <button className="arrow-btn" onClick={() => handleMove(index, -1)} disabled={index === 0}>↑</button>
                <button className="arrow-btn" onClick={() => handleMove(index, 1)} disabled={index === products.length - 1}>↓</button>
                <button className="remove-btn" onClick={() => handleDelete(p.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
