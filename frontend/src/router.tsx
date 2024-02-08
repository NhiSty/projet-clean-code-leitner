import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ErrorPage } from "./pages/errorPage";
import { HomePage } from "./pages/homePage";
import { CardsPage } from "./pages/cards/cardsPage";
import { NewCardPage } from "./pages/cards/newCardPage";
import { LearningPage } from "./pages/learning/learningPage";
import { LearningLayoutPage } from "./layouts/learningLayoutPage";
import { MainLayout } from "./layouts/mainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/cards",
        element: <MainLayout />,
        children: [
          {
            path: "/cards",
            element: <CardsPage />,
          },
          {
            path: "/cards/new",
            element: <NewCardPage />,
          },
        ],
      },
      {
        path: "/learning",
        element: <LearningLayoutPage />,
        children: [
          {
            path: "/learning",
            element: <LearningPage />,
          },
          {
            path: "/learning/:date",
            element: <LearningPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
