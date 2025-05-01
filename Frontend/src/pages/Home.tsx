// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/start');
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to UbakaFix</h1>
      <p className="home-description">
        Submit, verify, and validate your building applications — all in one place.
      </p>
      <button className="home-start-btn" onClick={handleStart}>
        Start Application
      </button>
    </div>
  );
};

export default Home;
