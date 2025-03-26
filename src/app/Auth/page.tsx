import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { jobDescs } from "../../constants";
import useTextInput from "../../components/ui/useTextInput";
import useSelect from "../../components/ui/useSelect";
import { emailValidator } from "../../utils/validator";
import ExForm from "./ExForm";
import ExItem from "./ExItem";
import Loading from "../../components/Loading";
import { AUTH } from "../../context/hooks";
import { FcGoogle } from "react-icons/fc";
import { PROVIDER } from "../../context/zustand.store";

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

  const { email, name, uid, isWithProvider, setWithProvider } =
    PROVIDER.store();
  const [teamUser, setTeamUser] = useState(initialState);
  const [targets, setTargets] = useState(
    import.meta.env.DEV ? initialState.targets : extractor(params)
  );
  const [password, setPassword] = useState(import.meta.env.DEV ? "123123" : "");

  const [isInsertingEx, setIsInsertingEx] = useState(false);

  const content = useSearchParams()[0].get("content");
  const navi = useNavigate();
  const location = useLocation();

  const Name = useTextInput();
  const Mobile = useTextInput();
  const Email = useTextInput();
  const Password = useTextInput();
  const Job = useSelect();

  const emailMessage = useMemo(() => {
    if (isWithProvider) {
      return null;
    }
    const isEmailValid = emailValidator(teamUser.email);

    return isEmailValid ? null : "이메일을 확인해주세요.";
  }, [teamUser.email, isWithProvider]);

  const nameMessage = useMemo(() => {
    if (teamUser.name.length === 0) {
      return "이름을 입력하세요.";
    }
    if (teamUser.name.length < 2) {
      return "이름이 너무 짧습니다.";
    }
    return null;
  }, [teamUser.name]);
  const mobileMessage = useMemo(() => {
    if (teamUser.mobile.length === 0) {
      return "연락처를 입력해주세요.";
    }
    if (!teamUser.mobile.startsWith("010")) {
      return "연락처를 확인해주세요. 010으로 시작해야합니다.";
    }
    if (
      teamUser.mobile.includes(" ") ||
      teamUser.mobile.includes("-") ||
      teamUser.mobile.includes("/")
    ) {
      return "숫자만 입력해주세요.";
    }
    if (teamUser.mobile.length !== 11) {
      return "휴대전화번호는 11자리입니다.";
    }
  }, [teamUser.mobile]);
  const passwordMessage = useMemo(() => {
    if (isWithProvider) {
      return null;
    }
    if (password.length === 0) {
      return "비밀번호를 입력하세요.";
    }
    if (password.length < 6) {
      return "비밀번호가 너무 짧습니다.";
    }
    if (password.length > 12) {
      return "비밀번호가 너무 깁니다.";
    }
    return null;
  }, [password, isWithProvider]);

  const goodToGo = useMemo(() => {
    if (teamUser.jobDesc.length === 0) {
      return "찾는 직업군";
    }
    if (
      nameMessage ||
      mobileMessage ||
      emailMessage ||
      passwordMessage ||
      teamUser.jobDesc.length === 0
    ) {
      return "기본정보";
    }
    if (teamUser.experiences.length === 0) {
      return "경력";
    }
    if (teamUser.intro.length === 0) {
      return "자소서";
    }
    return null;
  }, [nameMessage, mobileMessage, emailMessage, passwordMessage, teamUser]);

  // const [isPending, startTransition] = useTransition();
  const { isPending, signup, signinWithProvider } = AUTH.use();

  const onSubmit = useCallback(
    async (e: FormEvent) => {
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
          if (nameMessage) {
            alert(nameMessage);
            return Name.focus();
          }
          if (teamUser.jobDesc.length === 0) {
            alert("전문 분야를 선택해주세요.");
            return Job.showPicker();
          }
          if (mobileMessage) {
            alert(mobileMessage);
            return Mobile.focus();
          }
          if (emailMessage) {
            alert(emailMessage);
            return Email.focus();
          }
          if (passwordMessage) {
            alert(passwordMessage);
            return Password.focus();
          }

          return navi(`${location.pathname}?content=경력`);

        case "경력":
          if (teamUser.experiences.length === 0) {
            return alert("경력을 추가해주세요.");
          }
          return navi(`${location.pathname}?content=자소서`);
        case "자소서":
          if (goodToGo) {
            if (goodToGo === "찾는 직업군") {
              alert("찾는 직업군을 선택해주세요.");
              return navi(location.pathname);
            }
            alert(`${goodToGo} 내용을 확인해주세요.`);
            return navi(`${location.pathname}?content=${goodToGo}`);
          }

          // startTransition(async () => {
          //   // await
          // });
          const { message, success } = await signup(
            teamUser,
            password,
            uid ?? undefined
          );
          if (!success) {
            return alert(message);
          }
          alert(
            isWithProvider
              ? "회원정보가 업데이트 되었습니다."
              : `${teamUser.name} 님 회원가입을 진심으로 축하드립니다.`
          );
          navi("/my");
          return console.log(teamUser.intro);
      }
    },
    [
      isWithProvider,
      content,
      targets,
      navi,
      location,
      Name,
      Job,
      Email,
      nameMessage,
      emailMessage,
      passwordMessage,
      Password,
      teamUser,
      Mobile,
      mobileMessage,
      goodToGo,
      signup,
      password,
      uid,
    ]
  );

  useEffect(() => {
    if (isWithProvider && email) {
      setTeamUser((prev) => ({ ...prev, name: name ?? "", email }));
    }
  }, [isWithProvider, name, email]);
  return (
    <div>
      {isPending && <Loading message="회원가입이 진행중입니다..." />}
      <form className="col gap-y-2.5 p-5 max-w-100 mx-auto" onSubmit={onSubmit}>
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
                <div className="row gap-x-2.5">
                  <Name.Component
                    label="이름"
                    onChangeText={(name) =>
                      setTeamUser((prev) => ({ ...prev, name }))
                    }
                    value={teamUser.name}
                    divClassName="flex-2"
                    message={nameMessage}
                    onSubmitEditing={() => {
                      if (nameMessage) {
                        alert(nameMessage);
                        return Name.focus();
                      }
                      Job.showPicker();
                    }}
                  />
                  <Job.Component
                    containerClassName="flex-1"
                    data={jobDescs}
                    onChangeSelect={(job) => {
                      setTeamUser((prev) => ({
                        ...prev,
                        jobDesc: job as TeamUserJob,
                      }));
                      Email.focus();
                    }}
                    value={teamUser.jobDesc}
                    label="전문 분야"
                  />
                </div>

                <Mobile.Component
                  label="휴대전화 번호"
                  onChangeText={(mobile) =>
                    setTeamUser((prev) => ({ ...prev, mobile }))
                  }
                  value={teamUser.mobile}
                  message={mobileMessage}
                  onSubmitEditing={() => {
                    if (mobileMessage) {
                      alert(mobileMessage);
                      return Mobile.focus();
                    }
                    console.log("submit gogo");
                  }}
                />
                {!isWithProvider && (
                  <>
                    <Email.Component
                      label="이메일"
                      onChangeText={(email) =>
                        setTeamUser((prev) => ({ ...prev, email }))
                      }
                      value={teamUser.email}
                      message={emailMessage}
                      onSubmitEditing={() => {
                        if (emailMessage) {
                          alert(emailMessage);
                          return Email.focus();
                        }
                        console.log("submit gogo");
                      }}
                    />
                    <Password.Component
                      label="비밀번호"
                      onChangeText={setPassword}
                      value={password}
                      message={passwordMessage}
                      onSubmitEditing={() => {
                        if (passwordMessage) {
                          alert(passwordMessage);
                          return Password.focus();
                        }
                      }}
                      props={{ type: "password" }}
                    />
                  </>
                )}
              </>
            ),
            경력: (
              <>
                <div className="col">
                  <label htmlFor="ex-form" className="text-sm text-gray-500">
                    경력추가
                  </label>

                  {teamUser.experiences.length > 0 && (
                    <ul className="my-2.5">
                      {teamUser.experiences.map((ex, index) => (
                        <ExItem
                          key={ex.name}
                          item={ex}
                          index={index}
                          onDelete={() => {
                            if (confirm("해당 경력을 삭제하시겠습니까?")) {
                              setTeamUser((prev) => ({
                                ...prev,
                                experiences: prev.experiences.filter(
                                  (item) => item.name !== ex.name
                                ),
                              }));
                              alert("삭제되었습니다.");
                            }
                          }}
                          onUpdate={(newEx) =>
                            setTeamUser((prev) => ({
                              ...prev,
                              experiences: prev.experiences.map((item) =>
                                item.name === ex.name ? newEx : item
                              ),
                            }))
                          }
                        />
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsInsertingEx(true)}
                    id="ex-form"
                    className={twMerge(
                      teamUser.experiences.length === 0 && "mt-1"
                    )}
                  >
                    경력 추가
                  </button>
                </div>

                {isInsertingEx && (
                  <div className="fixed w-full top-0 left-0 p-5 bg-white h-screen overflow-y-auto">
                    <ExForm
                      onCancel={() => setIsInsertingEx(false)}
                      onChange={(ex) =>
                        setTeamUser((prev) => ({
                          ...prev,
                          experiences: [ex, ...prev.experiences],
                        }))
                      }
                    />
                  </div>
                )}
              </>
            ),
            자소서: (
              <div className="col gap-y-1">
                <label htmlFor="intro" className="text-gray-500 text-sm">
                  자기소개
                </label>
                <textarea
                  value={teamUser.intro}
                  onChange={(e) =>
                    setTeamUser((prev) => ({ ...prev, intro: e.target.value }))
                  }
                  placeholder="자기소개 내용을 철저하게 입력하세요. 좋은 팀원을 구할 수 있는 첫 번째 지름길입니다."
                  className="resize-none h-[50vh] p-2.5 border border-border rounded bg-lightGray focus:bg-white outline-none focus:border-theme"
                />
              </div>
            ),
          }[content]
        )}
        <div className="row gap-x-2.5 mt-2.5">
          <button type="button" className="flex-1" onClick={() => navi(-1)}>
            이전
          </button>
          <button className="primary px-5 flex-2">
            {content === "자소서"
              ? isWithProvider
                ? "정보추가"
                : "회원가입"
              : "다음"}
          </button>
        </div>
        {!isWithProvider && (
          <div className="col gap-y-2.5">
            <span className="w-full block text-center mt-5">OR</span>
            <Link to={"/login"} type="button" className="primary w-full">
              로그인하기
            </Link>
            <button
              type="button"
              className="w-full gap-x-2.5"
              onClick={async () => {
                const { success, message, data } = await signinWithProvider();
                if (!success) {
                  alert(message);
                  if (message?.includes("통합회원")) {
                    navi("/my/account");
                  }

                  if (!data) {
                    return;
                  }
                  const { displayName, phoneNumber, uid, email } = data;
                  setTeamUser((prev) => ({
                    ...prev,
                    name: displayName ?? "",
                    mobile: phoneNumber ?? "010",
                    email: email ?? "",
                  }));
                  setWithProvider(uid, email!, name ?? undefined);
                  if (!phoneNumber) {
                    navi("/auth?content=기본정보");
                    Mobile.focus();
                  } else {
                    navi("/auth?cotent=경력");
                  }
                  if (!displayName) {
                    navi("/auth?content=기본정보");
                    Name.focus();
                  }
                  return;
                }
              }}
            >
              <FcGoogle /> 구글로 계속하기
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const initialState: TeamUser = import.meta.env.DEV
  ? {
      email: "test1@test.com",
      experiences: [
        {
          descs: ["두 발로 걷기", "큰 숨 들이쉬기"],
          length: {
            start: { year: 2024, month: 12 },
            end: "현재까지",
          },
          name: "DW 아카데미",
        },
      ],
      intro: "안녕하세요. \n\n단팥빵",
      jobDesc: "개발자",
      mobile: "01012341234",
      name: "개발자",
      targets: ["기획자", "디자이너", "공동대표"],
      uid: "",
    }
  : {
      email: "",
      experiences: [],
      intro: "",
      jobDesc: "개발자",
      mobile: "010",
      name: "",
      targets: [],
      uid: "",
    };
