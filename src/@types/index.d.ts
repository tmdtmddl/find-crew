interface ItemProps<T = any> {
  item: T;
  index?: number;
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

interface AsyncResult<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}
type PromiseResult<T = any> = Promise<AsyncResult<T>>;
