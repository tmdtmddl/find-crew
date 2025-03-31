import { useCallback, useMemo, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSelect from "../../components/ui/useSelect";
import { db, FBCollection } from "../../lib/firebase";
import Loading from "../../components/Lodaing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEAM } from "../../context/zustand.store";

interface TeamItemProps {
  item: MatchingTeam;
  user: TeamUser;
}

const TeamItem = ({ item, user }: TeamItemProps) => {
  const isMyPost = useMemo(() => item.uid === user.uid, [item.uid, user.uid]);

  const [fUsers, setFUsers] = useState(item?.fusers ?? []);

  const Users = useSelect();

  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();

  const cachingFn = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: ["matchingTeam", user.uid],
      }),
    [queryClient, user.uid]
  );

  const mutation = useMutation({
    mutationFn: async ({
      payload,
      action,
    }: {
      payload: MatchingTeam;
      action: "CREATE" | "UPDATE" | "DELETE";
    }) => {
      const ref = db.collection(FBCollection.MATCHING);
      try {
        if (action === "UPDATE") {
          await ref.doc(item.id).update({ isFinished: true, fusers: fUsers });
          await db
            .collection(FBCollection.MYTEAM)
            .doc(user.uid)
            .set({
              ...payload,
              tid: [...payload.members.map((user) => user.uid), ...fUsers],
            });
          alert("공고를 종료하였습니다.");
        } else if (action === "CREATE") {
          //   const result = await ref.add(payload);
          await db
            .collection(FBCollection.USERS)
            .doc(user.uid)
            .collection(FBCollection.MYTEAM)
            .doc(item.id)
            .set(item);

          alert("재공고");
        } else {
          if (isMyPost) {
            await ref.doc(payload.id).delete();
            await db
              .collection(FBCollection.USERS)
              .doc(user.uid)
              .collection(FBCollection.MY)
              .doc(payload.id)
              .delete();
          } else {
            await ref
              .doc(payload.id)
              .update({ fid: payload.fid.filter((item) => item !== user.uid) });
          }
          alert("삭제됨");
        }
      } catch (error: any) {
        return error;
      }
    },
    onError: (err) => console.log(err),
    onSuccess: () => cachingFn(),
  });

  const onEnd = useCallback(
    () =>
      startTransition(async () => {
        await mutation.mutateAsync({
          action: "UPDATE",
          payload: { ...item, isFinished: true, fusers: fUsers },
        });
      }),
    [fUsers, item, mutation]
  );

  const onRepost = useCallback(() => {
    const newPost = {
      ...item,
      fid: [],
      fusers: [],
      isFinished: false,
      members: [...item.members],
      name: `[재공고] ${item.name}`,
    } as MatchingTeam;

    startTransition(async () => {
      await mutation.mutateAsync({
        action: "CREATE",
        payload: newPost,
      });
    });
    alert("해당공고를 재공고 했습니다.");
  }, [item, mutation]);

  const onDelete = useCallback(() => {
    if (confirm("공고를 삭제하시겠습니까?")) {
      startTransition(async () => {
        await mutation.mutateAsync({ action: "DELETE", payload: item });
      });
    }
  }, [item, mutation]);

  const navi = useNavigate();
  const { setTeam } = TEAM.store();

  const onEdit = useCallback(() => {
    setTeam(item);
    navi("/find/matching-teams");
  }, [navi, setTeam, item]);
  return (
    <div className="col gap-y-2.5">
      {isPending && <Loading message="공고를 종료하고 있습니다." />}

      <div className="row">
        <Link to={`/find/${item.id}/chat${isMyPost ? "" : `?cid=${user.uid}`}`}>
          <b>[{item?.isFinished ? `모집종료 - ${item.name}` : item.name}]</b>
          {!item.isFinished && `${item.targets?.length}개의 직군을 찾고있음`}
          {item.targets.length}개의 직군을 찾고 있음
        </Link>
        {isMyPost && (
          <>
            <button onClick={onEdit}>수정</button>
          </>
        )}
        <button onClick={onDelete}>삭제</button>
      </div>

      {isMyPost &&
        (!item?.isFinished ? (
          <div className="row gap-x-2.5 items-end">
            <Users.Component
              data={item.fid}
              label="선택된 팀원"
              onChangeSelect={(uid) => {
                const found = fUsers.find((item) => item === uid);
                setFUsers((prev) =>
                  found ? prev.filter((item) => item !== uid) : [...prev, uid]
                );
              }}
              value={""}
            />
            {fUsers.length > 0 && (
              <button onClick={onEnd} className="primary">
                모집마감
              </button>
            )}
          </div>
        ) : (
          <button onClick={onRepost} className="primary">
            재공고
          </button>
        ))}
    </div>
  );
};

export default TeamItem;
