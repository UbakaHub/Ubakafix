import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ZipPreviewModal from '../components/ZipPreviewModal'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DocumentUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, permit } = location.state || {};

  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File | null }>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [filesToPreview, setFilesToPreview] = useState<File[]>([]);

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

  const handleCheckDocuments = () => {
    const files = Object.values(uploadedDocs).filter((file): file is File => file !== null);
    if (files.length === 0) {
      alert("Please upload at least one document before proceeding.");
      return;
    }
    setFilesToPreview(files);
    setShowPreviewModal(true);
  };

  const handleModalSubmit = () => {
    setShowPreviewModal(false);
    navigate('/review-application', {
      state: {
        category,
        permit,
        requiredDocs,
        uploadedDocs,
        files: filesToPreview,
      }
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload Required Documents</h2>
      <p>Please upload the following:</p>

      {requiredDocs.length === 0 && <p style={{ color: 'gray' }}>No documents required.</p>}

      {requiredDocs.map((doc) => (
        <div key={doc} style={{ marginBottom: '1rem' }}>
          <label>{doc}</label>
          <input type="file" onChange={(e) => handleFileChange(e, doc)} />
          {uploadedDocs[doc] ? (
            <span style={{ color: 'green', marginLeft: '1rem' }}>
              ✅ {uploadedDocs[doc]!.name} ({formatFileSize(uploadedDocs[doc]!.size)})
            </span>
          ) : (
            <span style={{ color: 'red', marginLeft: '1rem' }}>❌ Missing</span>
          )}
        </div>
      ))}

      {requiredDocs.length > 0 && (
        <button onClick={handleCheckDocuments} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
          Review Documents
        </button>
      )}

      {showPreviewModal && (
        <ZipPreviewModal
          files={filesToPreview}
          onClose={() => setShowPreviewModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default DocumentUpload;
