const RedirectNotice = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🚚 This project has moved!</h2>
      <p style={{ marginTop: '1rem' }}>
        Hello! This demo has been moved to a dedicated server for better stability and performance.
      </p>
      <p style={{ marginTop: '1rem' }}>
        You can now access the updated version here:
      </p>
      <p style={{ marginTop: '1rem' }}>
        👉 <a
          href="https://bakeryhub.app.freepixel.dev"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 'bold', color: 'darkred' }}
        >
          bakeryhub.app.freepixel.dev
        </a>
      </p>
      <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        Thank you for your interest in the Bakery Crew Hub 🍰
      </p>
    </div>
  );
};

export default RedirectNotice;