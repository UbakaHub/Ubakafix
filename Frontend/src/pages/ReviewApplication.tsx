import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ZipPreviewModal from '../components/ZipPreviewModal';

const ReviewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    uploadedDocs = {},
    fullName = '',
    email = '',
    phone = '',
    category = '',
    permit = ''
  } = location.state || {};

  const [showModal, setShowModal] = useState(true);

  const handleFinalSubmit = () => {
    setShowModal(false);
    alert('✅ Application submitted successfully!');
    navigate('/thank-you');
  };

  if (!showModal) return null;

  return (
    <div className="page-overlay">
      <ZipPreviewModal
        files={Object.values(uploadedDocs).filter(Boolean) as File[]}
        uploadedDocs={uploadedDocs}
        onClose={() => navigate(-1)}
        onSubmit={handleFinalSubmit}
        fullName={fullName}
        email={email}
        phone={phone}
        category={category}
        permit={permit}
      />
    </div>
  );
};

export default ReviewApplication;
