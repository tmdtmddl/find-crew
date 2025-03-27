import { useNavigate, useParams } from "react-router-dom";
import { TEAM } from "../../../context/zustand.store";
import FindItem from "../FindItem";
import { useQuery } from "@tanstack/react-query";
import { db, FBCollection } from "../../../lib/firebase";
import Loading from "../../../components/Lodaing";
import { useCallback, useState, useTransition } from "react";
import { AUTH } from "../../../context/hooks";

const FindDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { team, setTeam } = TEAM.store();

  const { isPending, error, data } = useQuery({
    queryKey: ["teams", params.id],
    queryFn: async (): Promise<MatchingTeam | null> => {
      try {
        const ref = db.collection(FBCollection.MATCHING).doc(params.id);

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

  const [isLoading, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const { user } = AUTH.use();

  const navi = useNavigate();

  const onStart = useCallback(() => {
    startTransition(async () => {
      setMessage("공고를 스크랩중입니다.");
      if (!user) {
        if (confirm("로그인이 필요한 기능입니다. 로그인 하시겠습니까?")) {
          navi("/login");
          return;
        }
        return;
      }
      if (user.uid === data?.uid) {
        return alert("자신의 공고입니다.");
      }

      try {
        const ref = db
          .collection(FBCollection.USERS)
          .doc(user.uid)
          .collection(FBCollection.MY)
          .doc(data?.id);

        const snap = await ref.get();
        const doc = snap.data();
        if (doc) {
          return alert("이미 스크랩한 공고입니다.");
        }

        await ref.set({ ...data, fid: user.uid });
        if (
          confirm(
            '공고를 스크랩했습니다. "나의 매칭 진행중 팀" 에서 확인할 수 있습니다. 지금 확인하시겠습니까?'
          )
        ) {
          navi("/my?content=matching");
        }
      } catch (error: any) {
        alert(error.message);
      }
    });
  }, [data, user, navi]);

  const onChat = useCallback(() => {
    startTransition(async () => {
      if (!user) {
        if (confirm("로그인이 필요한 기능입니다. 로그인 하시겠습니까?")) {
          navi("/login");
          return;
        }
        return;
      }
      if (user.uid === data?.uid) {
        return alert("자신의 공고입니다.");
      }

      try {
        const ref = db
          .collection(FBCollection.MATCHING)
          .doc(data?.id)
          .collection(user.uid);
        const newMessage: Chat = {
          createdAt: new Date().toLocaleString(),
          message: `${data?.name}의 공고를 보고 연락드립니다.`,
          uid: user.uid,
          uids: [data?.uid as string, user.uid],
          id: "",
        };

        await ref.add(newMessage);
        alert("문의를 시작합니다.");
        navi(`/find/${data?.id}/chat`);
        setTeam(data);
      } catch (error: any) {
        return alert(error.message);
      }
    });
  }, [data, user, setTeam, navi]);

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

  return (
    <div className="p-5">
      {isLoading && <Loading message={message} />}
      {data && (
        <div>
          {user?.uid === data.uid && (
            <div className="row gap-x-2.5 justify-end mb-2.5">
              <button
                className="hover:text-theme"
                onClick={() => {
                  setTeam(data);
                  navi("/find/matching-teams");
                }}
              >
                수정
              </button>
              <button
                className="hover:text-red-500"
                onClick={() => {
                  if (confirm("해당 공고를 삭제하시겠습니까?")) {
                    startTransition(async () => {
                      setMessage("공고를 삭제중입니다.");
                      try {
                        const ref = db
                          .collection(FBCollection.MATCHING)
                          .doc(data.id);
                        await ref.delete();
                        alert("공고가 삭제되었습니다.");
                        navi("/find");
                        setTeam(null);
                      } catch (error: any) {
                        return alert(error.message);
                      }
                    });
                  }
                }}
              >
                삭제
              </button>
            </div>
          )}
          <FindItem item={data} isFull />
        </div>
      )}
      <div className="row gap-x-2.5 mt-5">
        <button onClick={onStart} className="primary">
          팀 매칭 시작하기
        </button>
        <button onClick={onChat}>문의하기</button>
      </div>
    </div>
  );
};

export default FindDetailPage;
