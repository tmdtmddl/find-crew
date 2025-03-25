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

  useEffect(() => {
    console.log({ user });
  }, [user]);

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
    (email: string, password: string): PromiseResult =>
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

            await ref.doc(id).set({ ...newUser, uid: id } as TeamUser);
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
            const snap = await ref.doc(result.user.uid).get();
            const data = snap.data() as TeamUser;
            if (data) {
              setUser(data);
              return resolve({
                message: "통합회원입니다. 기본정보를 입력해주세요.",
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
      }}
    >
      {children}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
