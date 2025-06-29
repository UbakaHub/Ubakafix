import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/useAlert'; //
import './StartApplication.css';

const StartApplication = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [permitType, setPermitType] = useState('');

  const navigate = useNavigate();
  const { showAlert } = useAlert(); // ✅ use global alert hook

  const handleContinue = () => {
    if (!fullName || !email || !phone || !category || !permitType) {
      showAlert('Please fill in all fields.', 'error');
      return;
    }

    navigate('/upload-documents', {
      state: {
        fullName,
        email,
        phone,
        category,
        permit: permitType,
      },
    });
  };

  return (
    <div className="start-application-container">
      <h2>Start Your Building Application</h2>
      <p>Please enter your details and select your building category and permit type to begin.</p>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          className='input fullName'
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          className='input email'
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          className='input phone'
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Building Category</label>
        <select
          className='input category'
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
          className='input permit'
          id="permit"
          value={permitType}
          onChange={(e) => setPermitType(e.target.value)}
        >
          <option value="">-- Select Permit Type --</option>
          <option value="New">New Building</option>
          <option value="Refurbishment1">Refurbishment with Structural Alterations</option>
          <option value="Refurbishment2">Refurbishment without Structural Alterations</option>
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
