import { useEffect, useState } from 'react';
import { fetchPendingUsers, approveUserById, deleteUserById } from '../api/pendingUsers';
import type { User } from '../types/user';

const PendingUserCards = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const users = await fetchPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      console.error('Error loading pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveUserById(id);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserById(id);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <p>Loading pending users...</p>;

  return (
    <section>
      {pendingUsers.length === 0 ? (
        <p>No pending users to approve.</p>
      ) : (
        pendingUsers.map(user => (
          <div key={user.id} className="card pending">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone || 'N/A'}</p>
            <p>Shift: {user.shift}</p>
            <p>Role: {user.role}</p>
            <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => handleApprove(user.id)} className="approve-button">
                    Approve
                </button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">
                    Delete
                </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default PendingUserCards;