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
}

const ChatForm = ({ myUid, uid, id, cid, onFocus }: Props) => {
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
      className="flex-row gap-x-2.5 max-w-auto w-full"
      onSubmit={onSubmit}
    >
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
