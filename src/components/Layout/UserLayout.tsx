import { useMemo, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AUTH } from "../../context/hooks";
import { twMerge } from "tailwind-merge";

const UserLayout = ({ user }: { user: TeamUser | null }) => {
  const [isMenuShowing, setIsMenuShowing] = useState(false);

  const menus = useMemo(() => {
    if (!user) {
      return [
        { name: "홈", path: "/" },
        { name: "회원가입", path: "/auth" },
        { name: "로그인", path: "/login" },
      ];
    }
    return [
      { name: "홈", path: "/" },
      { name: "매칭중인팀", path: "/my?content=matching" },
      { name: "매칭된팀", path: "/my?content=my" },
      { name: "팀 찾기", path: "/find" },
      { name: "로그아웃" },
    ];
  }, [user]);

  const navi = useNavigate();
  const { signout } = AUTH.use();

  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <>
      <header
        className={twMerge(
          "relative z-50 bg-white/90",
          pathname !== "/" ? "relative" : "fixed top-0 left-0 w-full"
        )}
      >
        <div className="max-w-300 mt-auto row justify-between p-2.5">
          <Link
            to={user ? "/my" : "/"}
            className="bg-transparent hover:text-theme"
            onClick={() => setIsMenuShowing(false)}
          >
            <h1>{user ? `${user.name}님 안녕하세요!` : "팀매칭앱"}</h1>
          </Link>
          <div className="row gap-x-2.5">
            {pathname === "/find" && (
              <Link to="/find/matching-teams">공고등록</Link>
            )}
            <button
              onClick={() => setIsMenuShowing((prev) => !prev)}
              className="w-10"
            >
              {isMenuShowing ? <AiOutlineClose /> : <AiOutlineMenu />}
            </button>
          </div>
        </div>
      </header>

      {isMenuShowing && (
        <nav className="fixed top-0 right-0 w-full h-screen z-10 ">
          <span
            className="absolute top-0 left-0 w-full h-screen "
            onClick={() => setIsMenuShowing(false)}
          />
          <ul className="relative z-10 p-5 bg-white mt-[61px] border-t border-b border-border shadow-md sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-300 mx-auto lg:border">
            {menus.map((menu) => {
              const onClick = () => {
                setIsMenuShowing(false);
                if (menu.path) {
                  return navi(menu.path);
                }
                if (menu.name === "로그아웃") {
                  if (confirm("로그아웃 하시겠습니까?")) {
                    signout().then(({ message, success }) => {
                      if (!success) {
                        alert(message);
                      } else {
                        alert("로그아웃 되었습니다.");
                        if (pathname === "/find") {
                          return;
                        }
                        navi("/");
                      }
                    });
                  }
                }
              };
              return (
                <li key={menu.name}>
                  <button
                    onClick={onClick}
                    className="w-full bg-transparent hover:bg-lightGray"
                  >
                    {menu.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
