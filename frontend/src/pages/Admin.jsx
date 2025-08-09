import { useState, useEffect } from 'react';
import './Admin.css';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'usd',
    interval: 'month'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      // Fetch users
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        credentials: 'include'
      });
      
      if (usersResponse.status === 401) {
        setError('Please log in to access the admin panel.');
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      if (usersResponse.status === 403) {
        setError('Admin access required. Please log in as an admin user.');
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      if (!usersResponse.ok) {
        setError(`Failed to fetch users. Status: ${usersResponse.status}`);
        setLoading(false);
        return;
      }
      
      const usersData = await usersResponse.json();
      setUsers(usersData.users);
      setIsAdmin(true);
      
      // Fetch stats
      const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        credentials: 'include'
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Fetch plans
      const plansResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin/plans`, {
        credentials: 'include'
      });
      
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(plansData.plans);
      }
      
    } catch (err) {
      console.error('Admin data fetch error:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newPlan,
          price: parseInt(newPlan.price) * 100 // Convert to cents
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create plan');
      }
      
      const result = await response.json();
      alert(result.message);
      
      // Reset form and refresh data
      setNewPlan({
        name: '',
        description: '',
        price: '',
        currency: 'usd',
        interval: 'month'
      });
      setShowCreatePlan(false);
      fetchAdminData();
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const togglePlanStatus = async (planId, currentStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update plan');
      }
      
      const result = await response.json();
      alert(result.message);
      fetchAdminData();
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const archivePlan = async (planId) => {
    if (!confirm('Are you sure you want to archive this plan? This will deactivate it.')) {
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/plans/${planId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to archive plan');
      }
      
      const result = await response.json();
      alert(result.message);
      fetchAdminData();
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const toggleUserStatus = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${username}/toggle-status`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }
      
      const result = await response.json();
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.username === username 
          ? { ...user, is_disabled: result.is_disabled }
          : user
      ));
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteUser = async (username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${username}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Remove the user from the local state
      setUsers(users.filter(user => user.username !== username));
      
      // Refresh stats
      fetchAdminData();
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Never') return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      pending: 'status-pending',
      inactive: 'status-inactive',
      none: 'status-none'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-none'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  if (error && !isAdmin) {
    return (
      <div className="admin-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>{error}</p>
          <p>Please log in with an admin account to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={fetchAdminData} className="refresh-btn">
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Emby Users</h3>
          <div className="stat-number">{stats.total_emby_users || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Subscriptions</h3>
          <div className="stat-number">{stats.active_subscriptions || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Subscriptions</h3>
          <div className="stat-number">{stats.pending_subscriptions || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Created via Management</h3>
          <div className="stat-number">{stats.created_via_management || 0}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Stripe Plans
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-section">
          <h2>User Management</h2>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Subscription</th>
                  <th>Plan</th>
                  <th>Email</th>
                  <th>Created Via Tool</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.username} className={user.is_disabled ? 'user-disabled' : ''}>
                    <td>
                      <div className="username-cell">
                        {user.username}
                        {user.is_admin && <span className="admin-badge">ADMIN</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`user-status ${user.is_disabled ? 'disabled' : 'enabled'}`}>
                        {user.is_disabled ? 'Disabled' : 'Enabled'}
                      </span>
                    </td>
                    <td>
                      {getStatusBadge(user.subscription_status)}
                    </td>
                    <td>{user.plan_name || 'None'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>
                      <span className={`created-badge ${user.created_via_management ? 'yes' : 'no'}`}>
                        {user.created_via_management ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{formatDate(user.last_activity)}</td>
                    <td>
                      <div className="action-buttons">
                        {!user.is_admin && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(user.username)}
                              className={`action-btn ${user.is_disabled ? 'enable-btn' : 'disable-btn'}`}
                            >
                              {user.is_disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => deleteUser(user.username)}
                              className="action-btn delete-btn"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {user.is_admin && (
                          <span className="admin-protected">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="plans-section">
          <div className="plans-header">
            <h2>Stripe Plan Management</h2>
            <button 
              onClick={() => setShowCreatePlan(true)} 
              className="create-plan-btn"
            >
              Create New Plan
            </button>
          </div>

          {/* Create Plan Modal */}
          {showCreatePlan && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create New Stripe Plan</h3>
                  <button 
                    onClick={() => setShowCreatePlan(false)}
                    className="close-btn"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Plan Name *</label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                      placeholder="e.g., Premium Plan"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                      placeholder="Plan description..."
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (in dollars) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                        placeholder="9.99"
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select
                        value={newPlan.currency}
                        onChange={(e) => setNewPlan({...newPlan, currency: e.target.value})}
                      >
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="gbp">GBP</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Billing Interval</label>
                      <select
                        value={newPlan.interval}
                        onChange={(e) => setNewPlan({...newPlan, interval: e.target.value})}
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                        <option value="week">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setShowCreatePlan(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button onClick={createPlan} className="create-btn">
                    Create Plan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Plans Table */}
          <div className="table-container">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Interval</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.plan_id} className={!plan.is_active ? 'plan-inactive' : ''}>
                    <td>
                      <div className="plan-name">
                        {plan.name}
                        <div className="plan-id">ID: {plan.plan_id}</div>
                      </div>
                    </td>
                    <td>{plan.description || 'No description'}</td>
                    <td>
                      <div className="price">
                        ${(plan.price / 100).toFixed(2)} {plan.currency.toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <span className="interval-badge">
                        {plan.interval}
                      </span>
                    </td>
                    <td>
                      <span className={`plan-status ${plan.is_active ? 'active' : 'inactive'}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(new Date(plan.created * 1000))}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => togglePlanStatus(plan.plan_id, plan.is_active)}
                          className={`action-btn ${plan.is_active ? 'disable-btn' : 'enable-btn'}`}
                        >
                          {plan.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => archivePlan(plan.plan_id)}
                          className="action-btn archive-btn"
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
