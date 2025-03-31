import { useQuery } from "@tanstack/react-query";
import { db, FBCollection } from "../../lib/firebase";
import Loading from "../../components/Lodaing";
import { Link } from "react-router-dom";
import TeamItem from "./TeamItem";

const Team = (user: TeamUser) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["matchingTeam", user.uid],
    queryFn: async (): Promise<MatchingTeam[]> => {
      try {
        const ref = db
          .collection(FBCollection.USERS)
          .doc(user.uid)
          .collection(FBCollection.MY);

        const snap = await ref.get();

        const data = snap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as MatchingTeam)
        );

        const postRef = db.collection(FBCollection.MATCHING);
        const array: MatchingTeam[] = [];

        for (const item of data) {
          const postSnap = await postRef.doc(item.id).get();
          const postData = postSnap.data() as MatchingTeam;
          array.push(
            postData
              ? { ...postData, id: item.id }
              : ({
                  name: "해당공고 삭제",
                  targets: [],
                  descs: [],
                  fid: [],
                  id: item.id,
                  intro: "",
                  members: [],
                  uid: "",
                  isFinished: true,
                } as MatchingTeam)
          );
        }

        return array ?? [];
      } catch (error: any) {
        console.log(error);
        return [];
      }
    },
  });

  if (isPending) {
    return <Loading message="매칭중인 팀을 불러오고 있습니다..." />;
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
    <div className="p-5">
      {user.uid}
      <h1>매칭 진행 중인 팀 {data.length}개</h1>
      <ul className="col gap-y-2.5 my-5">
        {data.map((team) => (
          <li key={team.id}>
            <TeamItem item={team} user={user} />
          </li>
        ))}
      </ul>
      <Link to={"/find"}>나의 팀 찾기</Link>
    </div>
  );
};

export default Team;

//! 데이터 베이스에 주입하는 방법 아래 참고 (데이터베이스에 주입할때만 한번만 실행하고 주석처리함)
{
  /* <button
        onClick={async () => {
          try {
            const ref = db.collection(FBCollection.MATCHING);

            for (const team of teams) {
              const doc = await ref.add(team);
              console.log(doc);
              console.log(team.name, "공고 등록 완료");
            }
            console.log("데이터 업데이트 됨");
          } catch (error: any) {
            console.log(error);
            alert(error.message);
          }
        }}
      >
        INIT
      </button> */
}
