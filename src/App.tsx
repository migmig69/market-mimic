import { Outlet, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { ChartPage } from "./pages/Chart";
import { useThemeStore } from "./utils";
import { useEffect } from "react";
//
//
function App() {
  const stateTheme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document
      .getElementsByTagName("html")[0]
      .setAttribute("data-theme", stateTheme === "light" ? "light" : "night");
    localStorage.setItem("THEME-V1", stateTheme);
  }, [stateTheme]);

  const Layout = () => {
    return (
      <>
        <Outlet />
      </>
    );
  };
  // MarketMimic
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="chart" element={<ChartPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
