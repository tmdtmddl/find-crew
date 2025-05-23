import { useCallback, useMemo, useState } from "react";
import useTextInput from "../../../components/ui/useTextInput";
import AppForm from "../../../components/ui/AppForm";
import { lengthCheck } from "../../../utils/validator";
import { AUTH } from "../../../context/hooks";
import Loading from "../../../components/Lodaing";

const AccountPage = (user: TeamUser) => {
  const [props, setProps] = useState(user);
  const { updateUserDetail, isPending } = AUTH.use();
  const { name } = props;
  const onChangeP = useCallback((target: keyof TeamUser, value: any) => {
    setProps((prev) => ({ ...prev, [target]: value }));
  }, []);

  const Name = useTextInput();
  const [isNameFocused, setIsNameFocused] = useState(false);
  const nameMessage = useMemo(() => {
    if (!lengthCheck(name)) {
      return "이름을 입력해주세요.";
    }
    if (name === user.name) {
      return "이름에 변경사항이 없습니다.";
    }
    return null;
  }, [name, user.name]);
  const onSubmitName = useCallback(async () => {
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }
    const { message, success } = await updateUserDetail("name", name);
    if (!success) {
      alert(message);
      return Name.focus();
    }
    alert("수정되었습니다.");
  }, [nameMessage, name, Name, updateUserDetail]);

  return (
    <div>
      {isPending && <Loading message="회원정보가 수정중입니다." />}
      <AppForm className="flex-row items-end gap-x-2.5" onSubmit={onSubmitName}>
        <Name.Component
          value={name}
          onChangeText={(name) => onChangeP("name", name)}
          label="이름"
          divClassName="flex-1"
          props={{
            onFocus: () => setIsNameFocused(true),
            onBlur: () => setIsNameFocused(false),
          }}
          placeholder={user.name}
        />
        {isNameFocused && <button className="primary">수정</button>}
      </AppForm>
    </div>
  );
};

export default AccountPage;
