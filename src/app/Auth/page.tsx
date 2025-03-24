import { FormEvent, useCallback, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { jobDescs } from "../../constants";
import { twMerge } from "tailwind-merge";

export default function AuthPage() {
  const params = useSearchParams()[0].get("target");

  const extractor = (params: string | null): TeamUserJob[] => {
    if (!params) {
      return [];
    }
    const copy = params.replace(",", "");
    const split = copy.split(" ");
    return split.splice(0, 2) as TeamUserJob[];
  };

  const [targets, setTargeta] = useState(extractor(params));
  const navi = useNavigate();
  const location = useLocation();
  const content = useSearchParams()[0].get("content");
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!content) {
        if (targets.length === 0) {
          alert("찾으시는 직군을 선택해주세요");
          return;
        }
        return navi(`${location}?context=기본정보`);
      }
    },
    [content, location, navi, targets]
  );

  return (
    <div>
      <form className="border col gap-y-2.5" onSubmit={onSubmit}>
        {!content ? (
          <div>
            <h1>어떤 직군을 영입하고 싶으신가요?</h1>
            <p>여러직군을 선택하실 수 있습니다.</p>
            <ul>
              {jobDescs.map((job) => {
                const selected = targets.find((item) => item === job)
                  ? true
                  : false;
                const onClick = () => {};
                return (
                  <li key={job}>
                    <button
                      type="button"
                      className={twMerge(
                        "rounded-full bg-white border text-theme",
                        selected && "primary bg-theme text-white "
                      )}
                    >
                      {job}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          {
            기본정보: (
              <>
                <div>이름</div>
                <div>직군</div>
                <div>이메일</div>
              </>
            ),
          }[content]
        )}
        <div>
          <button type="button" onClick={() => navi(-1)}>
            이전
          </button>
          <button className="primary">다음</button>
        </div>
      </form>
    </div>
  );
}

const initialState: TeamUser = {
  email: "",
  experiences: [],
  intro: "",
  jobDesc: "개발자",
  moblie: "",
  name: "",
};
