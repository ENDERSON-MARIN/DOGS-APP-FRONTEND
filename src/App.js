import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome.jsx";
import Home from "./components/Home/Home.jsx";
import DogDetail from "./components/DogDetails/DogDetail.jsx";
import CreateDog from "./components/CreateDog/CreateDog.jsx";
import UpdateDog from "./components/UpdateDog/UpdateDog.jsx";
import DogsFavorites from "./components/DogsFavorites/DogsFavorites.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/dogDetails/:id" element={<DogDetail />} />
          <Route exact path="/dogCreate" element={<CreateDog />} />
          <Route exact path="/dogUpdate/:id" element={<UpdateDog />} />
          <Route exact path="/dogsFavorites" element={<DogsFavorites />} />
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
