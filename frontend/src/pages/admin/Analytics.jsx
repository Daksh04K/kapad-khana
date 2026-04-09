import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import './Analytics.css';

const COLORS = ['#d4af37', '#0f3460', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];

const fmt = (n) => n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.name.toLowerCase().includes('revenue') ? `₹${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="stat-card-analytics" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-icon" style={{ background: color + '18', color }}>{icon}</div>
    <div className="stat-body">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  </div>
);

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: res } = await axios.get('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setData(res);
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!data)   return <div className="error-message">Failed to load analytics</div>;

  const { summary, revenueByDay, ordersByStatus, revenueByCategory, topProducts, usersByDay, lowStock } = data;

  return (
    <div className="analytics-page">
      <div className="admin-header">
        <h1>Analytics Dashboard</h1>
        <button className="btn btn-outline" onClick={fetchAnalytics} style={{ fontSize: 11 }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="stats-grid">
        <StatCard
          icon={<FiTrendingUp />}
          label="Total Revenue"
          value={`₹${summary.totalRevenue.toLocaleString()}`}
          sub="All time (excl. cancelled)"
          color="#d4af37"
        />
        <StatCard
          icon={<FiShoppingBag />}
          label="Total Orders"
          value={summary.totalOrders}
          sub="All time"
          color="#0f3460"
        />
        <StatCard
          icon={<FiUsers />}
          label="Total Users"
          value={summary.totalUsers}
          sub="Registered customers"
          color="#10b981"
        />
        <StatCard
          icon={<FiPackage />}
          label="Total Products"
          value={summary.totalProducts}
          sub="In catalogue"
          color="#8b5cf6"
        />
      </div>

      {/* ── Revenue + Orders (last 7 days) ── */}
      <div className="charts-row">
        <div className="chart-card wide">
          <div className="chart-header">
            <h3>Revenue & Orders — Last 7 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueByDay} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tickFormatter={fmt} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#d4af37" fill="url(#revGrad)" strokeWidth={2} />
              <Bar  yAxisId="right" dataKey="orders" name="Orders" fill="#0f3460" radius={[3, 3, 0, 0]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Order Status Pie ── */}
        <div className="chart-card">
          <div className="chart-header"><h3>Order Status</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {ordersByStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {ordersByStatus.map((item, i) => (
              <div key={i} className="pie-legend-item">
                <span className="pie-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{item.name}</span>
                <span className="pie-count">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Revenue by Category + User Growth ── */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header"><h3>Revenue by Category</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByCategory} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]}>
                {revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><h3>New Users — Last 7 Days</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usersByDay} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="New Users" stroke="#10b981" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Products + Low Stock ── */}
      <div className="charts-row">
        <div className="chart-card wide">
          <div className="chart-header"><h3>Top 5 Products by Revenue</h3></div>
          {topProducts.length === 0 ? (
            <p className="no-data">No sales data yet</p>
          ) : (
            <div className="top-products-list">
              {topProducts.map((p, i) => (
                <div key={i} className="top-product-row">
                  <span className="rank">#{i + 1}</span>
                  <span className="product-name">{p.name}</span>
                  <div className="revenue-bar-wrap">
                    <div
                      className="revenue-bar"
                      style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%` }}
                    />
                  </div>
                  <span className="product-revenue">₹{p.revenue.toLocaleString()}</span>
                  <span className="product-units">{p.units} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><FiAlertTriangle style={{ color: '#ef4444', marginRight: 6 }} />Low Stock Alert</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="no-data" style={{ color: '#10b981' }}>✓ All products well stocked</p>
          ) : (
            <div className="low-stock-list">
              {lowStock.map((p, i) => (
                <div key={i} className="low-stock-row">
                  <div>
                    <span className="ls-name">{p.name}</span>
                    <span className="ls-cat">{p.category}</span>
                  </div>
                  <span className={`ls-stock ${p.stock === 0 ? 'out' : p.stock <= 2 ? 'critical' : 'low'}`}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
