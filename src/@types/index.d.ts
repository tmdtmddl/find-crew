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
  moblie: string; //! +82 010
  email: string;
}

type TeamUserJob = "개발자" | "디자이너" | "기획자" | "대표자" | "공동대표자";

interface TeamUserEx {
  name: string;
  length: TeamUserExLength;
  descs: string[];
}
interface MothYear {
  month: number;
  year: number;
}
interface TeamUserExLength {
  start: MothYear;
  end: "현재까지" | MothYear;
}
