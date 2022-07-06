import "./App.css";
import { Home } from "./Pages/Home";
import { Navbar } from "./Compo/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profie } from "./Pages/Profie";
import { Login } from "./Pages/Login";
import { Signup } from "./Pages/Signup";
import { BlogDetail } from "./Compo/BlogDetail";
import { BottomNavbar } from "./Compo/BottomNavbar";
import { CreateBlog } from "./Pages/CreateBlog";
import { SearchPage } from "./Pages/SearchPage";
import { Upload } from "./Compo/Upload";
import { TagWiseBlog } from "./Compo/TagWiseBlog";
import { Head } from "./Compo/Head";
import { ForgotPassword } from "./Compo/ForgotPassword";
import { ResetPassword } from "./Pages/ResetPassword";
import { SocketProvider } from "./Context/socketProider";
import { Chat } from "./Pages/Chat";
import { ConversatioinsProvider } from "./Context/ConversatioinsProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatScreen } from "./Compo/ChatScreen";
import { ThemeProvider } from "@mui/material/styles";
import blogContext from "./Context/BlogContext";
import { useContext } from "react";
import { CssBaseline } from "@mui/material";

function App() {
  const context = useContext(blogContext);
  let { darkTheme } = context;

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <SocketProvider>
        <ConversatioinsProvider>
          <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
              <CssBaseline />
              <Head title="Dev Blog" />
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/user/:userId" element={<Profie />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/blog/:blogId" element={<BlogDetail />} />
                  <Route path="/blog/edit/:blogId" element={<CreateBlog />} />
                  <Route path="/t/:tag" element={<TagWiseBlog />} />
                  <Route path="/create/" element={<CreateBlog />} />
                  <Route path="/chat/" element={<Chat />} />
                  <Route path="/dm/:userId" element={<ChatScreen />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/password/reset" element={<ForgotPassword />} />
                  <Route
                    path="/password-reset/:userId/:token"
                    element={<ResetPassword />}
                  />
                </Routes>
                {/*<BottomNavbar />*/}
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </ConversatioinsProvider>
      </SocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
