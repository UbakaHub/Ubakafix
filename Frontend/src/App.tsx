import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartApplication from './pages/StartApplication';
import DocumentUpload from './pages/DocumentUpload';
import './App.css';
import ReviewApplication from './pages/ReviewApplication';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartApplication />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
        <Route path="/review-application" element={<ReviewApplication />} />
      </Routes>
    </Router>
  );
}

export default App;
