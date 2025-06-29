import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const trackingCode = location.state?.trackingCode || localStorage.getItem('trackingCode');

  useEffect(() => {
    if (!trackingCode) {
      navigate('/');
    }
  }, [trackingCode, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container">
      <h1>🎉 Thank You!</h1>
      <p>Your application has been successfully submitted.</p>

      <div className="tracking-box">
        <h3>Your Tracking Code</h3>
        <p className="tracking-code">{trackingCode}</p>
        <button className="btn-secondary" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
        <p className="subtext">Please keep this code safe. You'll use it to track your application status.</p>
      </div>

      <button className="btn" onClick={() => navigate('/check-status')}>
        Check My Application Status
      </button>
      <br />
      <button className="btn" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default ThankYou;
