import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { documentRules } from '../utils/documentRules';

const DocumentUpload = () => {
  const location = useLocation();
  const { category, permit } = location.state || {};

  const requiredDocs =
    documentRules[category]?.[permit] || ['No matching document requirements.'];

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: File | null }>(
    Object.fromEntries(requiredDocs.map(doc => [doc, null]))
  );

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

      <button onClick={handleCheckDocuments} style={{ marginTop: '2rem', padding: '0.5rem 1rem' }}>
        Check Documents
      </button>
    </div>
  );
};

export default DocumentUpload;
