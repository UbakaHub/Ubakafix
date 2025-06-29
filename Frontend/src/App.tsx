import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartApplication from './pages/StartApplication';
import DocumentUpload from './pages/DocumentUpload';
import './App.css';
import ReviewApplication from './pages/ReviewApplication';
import ThankYou from './pages/Thank You & Wait';
import CheckStatus from './pages/CheckStatus';
import Footer from './components/Footer';

function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartApplication />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
        <Route path="/review-application" element={<ReviewApplication />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/check-status" element={<CheckStatus />} />
      </Routes>
    </Router>
    <Footer />
   </>
  );
}

export default App;
