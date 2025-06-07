import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ZipPreviewModal from '../components/ZipPreviewModal';

const ReviewApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { requiredDocs = [], uploadedDocs = {}, previewFiles = [] } = location.state || {};

  const [showZipPreview, setShowZipPreview] = useState(false);

  const handlePreviewAndSubmit = () => {
    setShowZipPreview(true);
  };

  const handleFinalSubmit = () => {
    setShowZipPreview(false);
    alert("✅ Application submitted successfully!");
    navigate('/thank-you');
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1000px',
      margin: 'auto',
      fontFamily: 'Poppins, sans-serif',
      color: '#000'
    }}>
      <h2>Review Your Application Package</h2>
      <p style={{ marginBottom: '2rem', color: '#444' }}>
        Make sure all your documents are correctly uploaded before submitting.
      </p>

      {requiredDocs.map((doc: string) => {
        const file = uploadedDocs[doc];

        return (
          <div
            key={doc}
            style={{
              marginBottom: '2rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: file ? '#f0f8ff' : '#fff0f0'
            }}
          >
            <h4 style={{ marginBottom: '0.5rem' }}>{doc}</h4>
            {file ? (
              <>
                <p><strong>Filename:</strong> {file.name}</p>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ maxWidth: '300px', borderRadius: '4px' }}
                  />
                )}
                {file.type === "application/pdf" && (
                  <embed
                    src={URL.createObjectURL(file)}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                    style={{ border: '1px solid black' }}
                  />
                )}
                {!file.type.includes("image/") && file.type !== "application/pdf" && (
                  <a
                    href={URL.createObjectURL(file)}
                    download={file.name}
                    style={{
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      color: '#007bff',
                      textDecoration: 'underline'
                    }}
                  >
                    📥 Download {file.name}
                  </a>
                )}
              </>
            ) : (
              <p style={{ color: 'red' }}>❌ Not uploaded</p>
            )}
          </div>
        );
      })}

      <button
        onClick={handlePreviewAndSubmit}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Preview & Submit Application
      </button>


      {/* 🧾 Modal for final submission */}
      {showZipPreview && (
        <ZipPreviewModal
          files={Object.values(uploadedDocs).filter(Boolean) as File[]} // Remove any nulls
          onClose={() => setShowZipPreview(false)}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
};

export default ReviewApplication;
