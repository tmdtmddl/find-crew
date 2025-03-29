import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import useTextInput from "../../../components/ui/useTextInput";
import useSelect from "../../../components/ui/useSelect";
import { AUTH } from "../../../context/hooks";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { db, FBCollection } from "../../../lib/firebase";
import { jobDescs } from "../../../constants";
import AppForm from "../../../components/ui/AppForm";
import { isSameStringArray, lengthCheck } from "../../../utils/validator";
import Loading from "../../../components/Lodaing";

const initialState: MatchingTeam = {
  descs: [],
  fid: [],
  id: "",
  intro: "",
  members: [],
  name: "",
  targets: [],
  uid: "",
};

const MatchingForm = ({
  payload,
  onCancel,
  onSubmitEditing,
}: FormProps<MatchingTeam>) => {
  const { user } = AUTH.use();

  const [post, setPost] = useState(
    payload ?? { ...initialState, uid: user?.uid as string, members: [user!] }
  );
  const [desc, setDesc] = useState("");
  const [isAddingMem, setIsAddingMem] = useState(false);
  const [email, setEmail] = useState("");
  const [isInsertingDesc, setIsInsertingDesc] = useState(false);

  const onChangeP = useCallback((target: keyof MatchingTeam, value: any) => {
    setPost((prev) => ({ ...prev, [target]: value }));
  }, []);

  const Name = useTextInput();
  const Target = useSelect();
  const Desc = useTextInput();
  const Member = useTextInput();
  const introRef = useRef<HTMLTextAreaElement>(null);
  const focusIntro = useCallback(
    () => setTimeout(() => introRef.current?.focus(), 100),
    []
  );

  const nameMessage = useMemo(() => {
    if (!lengthCheck(post.name)) {
      return "회사/팀 이름을 입력해주세요.";
    }
    return null;
  }, [post.name]);
  const targetMessage = useMemo(() => {
    if (!lengthCheck(post.targets)) {
      return "구인 직군을 1개 이상 선택해주세요.";
    }
    return null;
  }, [post.targets]);
  const introMessage = useMemo(() => {
    if (!lengthCheck(post.intro)) {
      return "회사 소개를 입력해주세요.";
    }
    return null;
  }, [post.intro]);
  const exMessage = useMemo(() => {
    if (!lengthCheck(post.descs)) {
      return "최소 1개 이상의 세부 자격 요건을 입력해주세요.";
    }
    return null;
  }, [post.descs]);

  const findUser = useCallback(async () => {
    try {
      const found = post.members.find((item) => item.email === email);
      if (found) {
        return alert("이미 추가된 멤버입니다.");
      }
      const ref = db.collection(FBCollection.USERS);
      const snap = await ref.where("email", "==", email).get();
      const data = snap.docs.map(
        (doc) => ({ ...doc.data(), uid: doc.id } as TeamUser)
      );
      if (!data) {
        return alert("검색된 멤버가 존재하지 않습니다.");
      }
      if (data[0]) {
        if (confirm(`${data[0].name} 님이 맞으신가요?`)) {
          onChangeP("members", [...post.members, data[0]]);
          alert("멤버가 추가되었습니다.");
          return setIsAddingMem(false);
        }
      }
      alert("멤버가 존재하지 않습니다.");
    } catch (error: any) {
      return alert(error.message);
    }
  }, [email, post.members, onChangeP]);

  const [isPending, starT] = useTransition();
  const onSubmit = useCallback(() => {
    if (isInsertingDesc) {
      return;
    }
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }
    if (targetMessage) {
      alert(targetMessage);
      return Target.showPicker();
    }
    if (introMessage) {
      alert(introMessage);
      return focusIntro();
    }
    if (exMessage) {
      alert(exMessage);
      return Desc.focus();
    }
    starT(async () => {
      try {
        const ref = db.collection(FBCollection.MATCHING);
        if (payload) {
          if (
            payload.name === post.name &&
            payload.intro === post.intro &&
            isSameStringArray(payload.targets, post.targets) &&
            isSameStringArray(payload.descs, post.descs) &&
            isSameStringArray(
              payload.members.map((user) => user.uid),
              post.members.map((user) => user.uid)
            )
          ) {
            return alert("변경사항이 없습니다.");
          }
          await ref.doc(payload.id).update(post);
        } else {
          await ref.add(post);
        }
        alert(`공고가 ${payload ? "수정" : "등록"}되었습니다.`);
        onCancel();
        if (onSubmitEditing) {
          onSubmitEditing();
        }
      } catch (error: any) {
        alert(error.message);
      }
    });
  }, [
    onCancel,
    onSubmitEditing,
    post,
    nameMessage,
    exMessage,
    targetMessage,
    introMessage,
    Name,
    Desc,
    Target,
    focusIntro,
    payload,
    isInsertingDesc,
  ]);
  return (
    <AppForm onSubmit={onSubmit}>
      {isPending && (
        <Loading
          message={
            payload ? "공고를 수정하고 있습니다..." : "공고를 등록중입니다..."
          }
        />
      )}
      <Name.Component
        value={post.name}
        label="회사이름/팀이름"
        onChangeText={(name) => onChangeP("name", name)}
        placeholder="DW 아카데미"
      />
      <div className="col gap-y-1">
        <div className="row">
          <Target.Component
            data={jobDescs}
            label="구인 직군"
            onChangeSelect={(target) => {
              const found = post.targets.find((item) => item === target);

              onChangeP(
                "targets",
                !found
                  ? [target, ...post.targets]
                  : post.targets.filter((item) => item !== target)
              );
            }}
            value={""}
            containerClassName="min-w-25"
          />
        </div>
        {post.targets.length > 0 && (
          <ul className="wrap">
            {post.targets.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  onClick={() =>
                    onChangeP(
                      "targets",
                      post.targets.filter((item) => item !== t)
                    )
                  }
                  className="h-auto p-1 text-sm text-gray-500"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col gap-y-1">
        <label htmlFor="intro" className="text-gray-500 text-sm">
          회사/팀 소개
        </label>
        <textarea
          ref={introRef}
          value={post.intro}
          onChange={(e) => onChangeP("intro", e.target.value)}
          placeholder="회사소개 내용을 철저하게 입력하세요. 좋은 팀원을 구할 수 있는 첫 번째 지름길입니다."
          className="resize-none h-[20vh] p-2.5 border border-border rounded bg-lightGray focus:bg-white outline-none focus:border-theme min-h-25"
        />
      </div>

      <Desc.Component
        label="세부 자격 요건"
        onChangeText={setDesc}
        value={desc}
        //   message={descMessage}
        placeholder="웹사이트 개발 고수"
        props={{
          onKeyDown: ({ key, nativeEvent }) => {
            if (
              (key === "Enter" || key === "Tab") &&
              !nativeEvent.isComposing
            ) {
              const found = post.descs.find((item) => item === desc);
              if (found) {
                return alert("중복된 경력 사항입니다.");
              }
              onChangeP("descs", [...post.descs, desc]);
              setDesc("");
              Desc.focus();
            }
          },
          onFocus: () => setIsInsertingDesc(true),
          onBlur: () => setIsInsertingDesc(false),
        }}
        // resetHidden
      />

      {post.descs.length > 0 && (
        <ul className="col gap-y-1">
          {post.descs.map((d, index) => (
            <li
              key={d}
              className="text-sm border border-border rounded px-1 bg-lightGray row justify-between items-center"
            >
              {index + 1}. {d}
              <button
                type="button"
                className="h-auto p-0"
                onClick={() =>
                  onChangeP(
                    "descs",
                    post.descs.filter((item) => item !== d)
                  )
                }
              >
                <AiOutlineClose />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="col gap-y-1">
        <label htmlFor="add-mem" className="text-sm text-gray-500">
          멤버
        </label>
        <button type="button" id="add-mem" onClick={() => setIsAddingMem(true)}>
          멤버추가
        </button>
        {post.members.length > 0 && (
          <ul className="wrap">
            {post.members.map((member) => (
              <li key={member.uid}>
                <button
                  type="button"
                  className="h-auto py-1"
                  onClick={() => {
                    const isMine = post.members.find(
                      (item) => item.uid === user?.uid
                    );
                    if (isMine) {
                      return alert("자신은 삭제할 수 없습니다.");
                    }
                    onChangeP(
                      "members",
                      post.members.filter((item) => item.uid !== member.uid)
                    );
                  }}
                >
                  {member.email} {member.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isAddingMem && (
        <div className="modal flex justify-center items-center bg-black/20">
          <span className="modal-bg" />
          <div className="modal-content bg-white p-5 rounded-xl border border-border shadow-md row gap-x-2.5 items-end">
            <button
              type="button"
              className="absolute top-2.5 right-2.5 h-5 w-5 p-0 bg-white text-gray-500 hover:text-black"
              onClick={() => setIsAddingMem(false)}
            >
              <AiOutlineCloseCircle />
            </button>
            <Member.Component
              value={email}
              label="이메일"
              onChangeText={setEmail}
              placeholder="member@email.com"
              props={{
                onKeyDown: async ({ key, nativeEvent }) => {
                  if (key === "Enter" || key === "Tab") {
                    if (!nativeEvent.isComposing) {
                      findUser();
                    }
                  }
                },
              }}
            />
            <button type="button" className="primary" onClick={findUser}>
              검색
            </button>
          </div>
        </div>
      )}

      <div className="row gap-x-2.5 mt-2.5">
        <button type="button" className="flex-1" onClick={onCancel}>
          취소
        </button>
        <button className="flex-2 primary">{payload ? "수정" : "등록"}</button>
      </div>
    </AppForm>
  );
};

export default MatchingForm;
