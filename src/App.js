import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./hocs/Layout";
import Charts from "./containers/Home/Charts/Charts";
import Hello from "./components/Hello/Hello";
import PivotTable from "./containers/Home/Pivot/PivotTable";

// Container Imports
const Home = lazy(() => import("./containers/Home/Home"));

function App() {
  const { authData } = useSelector((state) => state.loginSlice);
  return (
    <Layout>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Suspense fallback={null}>
                <Hello />
              </Suspense>
            }
          />
          <Route
            path="/charts"
            exact
            element={
              <Suspense fallback={null}>
                <Charts />
              </Suspense>
            }
          />
          <Route
            path="/pivotTable"
            exact
            element={
              <Suspense fallback={null}>
                <PivotTable />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </Layout>
  );
}

export default App;
