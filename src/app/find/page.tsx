import { useQuery } from "@tanstack/react-query";
import { db, FBCollection } from "../../lib/firebase";
import Loading from "../../components/Lodaing";
import FindItem from "./FindItem";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { jobDescs } from "../../constants";

const FindPage = () => {
  const [targets, setTargets] = useState<TeamUserJob[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["teams"],
    queryFn: async (): Promise<MatchingTeam[]> => {
      try {
        const ref = db.collection(FBCollection.MATCHING);
        const snap = await ref.get();
        const data = snap.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as MatchingTeam)
        );

        if (!data) {
          return [];
        }

        return data;
      } catch (error: any) {
        console.log(error);
        alert(error.message);
        return [];
      }
    },
  });

  const [teams, setTeams] = useState(data ?? []);

  useEffect(() => {
    if (data && targets.length > 0) {
      const teams: MatchingTeam[] = [];

      for (const team of data) {
        for (const target of team.targets) {
          const found = targets.find((item) => item === target);

          if (found) {
            const foundTeam = teams.find((item) => item.id === team.id);

            if (!foundTeam) {
              teams.push(team);
            }
          }
        }
      }
      console.log(teams);
      setTeams(teams);
    } else {
      setTeams(data ?? []);
    }
  }, [data, targets]);

  if (isPending) {
    return <Loading message="등록된 팀 찾기 공고를 불러오고 있습니다..." />;
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
    <div className="max-w-300 mx-auto p-5 lg:px-0">
      {isSelecting && (
        <div className="fixed top-0 left-0 w-full h-screen justify-center items-center flex bg-black/50">
          <ul className="max-w-75 wrap gap-2.5 border p-5 rounded-2xl bg-white border-border shadow-md">
            {jobDescs.map((job) => {
              const selected = targets.find((item) => item === job);

              return (
                <li key={job}>
                  <button
                    onClick={() =>
                      setTargets((prev) =>
                        selected
                          ? prev.filter((item) => item !== job)
                          : [...prev, job]
                      )
                    }
                    className={selected ? "primary" : ""}
                  >
                    {job}
                  </button>
                </li>
              );
            })}
            <li>
              <button className="primary" onClick={() => setIsSelecting(false)}>
                선택 완료
              </button>
            </li>
          </ul>
        </div>
      )}
      <div className="w-full overflow-x-auto mb-5 flex gap-x-2.5">
        {targets.length > 0 && (
          <ul className="wrap gap-2.5">
            {targets.map((target) => (
              <li key={target}>
                <button
                  onClick={() =>
                    setTargets((prev) => prev.filter((item) => item !== target))
                  }
                >
                  {target}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          className="primary gap-x-2.5"
          onClick={() => setIsSelecting(true)}
        >
          직군 선택 <AiOutlineSearch className="text-xl" />
        </button>
      </div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {teams.map((team, index) => (
          <li key={team.id}>
            <FindItem item={team} index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FindPage;
