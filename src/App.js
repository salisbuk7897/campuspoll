import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home.js"
import Register from "./components/register.js";
import Login from "./components/login.js";
import AddPoll from "./components/addpoll.js";
import Vote from "./components/vote.js";
import Choice from "./components/choice.js";
import Result from "./components/result.js";
import Logout from "./components/logout.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="addpoll" element={<AddPoll />} />
        <Route path="vote" element={<Vote />} />
        <Route path="choice" element={<Choice />} />
        <Route path="result" element={<Result />} />
        <Route path="logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
