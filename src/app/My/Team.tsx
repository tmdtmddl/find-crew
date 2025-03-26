import { useQuery } from "@tanstack/react-query";
import { db, FBCollection } from "../../lib/firebase";
import Loading from "../../components/Lodaing";
import { teams } from "../../constants";
import { Link } from "react-router-dom";

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

        if (!data) {
          console.log("no data");
          return [];
        }
        return data;
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
    <div>
      <h1>매칭 진행 중인 팀 {data.length}개</h1>
      <ul>
        {data.map((team) => (
          <li key={team.id}>
            {team.name}
            {team.members.length}명의 멤버
            {team.targets.length}의 직군을 구함
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
