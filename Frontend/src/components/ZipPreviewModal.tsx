import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FilePreview {
  type: 'pdf' | 'image' | 'text' | 'cad' | 'unsupported';
  name: string;
  content?: string;
  url?: string;
}

interface ZipPreviewModalProps {
  files: File[];
  onClose: () => void;
  onSubmit: () => void;
}

const ZipPreviewModal = ({ files, onClose, onSubmit }: ZipPreviewModalProps) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch previews when files change
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

  // Initialize Forge Viewer when CAD file is detected
  useEffect(() => {
    const launchForgeViewer = async () => {
      const cadFile = previews.find(p => p.type === 'cad' && p.url);
      if (!cadFile || !document.getElementById('forgeViewer')) return;

      try {
        const tokenRes = await fetch(`${API_BASE_URL}/api/autodesk-token`);
        const { access_token } = await tokenRes.json();

        const options = {
          env: 'AutodeskProduction',
          accessToken: access_token
        };

        Autodesk.Viewing.Initializer(options, () => {
          const viewerDiv = document.getElementById('forgeViewer');
          const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv as HTMLElement);
          viewer.start();

          const documentId = `urn:${cadFile.url}`;
          Autodesk.Viewing.Document.load(documentId, (doc) => {
            const defaultModel = doc.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(doc, defaultModel);
          }, (err) => console.error('Forge viewer load error', err));
        });
      } catch (err) {
        console.error('Forge viewer init failed:', err);
      }
    };

    if (previews.some(p => p.type === 'cad')) {
      launchForgeViewer();
    }
  }, [previews]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        width: '100%',
      }}>
        <h2>Review Submission Package</h2>

        {loading && <p>Generating preview...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {previews.length > 0 && (
          <>
            {previews.map((file, index) => (
              <div key={index} style={{ marginBottom: '2rem' }}>
                <h4>{file.name}</h4>

                {file.type === 'image' && (
                  <img
                    src={file.content}
                    alt={file.name}
                    style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
                  />
                )}

                {file.type === 'pdf' && (
                  <iframe
                    src={file.content}
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ccc' }}
                    title={file.name}
                  />
                )}

                {file.type === 'text' && (
                  <pre style={{
                    backgroundColor: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {file.content}
                  </pre>
                )}

                {file.type === 'cad' && file.url && (
                  <div id="forgeViewer" style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />
                )}

                {file.type === 'unsupported' && (
                  <p style={{ color: 'gray' }}>Preview not available for this file type.</p>
                )}
              </div>
            ))}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !!error}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: (loading || error) ? 0.7 : 1,
            }}
          >
            Confirm Submission
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZipPreviewModal;
