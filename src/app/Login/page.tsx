import { useCallback, useEffect, useMemo, useState } from "react";
import { AUTH } from "../../context/hooks";
import { emailValidator } from "../../utils/validator";
import useTextInput from "../../components/ui/useTextInput";
import { useNavigate } from "react-router-dom";
import { PROVIDER } from "../../context/zustand.store";

const LoginPage = () => {
  const { signin, signinWithProvider } = AUTH.use();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailMessage = useMemo(() => {
    const isEmail = emailValidator(email);
    if (!isEmail) {
      return "이메일을 확인해주세요.";
    }
    return null;
  }, [email]);

  const passwordMessage = useMemo(() => {
    if (password.length === 0) {
      return "비밀번호를 입력해주세요.";
    }
    if (password.length < 6) {
      return "비밀번호가 너무 짧습니다.";
    }
    if (password.length > 12) {
      return "비밀번호가 너무 깁니다.";
    }
    return null;
  }, [password]);

  const Email = useTextInput();
  const Password = useTextInput();

  useEffect(
    () => {
      Email.focus();
    },
    [] //!최초 1회만 실행하는 코드 짜기
  );

  const navi = useNavigate();
  const { setWithProvider } = PROVIDER.store();
  const onSubmit = useCallback(async () => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }

    try {
      const { message, success, data } = await signin(email, password);
      if (!success) {
        if (data) {
          alert(message);
          setWithProvider(data.uid, data.email!, data.displayName ?? undefined);
          return navi("/auth");
        }
        return alert(message ?? "로그인 문제 생김");
      }
      alert("환영합니다. 나의 동료를 찾으세요!");
      navi("/my");
    } catch (error: any) {
      alert(error.message);
    }
  }, [
    email,
    password,
    emailMessage,
    passwordMessage,
    Email,
    Password,
    signin,
    navi,
    setWithProvider,
  ]);

  return (
    <div className="max-w-100 p-5 col gap-y-5 mx-auto">
      <form
        className="col gap-y-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Email.Component
          value={email}
          onChangeText={setEmail}
          label="이메일"
          placeholder="email@email.com"
          message={emailMessage}
          props={{
            type: "email",
          }}
        />
        <Password.Component
          value={password}
          onChangeText={setPassword}
          label="비밀번호"
          placeholder="* * * * * * * *"
          message={passwordMessage}
          props={{
            type: "password",
          }}
        />
        <button className="primary mt-2.5">로그인하기</button>
      </form>
      <div className="col gap-y-5">
        <span className="text-center">OR</span>
        <button
          onClick={async () => {
            console.log("google gogo ");
          }}
        >
          구글로 계속하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
