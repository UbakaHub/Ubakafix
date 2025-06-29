// src/pages/CheckStatus.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Application = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  permit_type: string;
  status: string;
};

type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'More Info Required'
  | 'Approved'
  | 'Rejected';


const CheckStatus = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Application | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setResult(null);

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('tracking_code', code)
      .single();

    if (error || !data) {
      setError('No application found with that code.');
    } else {
      setResult(data);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem' }}>
      <h2> Check Application Status</h2>
      <input
        type="text"
        placeholder="Enter your tracking code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          marginTop: '1rem',
          marginBottom: '1rem',
          fontSize: '1rem',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Check Status
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '2rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h4>Application Details</h4>
          <p><strong>Name:</strong> {result.fullName}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Phone:</strong> {result.phone}</p>
          <p><strong>Category:</strong> {result.category}</p>
          <p><strong>Permit:</strong> {result.permit_type}</p>
          <p><strong>Status:</strong> {result.status as ApplicationStatus}</p>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
