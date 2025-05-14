import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartApplication from './pages/StartApplication';
import DocumentUpload from './pages/DocumentUpload';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<StartApplication />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
