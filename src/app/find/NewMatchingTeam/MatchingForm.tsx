import { useCallback, useState } from "react";
import useTextInput from "../../../components/ui/useTextInput";
import { AUTH } from "../../../context/hooks";
import useSelect from "../../../components/ui/useSelect";
import { db, FBCollection } from "../../../lib/firebase";
import { useNavigate } from "react-router-dom";

const initialState: MatchingTeam = {
  descs: [],
  fid: "",
  id: "",
  intro: "",
  members: [],
  name: "",
  targets: [],
  uid: "",
};

const MatchingForm = ({
  onCancle,
  onSubmitEditing,
  payload,
}: FormProps<MatchingTeam>) => {
  const { user } = AUTH.use();
  const navi = useNavigate()
  const [post, setPost] = useState(
    payload ?? { ...initialState, uid: user?.uid as string, menubars: [user!] }
  );
  const [desc, setDesc] = useState('')
  const [target, setTarget] = useState('')
  const [email, setEmail] = useState('')

  const onChangeP = useCallback((target: keyof MatchingTeam, value: any) => {
    
    setPost((prev) => ({ ...prev, [target]: value }));
  }, []);

  const Name = useTextInput();
  const Target = useSelect();
  const Intro = useTextInput();
  const Desc = useTextInput();
  const Member = useTextInput();

  return (
    <form action="" className="col gap-y-2.5 max-w-100 mx-auto p-5">
      <Name.Component
        value={post.name}
        label="이름"
        onChangeText={(name) => onChangeP("name", name)}
      />
      <Target.Component
        data={[]}
        label=" 직군"
        onChangeSelect={(target) => console.log("target", target)}
        value={""}
        containerClassName="min-w-25"
      />
      <button onClick={()}>멤버추가</button>
      <Member.Component value={email} label="이메일" onChangeText={setEmail} props={ {
        onKeyDown:({ key,nativeEvent})=>{
            if(key=== "Enter"||key==="Tab"){
                if(!nativeEvent.isComposing){
                    try {
                        const found = post.members.find(item=>item.email===email)
                        if(found){
                            return alert("이미추가된멤버입니다.")
                        }
                        const ref= db.collection(FBCollection.USERS)
                        const snap= await ref.where("email","==",email).get()
                        const data=snap.docs.map(
                            doc=>({...doc.data(),uid:doc.id}as TeamUser)
                        )
                        if(!data){
                            return alert("dkdk")
                        }
                        if(data[0]){
                            if(confirm("dfd")){
                                onChangeP("members",[...post.members,data[0]])
                                alert("")
                                return
                            }
                            alert("")
                        }
                    } catch (error:any) {
                        alert(error)
                    }
                }
            }
        }
           
        
      }}/>
      <div>
        <button onClick={onCancle}> 취소</button>
        <button > 수정</button>
      </div>
    </form>
  );
};

export default MatchingForm;
