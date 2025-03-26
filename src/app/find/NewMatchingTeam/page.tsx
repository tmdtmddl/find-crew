import MatchingForm from "./MatchingForm";

const NewMatchingTeam = (user: TeamUser) => {
  return (
    <div>
      <MatchingForm
        onCancle={() => {
          console.log("dfd");
        }}
      />
    </div>
  );
};

export default NewMatchingTeam;
