import "./App.css";
import { Home } from "./Pages/Home";
import { Navbar } from "./Compo/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profie } from "./Pages/Profie";
import { Login } from "./Pages/Login";
import { Signup } from "./Pages/Signup";
import { BlogState } from "./Context/BlogState";
import { BlogDetail } from "./Compo/BlogDetail";
import { BottomNavbar } from "./Compo/BottomNavbar";
import { CreateBlog } from "./Pages/CreateBlog";
import { SearchPage } from "./Pages/SearchPage";
import { Upload } from "./Compo/Upload";
import { TagWiseBlog } from "./Compo/TagWiseBlog";

function App() {
  return (
    <BlogState>
      <BrowserRouter>
        <div className="App" style={{ paddingBottom: 50 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/user/:userId" element={<Profie />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blog/:blogId" element={<BlogDetail />} />
            <Route path="/t/:tag" element={<TagWiseBlog />} />
            <Route path="/create/" element={<CreateBlog />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
          <BottomNavbar />
        </div>
      </BrowserRouter>
    </BlogState>
  );
}

export default App;
