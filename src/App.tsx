import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./app/Home/page";
import AuthPage from "./app/Auth/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index Component={HomePage} />
          <Route path="auth" Component={AuthPage} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
