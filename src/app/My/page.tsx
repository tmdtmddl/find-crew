import { Link, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Team from "./Team";

const MyPage = (user: TeamUser) => {
  //Todo: 매칭되고 있는 팀 + 문의하기
  //Todo: 어카운트 페이지로 이동
  const content = useSearchParams()[0].get("content");
  return (
    <div className="row">
      <aside className="h-screen overflow-y-auto border-r border-border">
        <ul>
          {links.map((link) => (
            <li key={link.name} className="min-w-25">
              <Link
                to={link.path}
                className={twMerge(
                  "rounded-none justify-start hover:bg-border",
                  link.content === content && "text-theme"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div>
        {content ? (
          {
            matching: <Team {...user} />,
            done: <>나랑 매칭된 팀들</>,
          }[content]
        ) : (
          <h1>No Content</h1>
        )}
      </div>
    </div>
  );
};

export default MyPage;

const links = [
  { name: "매칭중", path: "/my?content=matching", content: "matching" },
  { name: "매칭완료", path: "/my?content=done", content: "done" },
  { name: "프로필", path: "account" },
];
