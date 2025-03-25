import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AUTH } from "./context/hooks";
import Loading from "./components/Lodaing";

import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("./app/Home/page"));
const AuthPage = lazy(() => import("./app/Auth/page"));
const LoginPage = lazy(() => import("./app/Login/page"));

export default function App() {
  const { initialized } = AUTH.use();

  return (
    <Suspense fallback={<Loading message="페이지가 로딩중입니다...." />}>
      {!initialized ? (
        <div>
          <h1>기달</h1>
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index Component={HomePage} />
              <Route path="auth" Component={AuthPage} />
              <Route path="login" Component={LoginPage} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </Suspense>
  );
}
