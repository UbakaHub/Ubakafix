import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DocumentUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, permit, fullName, phone, email } = location.state || {};

  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    const fetchRequiredDocs = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL.replace(/\/$/, '')}/api/document-rules/${category}/${permit}`
        );
        const data = await res.json();

        if (!data || !Array.isArray(data.requiredDocuments)) {
          console.error('Invalid response:', data);
          return;
        }

        setRequiredDocs(data.requiredDocuments);
        const initialDocs = Object.fromEntries(data.requiredDocuments.map((doc: string) => [doc, null]));
        setUploadedDocs(initialDocs);
      } catch (error) {
        console.error('Failed to fetch document rules:', error);
      }
    };

    if (category && permit) {
      fetchRequiredDocs();
    }
  }, [category, permit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0] || null;
    setUploadedDocs((prev) => ({ ...prev, [docType]: file }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleSubmitDocuments = () => {
    const hasFiles = Object.values(uploadedDocs).some((file) => file !== null);
    if (!hasFiles) {
      alert("Please upload at least one document before continuing.");
      return;
    }

    navigate('/review-application', {
      state: {
        fullName,
        email,
        phone,
        category,
        permit,
        requiredDocs,
        uploadedDocs,
      },
    });
  };

  return (
    <div className="page-container">
      <h2>Upload Required Documents</h2>
      <p>Please upload the following:</p>

      {requiredDocs.length === 0 && <p style={{ color: 'gray' }}>No documents required.</p>}

      {requiredDocs.map((doc) => (
        <div key={doc} className="file-input-wrapper">
          <label className="form-label">{doc}</label>
          <input type="file" onChange={(e) => handleFileChange(e, doc)} />
          {uploadedDocs[doc] ? (
            <span className="status-uploaded">
              ✅ {uploadedDocs[doc]!.name} ({formatFileSize(uploadedDocs[doc]!.size)})
            </span>
          ) : (
            <span className="status-missing">❌ Missing</span>
          )}
        </div>
      ))}

      {requiredDocs.length > 0 && (
        <button onClick={handleSubmitDocuments} className="btn-primary" style={{ marginTop: '2rem' }}>
          Continue to Review
        </button>
      )}
    </div>
  );
};

export default DocumentUpload;
