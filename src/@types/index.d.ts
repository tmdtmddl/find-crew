interface ItemProps<T = any> {
  item: T;
  index?: number;
}

interface FormProps<T = any> {
  payload?: T;

  onCancel: () => void;
  onSubmitEditing?: () => void;
}

interface TeamUser {
  uid: string;
  name: string;
  jobDesc: TeamUserJob;
  targets: TeamUserJob[];
  experiences: TeamUserEx[];
  intro: string;
  mobile: string; //! +82 010
  email: string;
}

type TeamUserJob = "개발자" | "디자이너" | "기획자" | "대표자" | "공동대표";

interface TeamUserEx {
  name: string;
  length: TeamUserExLength;
  descs: string[];
}

interface MonthYear {
  month: number;
  year: number;
}
//MothYear는 month랑year가 있음
interface TeamUserExLength {
  start: MonthYear;
  end: "현재까지" | MonthYear;
}
//lenght는 start랑 end가 있는데 end는 현재까지라는 문자열 또는 MothYear라는 타입임

type PromiseResult<T = any> = Promise<AsyncResult<T>>;

interface MatchingTeam {
  name: string; //! 팀 또는 회사명
  members: TeamUser[]; //! 팀 또는 회사의 팀 멤버
  intro: string; //! 팀 또는 회사 소개
  targets: TeamUserJob[]; //! 구인 직군
  descs: string[]; //! 구인 직군의 직무요건
  uid: string; //! 공고 올린사람의 아이디
  id: string; //! 공고 아이디 -> 추가, 수정, 삭제
  fid: string; //! 공고 보고 스크랩 또는 매칭 한 사람의 아이디
}

//Collection Chat
interface Chat {
  message: string; //! 메세지 내용
  uids: string[]; //! 대화에 참여하고 있는 사람들
  uid: string; //! 내가 작성한 내용을 추적할 아이디
  createdAt: string; //! 언제 작성한 내용인지 알고싶을 때 쓰면 됨
  //? 예시) attachedFileUrl: string | null //! 추가로 원하는 타입 붙이면 됨
  id: string; //! 삭제할때 필요한 아이디
}
