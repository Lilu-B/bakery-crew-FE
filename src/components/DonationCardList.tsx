import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useUser } from '../context/UserContext';
import type { Donation } from '../types/donation';

interface Props {
  donations: Donation[];
}

function DonationCardList({ donations }: Props) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      {donations.map((donation) => {
        const cardClass =
          user?.role === 'user' && donation.hasDonated === true
            ? 'card clickable'
            : 'card active clickable';

        return (
          <div
            key={donation.id}
            className={cardClass}
            role="button"
            tabIndex={0}
            aria-label={`Donation: ${donation.title}, deadline ${format(new Date(donation.deadline), 'd MMM yyyy')}`}
            onClick={() => navigate(`/donations/${donation.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/donations/${donation.id}`);
              }
            }}
          >
            <h3>{donation.title}</h3>
            <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
          </div>
        );
      })}
    </>
  );
}

export default DonationCardList;