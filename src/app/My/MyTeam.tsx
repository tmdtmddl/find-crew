import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db, FBCollection } from "../../lib/firebase";
import Loading from "../../components/Lodaing";
import { Link } from "react-router-dom";
import MyTeamItem from "./MyTeamItem";
import { useCallback } from "react";

const ref = db.collection(FBCollection.MYTEAM);
const queryKey = ["myTeam"];

const MyTeam = (user: TeamUser) => {
  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async (): Promise<MatchedTeam[]> => {
      try {
        const snap = await ref
          .where("tid", "array-contains-any", [user.uid])
          .get();
        const data = snap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as MatchedTeam)
        );

        return data ?? [];
      } catch (error: any) {
        console.log(error);
        return [];
      }
    },
  });

  const queryClient = useQueryClient();
  const cachingFn = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
    console.log("re-fetch", queryKey);
  }, [queryClient]);

  const mutation = useMutation({
    mutationFn: async ({
      action,
      payload,
    }: {
      payload: MatchedTeam;
      action: MutationAction;
    }) => {
      try {
        const isPostMine = payload.id === user.uid;
        if (action === "DELETE") {
          await ref.doc(payload.id).update({
            fid: isPostMine ? [] : payload.fid.filter((id) => id !== user.uid),
            fusers: isPostMine
              ? []
              : payload.fusers?.filter((id) => id !== user.uid),
            isFinished: false,
            tid: isPostMine ? [] : payload.tid.filter((id) => id !== user.uid),
          });
          alert(isPostMine ? "팀을 해체했습니다." : "팀에서 나왔습니다.");
        }
      } catch (error: any) {
        return error;
      }
    },

    onError: (error) => alert(error.message),
    onSuccess: () => {
      cachingFn();
    },
  });

  if (isPending) {
    return <Loading message="나와 매칭된 팀을 불러오고 있습니다." />;
  }
  if (error || !data) {
    return (
      <Loading
        message={`Error: ${error.message}`}
        iconClassName="text-red-500"
      />
    );
  }

  return (
    <div className="w-full">
      <h1>나와 매칭된 팀들</h1>
      <ul>
        {data.length > 0 ? (
          data.map((item) => (
            <li key={item.id}>
              <MyTeamItem
                item={item}
                onDelete={() => {
                  if (confirm("매칭된 팀을 삭제하시겠습니까?")) {
                    mutation.mutateAsync({ payload: item, action: "DELETE" });
                  }
                }}
              />
            </li>
          ))
        ) : (
          <div className="col gap-y-2.5">
            <p>아직 매칭된 팀이 존재하지 않습니다.</p>
            <Link to="/my?content=matching">나와 매칭 중인 팀 보기</Link>
          </div>
        )}
      </ul>
    </div>
  );
};

export default MyTeam;
