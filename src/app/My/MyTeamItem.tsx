import { useCallback } from "react";
import { isMobile, isAndroid } from "react-device-detect";

interface MyTeamItemProp extends ItemProps<MatchingTeam> {
  onDelete: () => void;
}
const tel = "01012341234";
const MyTeamItem = ({ item, onDelete }: MyTeamItemProp) => {
  const onText = useCallback(() => {
    const a = document.createElement("a");
    a.href = `sms:${tel}?${isAndroid ? `?` : `&`}body=저한테 연락 부탁드려요.`;
    a.click();
  }, []);

  const onCall = useCallback(() => {
    const a = document.createElement("a");
    a.href = `tel:${tel}`;
    if (confirm(`팀원에게 전화를 걸겠습니까?`)) {
      a.click();
    }
  }, []);

  return (
    <div className="row items-center border  w-full ">
      <h2 className="flex-1">{item.name}</h2>
      <div className="row">
        {isMobile && (
          <>
            <button className="bg-transparent" onClick={onText}>
              문자
            </button>
            <button className="bg-transparent" onClick={onCall}>
              전화
            </button>
          </>
        )}
        <button onClick={onDelete}>삭제</button>
      </div>
    </div>
  );
};

export default MyTeamItem;
