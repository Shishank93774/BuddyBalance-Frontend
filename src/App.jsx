import { Routes, Route } from "react-router";
import { Navbar, Footer } from './components';
import { HomePage, AuthPage, MyProfile, MyGroups, Group, Transactions, FallBack } from './pages';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop></ScrollToTop>
      <Navbar></Navbar>
      <Routes>
        <Route
          path="/auth"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <AuthPage></AuthPage>
            </div>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <MyProfile></MyProfile>
            </div>
          }
        ></Route>
        <Route
          path="/groups"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <MyGroups></MyGroups>
            </div>
          }
        ></Route>
        <Route
          path="/groups/:id"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <Group></Group>
            </div>
          }
        ></Route>
        <Route
          path="/groups/:id/transactions"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <Transactions></Transactions>
            </div>
          }
        ></Route>
        <Route
          path="/"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <HomePage></HomePage>
            </div>
          }
        ></Route>
        <Route
          path="*"
          element={
            <div className="w-4/5 mx-auto min-h-screen">
              <FallBack></FallBack>
            </div>
          }
        ></Route>
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App
