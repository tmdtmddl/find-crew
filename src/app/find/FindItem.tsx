import { Link } from "react-router-dom";
import { TEAM } from "../../context/zustand.store";

const FindItem = ({
  item,
  index,
  isFull,
}: ItemProps<MatchingTeam> & { isFull?: boolean }) => {
  const { name, descs, intro, members, targets } = item;
  const { setTeam } = TEAM.store();

  return (
    <Link
      to={`/find/${item.id}`}
      className="col gap-y-1 border border-border p-2.5 rounded-md hover:shadow-md h-auto block bg-white"
      onClick={() => setTeam(item)}
    >
      <h1 className="text-xl">{name}</h1>
      <p>{members.length}명의 멤버로 이루어진 팀입니다.</p>
      <p>{intro}</p>
      {isFull && (
        <div>
          <h2 className="font-bold">자격 요건</h2>
          <ul className="col gap-y-1">
            {descs.map((desc, i) => (
              <li key={desc} className="font-light text-sm">
                {i + 1}. {desc}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2 className="font-bold">모집하는 팀원</h2>
        <ul className="wrap gap-1">
          {targets.map((target) => (
            <li key={target} className="rounded bg-lightGray px-2.5 py-1">
              {target}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

export default FindItem;
