import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartApplication.css';

const StartApplication = () => {
  const [category, setCategory] = useState('');
  const [permitType, setPermitType] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (category && permitType) {
      navigate('/upload-documents', {
        state: { category, permit: permitType },
      });
    } else {
        alert('Please choose both category and permit type.');
    }
  };

  return (
    <div className="start-application-container">
      <h2>Start Your Building Application</h2>
      <p>Please select your building category and permit type to begin.</p>

      <div className="form-group">
        <label htmlFor="category">Building Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">-- Select Category --</option>
            <option value="Category1">Category 1</option>
            <option value="Category2">Category 2</option>
            <option value="Category3">Category 3</option>
            <option value="Category4">Category 4</option>
            <option value="Category5">Category 5</option>
            <option value="Category6">Category 6</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="permit">Permit Type</label>
        <select
          id="permit"
          value={permitType}
          onChange={(e) => setPermitType(e.target.value)}
        >
            <option value="">-- Select Permit Type --</option>
            <option value="New">New Building</option>
            <option value="Refurbishment1">Refurbishment with Structural Alterations</option>
            <option value="Refurbishment2">Refurbishment without Structural Alterrations</option>
            <option value="Occupancy">Occupancy Permit</option>
            <option value="Demolition">Demolition Permit</option>
            <option value="ChangeOfUse">Change Building Use</option>
            <option value="Fence">Fence Building Permit</option>
            <option value="Renewal">Renewal of Expired Building Permit</option>
        </select>
      </div>

      <button className="btn continue" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default StartApplication;
