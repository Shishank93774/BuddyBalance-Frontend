import Footer from "./components/Footer"
import Navbar from "./components/navbar"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar></Navbar>
              <div className="w-4/5 mx-auto">
                <HomePage></HomePage>
              </div>
              <Footer></Footer>
            </>
          }
        ></Route>
        <Route
          path="/auth"
          element={
            <>
              <Navbar></Navbar>
              <div className="w-4/5 mx-auto">
                <AuthPage></AuthPage>
              </div>
              <Footer></Footer>
            </>
          }
        ></Route>
      </Routes>
    </>
  )
}

export default App
