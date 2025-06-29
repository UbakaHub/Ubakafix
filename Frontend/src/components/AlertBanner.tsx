import { useAlert } from '../context/useAlert';

const AlertBanner = () => {
  const { message, type, clearAlert } = useAlert();

  if (!message) return null;

  const typeClass = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
  }[type];

  return (
    <div className={`alert-banner ${typeClass}`}>
      <span>{message}</span>
      <button
        onClick={clearAlert}
        className="alert-close-btn"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default AlertBanner;
