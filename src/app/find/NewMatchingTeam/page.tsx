import MatchingForm from "./MatchingForm";

const NewMatchingTeam = (user: TeamUser) => {
  return (
    <div>
      <MatchingForm onCancel={() => console.log("취소 ㄱㄱ")} />
    </div>
  );
};

export default NewMatchingTeam;
