import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { store } from "./redux/store";

import "./i18n";
import routes from "./routes";

import Loader from "./components/Loader";

import ThemeProvider from "./contexts/ThemeProvider";
import SidebarProvider from "./contexts/SidebarProvider";
import LayoutProvider from "./contexts/LayoutProvider";
import ChartJsDefaults from "./utils/ChartJsDefaults";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AuthProvider from "./contexts/JWTProvider";
import AuthProviderMsal from "src/components/auth/authProvider";

// import {CollapseProvider} from './contexts/SectionProvider';
const App = () => {
  const content = useRoutes(routes);

  return (
    <AuthProviderMsal>
      <HelmetProvider>
        <Helmet titleTemplate="%s | Progrec Apps" defaultTitle="Progrec Apps" />
        <Suspense fallback={<Loader />}>
          <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
              <ThemeProvider>
                <SidebarProvider>
                  <LayoutProvider>
                    <ChartJsDefaults />
                    {/* <CollapseProvider> */}
                    <AuthProvider>{content}</AuthProvider>
                    {/* </CollapseProvider> */}
                  </LayoutProvider>
                </SidebarProvider>
              </ThemeProvider>
            </DndProvider>
          </Provider>
        </Suspense>
      </HelmetProvider>
    </AuthProviderMsal>
  );
};

export default App;
