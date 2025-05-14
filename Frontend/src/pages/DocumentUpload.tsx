import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DocumentUpload = () => {
  const location = useLocation();
  const { category, permit } = location.state || {};

  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    const fetchRequiredDocs = async () => {
      try {
        const res = await fetch(`https://reimagined-space-orbit-wr57pg975gqxc54r9-8000.app.github.dev/api/document-rules/{category}/{permit}`);
        const data = await res.json();
        setRequiredDocs(data.requiredDocuments);

        // Set initial uploadedDocs state
        const initialDocs = Object.fromEntries(data.requiredDocuments.map((doc: string) => [doc, null]));
        setUploadedDocs(initialDocs);
      } catch (error) {
        console.error("Failed to fetch document rules:", error);
      }
    };

    if (category && permit) {
      fetchRequiredDocs();
    }
  }, [category, permit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0] || null;
    setUploadedDocs(prev => ({ ...prev, [docType]: file }));
  };

  const handleCheckDocuments = () => {
    console.log('Uploaded Documents:', uploadedDocs);
    alert('Mock: Documents submitted for validation!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Upload Required Documents</h2>
      <p>
        Based on your selection (<strong>{category}</strong>, <strong>{permit}</strong>), upload
        the following:
      </p>

      {requiredDocs.length === 0 && <p style={{ color: 'gray' }}>No documents required.</p>}

      {requiredDocs.map(doc => (
        <div key={doc} style={{ marginBottom: '1rem' }}>
          <label>{doc}</label>
          <input type="file" onChange={(e) => handleFileChange(e, doc)} />
          {uploadedDocs[doc] ? (
            <span style={{ color: 'green', marginLeft: '1rem' }}>✅ Uploaded</span>
          ) : (
            <span style={{ color: 'red', marginLeft: '1rem' }}>❌ Missing</span>
          )}
        </div>
      ))}

      {requiredDocs.length > 0 && (
        <button onClick={handleCheckDocuments} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
          Check Documents
        </button>
      )}
    </div>
  );
};

export default DocumentUpload;
