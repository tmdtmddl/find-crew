import { authService, db, FBCollection, firebase } from "../../lib/firebase";
import { AUTH } from "../hooks";
import {
  PropsWithChildren,
  useEffect,
  useCallback,
  useState,
  useTransition,
} from "react";

const ref = db.collection(FBCollection.USERS);
const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(AUTH.initialState.user);
  const [initialized, setInitialized] = useState(false);

  const [isPending, startTransition] = useTransition();

  const fetchUser = useCallback((uid: string) => {
    startTransition(async () => {
      const snap = await ref.doc(uid).get();
      const data = snap.data() as TeamUser;
      if (!data) {
        setUser(null);
      } else {
        setUser(data as TeamUser);
      }
    });
  }, []);

  useEffect(() => {
    //! Listener
    const subAuth = authService.onAuthStateChanged((fbUser) => {
      if (!fbUser) {
        //! 유저가 없을 때의 로직
        setUser(null);
      } else {
        //! 유저 정보 가져오기
        fetchUser(fbUser.uid);
      }
      setTimeout(() => {
        setInitialized(true);
      }, 2000);
    });

    subAuth;
    return subAuth;
  }, [fetchUser]);

  // useEffect(() => {
  //   console.log({ user });
  // }, [user]);

  const signout = useCallback(
    (): PromiseResult =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            await authService.signOut();
            setUser(null);
            resolve({ success: true });
          } catch (error: any) {
            resolve(error);
          }
        })
      ),
    []
  );

  const signin = useCallback(
    (email: string, password: string): PromiseResult<firebase.User> =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            const result = await authService.signInWithEmailAndPassword(
              email,
              password
            );
            if (!result.user) {
              return resolve({ message: "No Such User" });
            }
            const snap = await ref.doc(result.user.uid).get();
            const data = snap.data() as TeamUser;
            if (!data) {
              return resolve({
                message: "통합회원입니다. 간략한 정보를 입력해주세요.",
                data: result.user,
              });
            }

            // await fetchUser(result.user.uid);
            resolve({ success: true });
          } catch (error: any) {
            resolve(error);
          }
        })
      ),
    []
  );

  const signup = useCallback(
    (newUser: TeamUser, password: string, uid?: string): PromiseResult =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            let id = "";
            if (!uid) {
              const result = await authService.createUserWithEmailAndPassword(
                newUser.email,
                password
              );

              if (!result.user) {
                return resolve({ message: "회원가입에 실패했습니다." });
              }
              id = result.user.uid;
            } else {
              id = uid;
            }

            const updatedUser: TeamUser = { ...newUser, uid: id };
            await ref.doc(id).set(updatedUser);
            setUser(updatedUser);

            resolve({ success: true });
          } catch (error: any) {
            resolve(error);
          }
        })
      ),
    []
  );

  const signinWithProvider = useCallback(
    async (): PromiseResult =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            const provider = new firebase.auth.GoogleAuthProvider();

            const result = await authService.signInWithPopup(provider);

            if (!result.user) {
              return resolve({ message: "No such User" });
            }
            //인증끝내고 데이터베이스에 저장
            const snap = await ref.doc(result.user.uid).get();
            const data = snap.data() as TeamUser;
            //회원이 있으면
            if (data) {
              setUser(data);
              return resolve({
                message: "통합회원입니다. 기본정보를 입력해주세요.",
                success: true,
              });
            }

            resolve({
              message: "기본정보를 입력해야합니다.",
              data: result.user,
            });
          } catch (error: any) {
            console.log({ error });
            resolve(error);
          }
        })
      ),
    []
  );

  const updateUser = useCallback(
    async (
      newUser: TeamUser
    ): Promise<{ success: boolean; message?: string }> =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            await ref.doc(user?.uid).update(newUser);
            setUser(newUser);
            resolve({ success: true });
          } catch (error: any) {
            resolve(error);
          }
        })
      ),
    [user]
  );

  const updataUserDetail = useCallback(
    (
      target: keyof TeamUser,
      value: any
    ): Promise<{ success: boolean; message?: string }> =>
      new Promise((resolve) =>
        startTransition(async () => {
          try {
            await ref.doc(user?.uid).update({ [target]: value });

            resolve({ success: true });
          } catch (error: any) {
            resolve(error);
          }
        })
      ),
    [user]
  );

  return (
    <AUTH.Context.Provider
      value={{
        initialized,
        signout,
        isPending,
        signin,
        signup,
        user,
        signinWithProvider,
        updateUser,
        updataUserDetail,
      }}
    >
      {children}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
