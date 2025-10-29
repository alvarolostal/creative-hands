import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Reviews.jsx - componente consolidado para listado, métricas y formulario
const StarsDisplay = ({ rating = 0, size = 'text-sm' }) => {
  const r = Math.round((parseFloat(rating) || 0) * 2) / 2; // media precisión 0.5
  const full = Math.floor(r);
  const half = r - full === 0.5;
  return (
    <div className={`inline-flex items-center gap-1 ${size}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        if (idx <= full) return <span key={idx} className="text-yellow-400">★</span>;
        if (half && idx === full + 1) return <span key={idx} className="text-yellow-400">☆</span>;
        return <span key={idx} className="text-gray-300 dark:text-gray-600">★</span>;
      })}
    </div>
  );
};

const Reviews = ({ productId, initialProduct, onProductUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', comment: '', rating: 5 });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => setProduct(initialProduct), [initialProduct]);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${productId}`);
      if (data?.product) {
        setProduct(data.product);
        onProductUpdate && onProductUpdate(data.product);
      }
    } catch (err) {
      console.warn('refresh reviews failed', err?.message);
    } finally {
      setLoading(false);
    }
  };

  const myReview = (product?.reviews || []).find((r) => r.user && user && (r.user._id === user._id || r.user._id === user.id));

  const openFormForNew = () => {
    setError(null);
    setForm({ title: '', comment: '', rating: 5 });
    setEditingId(null);
    setFormVisible(true);
  };

  const openFormForEdit = (rev) => {
    setError(null);
    setForm({ title: rev.title || '', comment: rev.comment || '', rating: rev.rating || 5 });
    setEditingId(rev._id || rev.id);
    setFormVisible(true);
    // scroll into view (small visual nicety)
    setTimeout(() => {
      const el = document.getElementById('reviews-form');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    if (!isAuthenticated) return setError('Debes iniciar sesión para dejar una opinión');
    if (user?.role === 'admin') return setError('Los administradores no pueden dejar opiniones');
    if (!form.title.trim() || !form.comment.trim()) return setError('Rellena título y comentario');

    try {
      setSubmitting(true);
      let res;
      if (editingId) {
        res = await axios.put(`/api/products/${productId}/reviews/${editingId}`, form);
      } else {
        res = await axios.post(`/api/products/${productId}/reviews`, form);
      }

      if (res.data?.product) {
        setProduct(res.data.product);
        onProductUpdate && onProductUpdate(res.data.product);
        setForm({ title: '', comment: '', rating: 5 });
        setEditingId(null);
        setFormVisible(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error enviando valoración');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (rev) => {
    if (!window.confirm('¿Eliminar tu valoración?')) return;
    try {
      const id = rev._id || rev.id;
      const res = await axios.delete(`/api/products/${productId}/reviews/${id}`);
      if (res.data?.product) {
        setProduct(res.data.product);
        onProductUpdate && onProductUpdate(res.data.product);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error eliminando valoración');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Valoraciones</h3>
          <div className="text-sm text-gray-500">{product?.reviewsCount ?? (product?.reviews || []).length} opiniones</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <StarsDisplay rating={product?.avgRating ?? 0} size="text-base" />
            <div className="text-sm font-medium">{product?.avgRating ?? 0}</div>
          </div>
          {isAuthenticated && user?.role !== 'admin' && (
            <button onClick={openFormForNew} className="px-3 py-2 bg-primary-500 text-white rounded text-sm">{myReview ? 'Editar tu opinión' : 'Escribir opinión'}</button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-sm text-gray-500">Cargando opiniones…</div>
        ) : (product?.reviews || []).length === 0 ? (
          <div className="text-sm text-gray-500">Aún no hay valoraciones.</div>
        ) : (
          (product.reviews || []).slice().reverse().map((r) => (
            <article key={r._id || r.createdAt} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{r.user?.name || 'Usuario'}</div>
                  <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <StarsDisplay rating={r.rating} />
                </div>
              </div>
              <h4 className="mt-3 font-medium text-gray-800 dark:text-gray-100">{r.title}</h4>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{r.comment}</p>
              {user && (r.user?._id === user._id || r.user?._id === user.id) && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openFormForEdit(r)} className="text-sm text-primary-500">Editar</button>
                  <button onClick={() => remove(r)} className="text-sm text-red-500">Eliminar</button>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Form area */}
      {formVisible && (
        <div id="reviews-form" className="mt-5 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Título</label>
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm" placeholder="Breve título" />
            </div>
            <div>
              <label className="text-sm font-medium">Comentario</label>
              <textarea value={form.comment} onChange={(e) => setForm((s) => ({ ...s, comment: e.target.value }))} rows={4} className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm" placeholder="Cuenta tu experiencia"></textarea>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="text-sm font-medium">Puntuación</label>
                <div className="mt-1 inline-flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm((s) => ({ ...s, rating: n }))} className={`text-2xl ${n <= form.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} aria-label={`Puntuar ${n}`}>★</button>
                  ))}
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={() => { setFormVisible(false); setEditingId(null); setForm({ title: '', comment: '', rating: 5 }); }} className="px-3 py-2 border rounded text-sm">Cancelar</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary-500 text-white rounded text-sm">{submitting ? 'Enviando…' : editingId ? 'Guardar' : 'Enviar'}</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;
