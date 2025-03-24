import { FormEvent, useCallback, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { jobDescs } from "../../constants";
import useTextInput from "../../components/ui/useTextInput";

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

  const [teamUser, setTeamUser] = useState(initialState);
  const [targets, setTargets] = useState(extractor(params));

  const content = useSearchParams()[0].get("content");
  const navi = useNavigate();
  const location = useLocation();

  const Name = useTextInput();
  const Email = useTextInput();
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!content) {
        if (targets.length === 0) {
          alert("찾으시는 직군을 선택해주세요.");
          return;
        }
        return navi(`${location.pathname}?content=기본정보`);
      }

      switch (content) {
        case "기본정보":
          return console.log("기본정보 ㄱㄱ");
      }
    },
    [content, targets, navi, location]
  );

  return (
    <div>
      <form className="col border gap-y-2.5" onSubmit={onSubmit}>
        {!content ? (
          <div>
            <h1>어떤 직군을 영입하고 싶으신가요?</h1>
            <p>여러 직군을 복수 선택할 수 있습니다.</p>
            <ul className="wrap">
              {jobDescs.map((job) => {
                const selected = targets.find((item) => item === job)
                  ? true
                  : false;
                const onClick = () => {
                  setTargets((prev) =>
                    selected
                      ? prev.filter((item) => item !== job)
                      : [...prev, job]
                  );
                };
                return (
                  <li key={job}>
                    <button
                      type="button"
                      onClick={onClick}
                      className={twMerge(
                        "rounded-full bg-white border text-theme",
                        selected && "primary bg-theme text-white"
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
                <div>
                  <Name.Component
                    label="이름"
                    onChangeText={(name) =>
                      setTeamUser((prev) => ({ ...prev, name }))
                    }
                    value={teamUser.name}
                  />
                </div>
                <div>직군</div>
                <Email.Component
                  label="이메일"
                  onChangeText={(email) =>
                    setTeamUser((prev) => ({ ...prev, email }))
                  }
                  value={teamUser.email}
                />
              </>
            ),
          }[content]
        )}
        <div className="row gap-x-2.5">
          <button type="button" onClick={() => navi(-1)}>
            이전
          </button>
          <button className="primary px-5">다음</button>
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
  mobile: "010",
  name: "",
  targets: [],
  uid: "",
};
