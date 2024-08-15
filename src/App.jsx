import { Navbar, Footer } from './components';
import { HomePage, AuthPage, MyProfile } from './pages';
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <>
              <Navbar></Navbar>
              <div className="w-4/5 mx-auto min-h-screen">
                <AuthPage></AuthPage>
              </div>
              <Footer></Footer>
            </>
          }
        ></Route>
        <Route
          path="/myProfile"
          element={
            <>
              <Navbar></Navbar>
              <div className="w-4/5 mx-auto min-h-screen">
                <MyProfile></MyProfile>
              </div>
              <Footer></Footer>
            </>
          }
        ></Route>
        <Route
          path="/"
          element={
            <>
              <Navbar></Navbar>
              <div className="w-4/5 mx-auto min-h-screen">
                <HomePage></HomePage>
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
