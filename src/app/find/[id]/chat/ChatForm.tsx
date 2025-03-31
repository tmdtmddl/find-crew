import { useCallback, useState } from "react";
import useTextInput from "../../../../components/ui/useTextInput";
import AppForm from "../../../../components/ui/AppForm";
import { db, FBCollection } from "../../../../lib/firebase";

interface Props {
  myUid: string;
  uid: string;
  id: string;
  cid: string;
  onFocus: () => void;
  isFinished?: boolean;
}

const ChatForm = ({ myUid, uid, id, cid, onFocus, isFinished }: Props) => {
  const [message, setMessage] = useState("");
  const Message = useTextInput();

  const onSubmit = useCallback(async () => {
    if (message.length === 0) {
      alert("아무것도 입력되지 않았습니다.");
      return Message.focus();
    }

    const newMessage: Chat = {
      createdAt: new Date().toLocaleString(),
      id: "",
      message,
      uid: myUid,
      uids: [myUid, uid],
    };

    try {
      await db
        .collection(FBCollection.MATCHING)
        .doc(id)
        .collection(cid)
        .add(newMessage);
      setMessage("");
      Message.focus();
      onFocus();
    } catch (error: any) {
      return alert(error.message);
    }
  }, [message, uid, myUid, Message, id, cid, onFocus]);
  return (
    <AppForm
      className="flex-row gap-x-2.5 max-w-auto w-full relative"
      onSubmit={onSubmit}
    >
      {isFinished && (
        <button
          type="button"
          className="absolute w-full h-full top-0 left-0 z-10"
          onClick={() => alert("해당 공고는 모집 종료되었습니다.")}
        >
          모집 종료
        </button>
      )}
      <Message.Component
        value={message}
        onChangeText={setMessage}
        label=""
        resetHidden
        divClassName="flex-1"
        props={{
          className: "border-none focus:bg-lightgray",
        }}
      />
      <button className="primary">전송</button>
    </AppForm>
  );
};

export default ChatForm;
