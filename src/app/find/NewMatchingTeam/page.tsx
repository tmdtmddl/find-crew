import { useNavigate } from "react-router-dom";
import { TEAM } from "../../../context/zustand.store";
import MatchingForm from "./MatchingForm";

const NewMatchingTeam = (user: TeamUser) => {
  const { team } = TEAM.store();
  const navi = useNavigate();
  return (
    <div>
      <MatchingForm
        payload={team ?? undefined}
        onCancel={() => {
          if (team) {
            console.log("수정한 뒤의 로직");
          } else {
            console.log("추가한 뒤의 로직");
          }
          navi(-1);
        }}
      />
    </div>
  );
};

export default NewMatchingTeam;
