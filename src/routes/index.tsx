import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/common/Layout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Compare from "@/pages/Compare";
import CountryDetail from "@/pages/CountryDetail";
import CountryDatasetPage from "@/pages/CountryDatasetPage";
import Methodology from "@/pages/Methodology";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "leaderboard", element: <Leaderboard /> },
        { path: "compare", element: <Compare /> },
        { path: "country/:iso", element: <CountryDetail /> },
        { path: "country/:iso/universities", element: <CountryDatasetPage kind="universities" /> },
        { path: "country/:iso/cities", element: <CountryDatasetPage kind="cities" /> },
        { path: "methodology", element: <Methodology /> },
        { path: "about", element: <About /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
