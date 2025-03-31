import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AUTH } from "./context/hooks";
import Loading from "./components/Lodaing";
import { Suspense, lazy } from "react";
import UserLayout from "./components/Layout/UserLayout";

const HomePage = lazy(() => import("./app/Home/page"));
const AuthPage = lazy(() => import("./app/Auth/page"));
const LoginPage = lazy(() => import("./app/Login/page"));
const MyPage = lazy(() => import("./app/My/page"));
const AccountPage = lazy(() => import("./app/My/Account/page"));
const FindPage = lazy(() => import("./app/find/page"));
const FindDetailPage = lazy(() => import("./app/find/[id]/page"));
const NewMatchingTeamPage = lazy(
  () => import("./app/find/NewMatchingTeam/page")
);
const ChatPage = lazy(() => import("./app/find/[id]/chat/page"));

export default function App() {
  const { initialized, user } = AUTH.use();
  return (
    <Suspense fallback={<Loading message="페이지가 로딩중입니다..." />}>
      {!initialized ? (
        <div className="w-full h-screen col justify-center items-center bg-theme text-white">
          <h1 className="text-5xl">팀 매칭 앱</h1>
        </div>
      ) : (
        <BrowserRouter basename={import.meta.env.DEV ? "/" : "/find-crew"}>
          <Routes>
            <Route path="/" element={<UserLayout user={user} />}>
              <Route index Component={HomePage} />
              <Route path="auth" Component={AuthPage} />
              <Route path="login" Component={LoginPage} />

              {/* 공고 찾는곳 */}
              <Route path="find">
                <Route index Component={FindPage} />

                <Route path=":id">
                  <Route index Component={FindDetailPage} />
                  {user && (
                    <Route path="chat" element={<ChatPage {...user} />} />
                  )}
                </Route>
                {user && (
                  <>
                    <Route
                      path="matching-teams"
                      element={<NewMatchingTeamPage />}
                    />
                  </>
                )}
              </Route>

              {user && (
                <Route path="my">
                  <Route index element={<MyPage {...user} />} />
                  <Route path="account" element={<AccountPage {...user} />} />
                </Route>
              )}
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </Suspense>
  );
}
