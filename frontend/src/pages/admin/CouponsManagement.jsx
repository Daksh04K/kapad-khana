import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiTag } from 'react-icons/fi';

const emptyForm = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderAmount: '',
  maxDiscount: '',
  usageLimit: '',
  expiresAt: ''
};

const CouponsManagement = () => {
  const { user } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/api/coupons', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCoupons(data);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null
      };
      const { data } = await axios.post('/api/coupons', payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCoupons(prev => [data, ...prev]);
      setShowModal(false);
      setForm(emptyForm);
      toast.success('Coupon created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await axios.put(`/api/coupons/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCoupons(prev => prev.map(c => c._id === id ? data : c));
    } catch {
      toast.error('Failed to update coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const formatExpiry = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Coupons Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <FiTag size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>No coupons yet. Create your first coupon!</p>
        </div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Used / Limit</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, #d4af37, #f4e4c1)',
                      color: '#000',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 11
                    }}>
                      {coupon.code}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{coupon.type}</td>
                  <td>
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    {coupon.maxDiscount && <span style={{ fontSize: 10, color: '#6b7280' }}> (max ₹{coupon.maxDiscount})</span>}
                  </td>
                  <td>₹{coupon.minOrderAmount || 0}</td>
                  <td>{coupon.usedCount} / {coupon.usageLimit ?? '∞'}</td>
                  <td style={{ color: isExpired(coupon.expiresAt) ? '#ef4444' : 'inherit' }}>
                    {formatExpiry(coupon.expiresAt)}
                    {isExpired(coupon.expiresAt) && <span style={{ fontSize: 9, marginLeft: 4 }}>(expired)</span>}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 600,
                      background: coupon.isActive && !isExpired(coupon.expiresAt) ? '#dcfce7' : '#fee2e2',
                      color: coupon.isActive && !isExpired(coupon.expiresAt) ? '#16a34a' : '#dc2626'
                    }}>
                      {coupon.isActive && !isExpired(coupon.expiresAt) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleToggle(coupon._id)}
                        title={coupon.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {coupon.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button
                        className="btn btn-outline btn-small"
                        onClick={() => handleDelete(coupon._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h2>Create Coupon</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  required
                  style={{ letterSpacing: '1px', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Discount Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Value * {form.type === 'percentage' ? '(%)' : '(₹)'}</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === 'percentage' ? '20' : '100'}
                    min="1"
                    max={form.type === 'percentage' ? 100 : undefined}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="0 = no minimum"
                    min="0"
                  />
                </div>
                {form.type === 'percentage' && (
                  <div className="input-group">
                    <label>Max Discount (₹)</label>
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                      placeholder="Leave empty = no cap"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="Leave empty = unlimited"
                    min="1"
                  />
                </div>
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Preview */}
              {form.value && (
                <div style={{
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  border: '1px solid #d4af37',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 11,
                  color: '#92400e',
                  marginBottom: 12
                }}>
                  Preview: <strong>{form.code || 'CODE'}</strong> gives{' '}
                  {form.type === 'percentage' ? `${form.value}% off` : `₹${form.value} off`}
                  {form.minOrderAmount ? ` on orders above ₹${form.minOrderAmount}` : ''}
                  {form.maxDiscount && form.type === 'percentage' ? ` (max ₹${form.maxDiscount})` : ''}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;
