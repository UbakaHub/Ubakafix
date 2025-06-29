import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { uploadDocumentsToSupabase } from '../lib/uploadDocumentsToSupabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FilePreview {
  type: 'pdf' | 'image' | 'text' | 'unsupported';
  name: string;
  content?: string;
  url?: string;
}

interface ZipPreviewModalProps {
  files: File[];
  uploadedDocs: { [key: string]: File | null };
  onClose: () => void;
  onSubmit: () => void;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  permit: string;
}

const ZipPreviewModal = ({
  files,
  uploadedDocs,
  onClose,
  onSubmit,
  fullName,
  email,
  phone,
  category,
  permit
}: ZipPreviewModalProps) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

const generateTrackingCode = () => {
  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `UBK-${yyyymmdd}-${randomDigits}`;
};

const trackingCode = generateTrackingCode();

  useEffect(() => {
    const fetchPreviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch(`${API_BASE_URL}/api/create-zip-preview`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        setPreviews(data.previews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviews();
  }, [files]);

  const handleFinalSubmit = async () => {
    if (!fullName || !email || !phone || !category || !permit) {
      alert("❗ Please fill in all required fields.");
      return;
    }

    console.log('📝 Submitting application with:', {
      full_name: fullName,
      email,
      phone,
      category,
      permit_type: permit,
    });

    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          fullName,
          email,
          phone: phone.toString(),
          category,
          permit_type: permit,
          tracking_code: trackingCode || generateTrackingCode(),
          status: 'Submitted',
        }
      ])
      .select();

    if (error) {
      console.error("❌ Supabase submission error:", error);
      alert("❌ Failed to submit application.");
      return;
    }

    const applicationId = data?.[0]?.id;
    console.log("✅ Application submitted with ID:", applicationId);

    // 🆕 Upload documents to Supabase Storage
    await uploadDocumentsToSupabase(applicationId, uploadedDocs);

    onSubmit();
    navigate('/thank-you', {
      state: {
        trackingCode: data?.[0]?.tracking_code || generateTrackingCode(),
      }
    });
  };

  return (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2 className="modal-header">Review Submission Package</h2>

      {loading && <p>Generating preview...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {previews.length > 0 && (
        <>
          {previews.map((file, index) => (
            <div key={index} className="file-preview">
              <h4>{file.name}</h4>

              {file.type === 'image' && (
                <img src={file.content} alt={file.name} />
              )}

              {file.type === 'pdf' && (
                <iframe
                  src={file.content}
                  height="500px"
                  title={file.name}
                />
              )}

              {file.type === 'text' && (
                <pre>{file.content}</pre>
              )}

              {file.type === 'unsupported' && (
                <p style={{ color: 'gray' }}>⚠️ Preview not available for this file type.</p>
              )}
            </div>
          ))}
        </>
      )}

      <div className="modal-buttons">
        <button className="btn btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-submit"
          onClick={handleFinalSubmit}
          disabled={loading || !!error}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
          {loading && <span className="spinner" />}
        </button>
      </div>
    </div>
  </div>
);
};

export default ZipPreviewModal;
