import { useContext, createContext } from "react";
import { firebase } from "../../lib/firebase";

export interface Props {
  user: TeamUser | null;
  initialized: boolean;
  isPending: boolean;

  signin: (email: string, password: string) => PromiseResult<firebase.User>;
  signout: () => PromiseResult;
  signup: (user: TeamUser, password: string, uid?: string) => PromiseResult;

  updateUser: (newUser: TeamUser) => PromiseResult;
  signinWithProvider: () => PromiseResult<firebase.User>;
}
//초기값 정하기
export const initialState: Props = {
  initialized: false,
  isPending: false,
  signin: async () => ({}),
  signout: async () => ({}),
  signup: async () => ({}),
  updateUser: async () => ({}),
  signinWithProvider: async () => ({}),
  user: null,
};

export const Context = createContext(initialState);

export const use = () => useContext(Context);
