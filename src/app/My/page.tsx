import { Link, useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Post from "./Post";
import MyTeam from "./MyTeam";
import Team from "./Team";
import AccountPage from "./Account/page";

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
      <div className="col">
        {content ? (
          {
            post: <Post {...user} />,
            my: <MyTeam {...user} />,
            matching: <Team {...user} />,
            account: <AccountPage {...user} />,
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
  { name: "내가 올린 공고", path: "/my?content=post", content: "post" },
  { name: "매칭진행중", path: "/my?content=matching", content: "matching" },
  { name: "매칭완료", path: "/my?content=my", content: "my" },
  { name: "프로필", path: "/my?content=account", content: "account" },
];
