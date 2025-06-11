import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createDonation } from '../api/donations';
import type { AxiosError } from 'axios';

const DonationCreate = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!user || (user.role !== 'manager' && user.role !== 'developer')) {
    return <p>You do not have access to create donations.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return setError('Title is required');
    if (!description.trim()) return setError('Description is required');
    if (description.length > 500) return setError('Description too long');

    try {
      await createDonation({
        title,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : undefined
      });

      setTitle('');
      setDescription('');
      setDeadline('');
      setError(null);

      navigate('/donations');
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      setError(error.response?.data?.msg || 'Failed to create donation');
    }
  };

  return (
    <div className="main-content">
      <section>
        <h2>Create a Community Support</h2>
        <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
          <div>
            <label htmlFor="donation-title">
              <h3>New Title</h3>
            </label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="donation-description"><h3>Description</h3></label>
            <h4>Hello team,</h4>
            
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              style={{ width: '100%' }}
            ></textarea>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="donation-deadline">Deadline:</label>
            <input
              id="donation-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit" className="button-green" aria-label="Submit donation">
              Create
            </button>
            <button type="button" className="button-red" onClick={() => navigate('/donations')} aria-label="Cancel donation">
              Cancel
            </button>
          </div>
        </form>

      </section>
    </div>
  );
};

export default DonationCreate;