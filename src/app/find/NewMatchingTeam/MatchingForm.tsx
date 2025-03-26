import { useCallback, useState } from "react";
import useTextInput from "../../../components/ui/useTextInput";
import useSelect from "../../../components/ui/useSelect";
import { AUTH } from "../../../context/hooks";
import { AiOutlineClose } from "react-icons/ai";
import { db, FBCollection } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";

const initialState: MatchingTeam = {
  descs: [],
  fid: "",
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
  const navi = useNavigate();
  const { user } = AUTH.use();

  const [post, setPost] = useState(
    payload ?? { ...initialState, uid: user?.uid as string, members: [user!] }
  );
  const [desc, setDesc] = useState("");
  const [target, setTarget] = useState<TeamUserJob | "">("");
  const [isAddingMem, setIsAddingMem] = useState(false);
  const [email, setEmail] = useState("");

  const onChangeP = useCallback((target: keyof MatchingTeam, value: any) => {
    setPost((prev) => ({ ...prev, [target]: value }));
  }, []);

  const Name = useTextInput();
  const Target = useSelect();
  const Intro = useTextInput();
  const Desc = useTextInput();
  const Member = useTextInput();

  return (
    <form className="col gap-y-2.5 max-w-100 mx-auto p -5">
      <Name.Component
        value={post.name}
        label="회사이름/팀이름"
        onChangeText={(name) => onChangeP("name", name)}
        placeholder="DW 아카데미"
      />
      <div className="row">
        <Target.Component
          data={[]}
          label="구인 직군"
          onChangeSelect={(target) => {
            console.log("target", target);
          }}
          value={""}
          containerClassName="min-w-25"
        />
      </div>
      <div className="col gap-y-1">
        <label htmlFor="intro" className="text-gray-500 text-sm">
          자기소개
        </label>
        <textarea
          value={post.intro}
          onChange={(e) => onChangeP("intro", e.target.value)}
          placeholder="회사소개 내용을 철저하게 입력하세요. 좋은 팀원을 구할 수 있는 첫 번째 지름길입니다."
          className="resize-none h-[20vh] p-2.5 border border-border rounded bg-lightGray focus:bg-white outline-none focus:border-theme"
        />
      </div>

      <Desc.Component
        label="세부 경력 내용"
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
      </div>
      {isAddingMem && (
        <div>
          <Member.Component
            value={email}
            label="이메일"
            onChangeText={setEmail}
            placeholder="member@email.com"
            props={{
              onKeyDown: async ({ key, nativeEvent }) => {
                if (key === "Enter" || key === "Tab") {
                  if (!nativeEvent.isComposing) {
                    try {
                      const found = post.members.find(
                        (item) => item.email === email
                      );
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
                          return;
                        }
                      }
                      alert("멤버가 존재하지 않습니다.");
                    } catch (error: any) {
                      return alert(error.message);
                    }
                  }
                }
              },
            }}
          />
        </div>
      )}

      <div className="row gap-x-2.5 mt-2.5">
        <button type="button" className="flex-1" onClick={onCancel}>
          취소
        </button>
        <button className="flex-2 primary">{payload ? "수정" : "등록"}</button>
      </div>
    </form>
  );
};

export default MatchingForm;
