import { useNavigate } from "react-router-dom";
import { TEAM } from "../../../context/zustand.store";
import MatchingForm from "./MatchingForm";

const NewMatchingTeam = (user: TeamUser) => {
  const { team, setTeam } = TEAM.store();
  const navi = useNavigate();
  return (
    <div>
      <MatchingForm
        payload={team ?? undefined}
        onCancel={() => {
          navi(-1);
        }}
        onSubmitEditing={() => setTeam(null)}
      />
    </div>
  );
};

export default NewMatchingTeam;
