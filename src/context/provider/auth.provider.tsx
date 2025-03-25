import { authService, db, FBCollection,firebase } from "../../lib/firebase";
import { AUTH } from "../hooks";
import {
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,

  useTransition,
} from "react";
const ref = db.collection(FBCollection.USERS);
const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(AUTH.initialState.user);

  const [initialized, setInitialized] = useState(false);
  //렌더링(새로고침)이 됬냐 안됬냐 알려주는 것 블리언으로

  const [isPending, startTransition] = useTransition();

  const fetchUser = useCallback((uid: string) => {
    startTransition(async () => {
      const snap = await ref.doc(uid).get();
      const data = snap.data() as TeamUser;
      if (!data) {
        setUser(null);
      } else {
        setUser(data);
      }
    });
  }, []);

  useEffect(() => {
    //! Listener
    const subAuth = authService.onAuthStateChanged((fbUser) => {
      if (!fbUser) {
        //! 유저가 없을때의 로직
        setUser(null);
      } else {
        //! 유저정보가져오기
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

  const signout = useCallback((): PromiseResult =>new Promise ((resolve)=> startTransition(async () => {
      try {
        await authService.signOut();
        setUser(null);
        resolve({success:true})
      } catch (error: any) {
        return {message:error};
      }
    })),
 []);

   
   
  const signin = useCallback((email: string, password: string):PromiseResult =>new Promise((resolve)=>
    startTransition(async () => {
      try {
        const result = await authService.signInWithEmailAndPassword(
          email,
          password
        );
       

        resolve({success:true})
      } catch (error: any) {
        return {message:error};
        
      }
    })
 ) , []);

  const signup = useCallback((newUser:TeamUser,password:string,uid?:string):PromiseResult =>new Promise(resolve=> 
    
    startTransition(async () => {
      try {
        const result = await authService.signInWithEmailAndPassword(
            newUser.email,
            password
          );
          if (!result.user) {
            message = " 실패";
            return;
          }
          await ref.doc(result.user.uid).set({...newUser,password})
      success= true
      } catch (error: any) {
        return {message:error}
      
      }
    });
  ), []);

  const signinWithProvider = useCallback(
    async():PromiseResult=>new Promise(
        resolve=> startTransition(
            async()=>{
                try {
                    const provider =new firebase.auth.GithubAuthProvider()
                    const result =await authService.signInWithPopup(provider)
                    if(!result.user){
                        return resolve({message:'no such user'})
                    }
                    const snap=await ref.doc(result.user.uid).get()
                    const data = snap.data()as TeamUser
                    if(data){
                        setUser(data)
                        return resolve({message:"통함회원임 기본정보입력 ㄱㄱ"})
                    }
                    resolve({message:".기본정보를 입력해야합니다",data:result.user})
                } catch (error: any) {
                    return {message:error};
                    
                  }
            }
        )
    ),[]
  )
  return (
    <AUTH.Context.Provider value={{ initialized, signout,signin,signup,user,signinWithProviderw }}>
      {children}
    </AUTH.Context.Provider>
  );
};

export default AuthProvider;
