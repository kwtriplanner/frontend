import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MyPlan from './components/Myplan';
import Destination from './components/Destination';
import Persons from './components/Persons';
import Companion from './components/Companion';
import Density from './components/Density';
import Activity from './components/Activity';
import Traffic from './components/Traffic';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myplan" element={<MyPlan />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/persons" element={<Persons />} />
          <Route path="/companion" element={<Companion />} />
          <Route path="/density" element={<Density />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/traffic" element={<Traffic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
