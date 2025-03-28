import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { TEAM } from "../../../../context/zustand.store";
import { useQuery } from "@tanstack/react-query";
import { db, FBCollection } from "../../../../lib/firebase";
import Loading from "../../../../components/Lodaing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ChatForm from "./ChatForm";

const ChatPage = (user: TeamUser) => {
  const params = useParams<{ id: string }>();

  const { team } = TEAM.store();

  const ref = db.collection(FBCollection.MATCHING).doc(params.id);
  console.log(ref);

  const { isPending, error, data } = useQuery({
    queryKey: ["teams", params.id],
    queryFn: async (): Promise<MatchingTeam | null> => {
      try {
        const snap = await ref.get();
        const data = { ...snap.data(), id: snap.id } as MatchingTeam;
        if (!data) {
          return null;
        }
        return data;
      } catch (error: any) {
        console.log(error);
        return null;
      }
    },
    initialData: team,
  });

  const isAdmin = useMemo(() => {
    if (data?.uid === user.uid) {
      return true;
    }
    return false;
  }, [data?.uid, user.uid]);

  const cid = useSearchParams()[0].get("cid");
  const navi = useNavigate();
  const { pathname } = useLocation();

  const [texts, setTexts] = useState<Chat[]>([]);

  const listRef = useRef<HTMLLIElement>(null);
  const onFocus = useCallback(
    () => setTimeout(() => listRef.current?.scrollIntoView(), 100),
    []
  );

  useEffect(() => {
    if (cid) {
      //! 순서를 만들어주는 함수 orderBy(조건이될 값, 오름차순/내림차순)
      const subMessages = ref
        .collection(cid)
        .orderBy("createdAt", "asc")
        .onSnapshot((snap) => {
          const data = snap.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as Chat)
          );

          if (data) {
            setTexts(data);
          } else {
            setTexts([]);
          }
        });

      subMessages;
      return subMessages;
    }
  }, [params.id, cid]);

  //ref문제인가???????? 콘솔에 왜 계속 출력이되지??????
  console.log(ref);

  // useEffect(() => {
  //   if (texts.length !== length) {
  //     onFocus();
  //     return () => {
  //       onFocus();
  //     };
  //   }
  // }, [texts, onFocus, length]);

  useEffect(() => {
    onFocus();
  }, []);

  if (isPending) {
    return <Loading message="공고를 불러오고 있습니다..." />;
  }
  if (error) {
    return (
      <Loading
        message={`Error: ${error.message}`}
        iconClassName="text-red-500"
      />
    );
  }
  if (!data) {
    return (
      <Loading
        message="존재하지 않는 공고입니다."
        iconClassName="text-zinc-900"
      />
    );
  }

  if (isAdmin && !cid) {
    return (
      <div>
        {data.fid.map((cid) => (
          <button key={cid} onClick={() => navi(`${pathname}?cid=${cid}`)}>
            {cid} 님과의 상담
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] col">
      <div className="flex-1 bg-lightGray p-5 max-h-[calc(100vh-141px)] overflow-y-auto overflow-x-hidden">
        <ul className="col gap-y-2.5">
          {texts.map((text, index) => (
            <li
              key={text.id}
              className={twMerge("row", user.uid === text.uid && "justify-end")}
              ref={index === texts.length - 1 ? listRef : null}
            >
              <div
                className={twMerge(
                  "p-2.5 border border-border max-w-75 rounded-xl relative bg-white",
                  user.uid === text.uid && "bg-theme text-white"
                )}
              >
                {text.message}
                <span
                  className={twMerge(
                    "absolute bottom-0 w-screen text-gray-400 block text-xs font-light",
                    user.uid === text.uid
                      ? "right-[calc(100%+10px)] text-right"
                      : "left-[calc(100%+10px)] text-left"
                  )}
                >
                  {text.createdAt.split(" ")[1]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ChatForm
        myUid={user.uid}
        uid={data?.uid as string}
        cid={cid!}
        id={data.id}
        onFocus={onFocus}
      />
    </div>
  );
};

export default ChatPage;
