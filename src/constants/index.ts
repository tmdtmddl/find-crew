export interface HomeDesc {
  title: string;
  subTitle: string;
  btnTitle: string;
}

export const homeDescs: HomeDesc[] = [
  {
    title: "개발자 라면",
    subTitle:
      "예쁜 디자인을 함께 보면서 개발하세요. 튼튼한 기획 아래에서 개발에 집중하세요.",
    btnTitle: "디자이너, 기획자 찾기",
  },
  {
    title: "디자이너 라면",
    subTitle:
      "상품을 구현해줄 수 있는 개발자와 함께 디자인 하세요. 견고한 기획서와 함께 상품을 디자인 하세요.",
    btnTitle: "개발자, 기획자 찾기",
  },
  {
    title: "기획자 라면",
    subTitle:
      "구현 가능 정도를 파악한 채로 기획하세요. 디자인 목업을 보면서 상상속의 기획 상품을 눈으로 확인하며 기획하세요.",
    btnTitle: "디자이너, 개발자 찾기",
  },
];

export const jobDescs: TeamUserJob[] = [
  "개발자",
  "공동대표",
  "기획자",
  "대표자",
  "디자이너",
];

export const initialUser: TeamUser = {
  email: "123",
  experiences: [],
  intro: "asdfadsf",
  jobDesc: "개발자",
  mobile: "1231",
  name: "Dexter Yoon",
  targets: ["개발자", "대표자", "기획자", "디자이너"],
  uid: "1234123412",
};

export const teams: MatchingTeam[] = [
  {
    name: "Google",
    intro: "Google은 전 세계에서 가장 큰 검색엔진을 운영하는 회사입니다.",
    descs: ["웹 개발자 구함", "검색 엔진 최적화 경험자 우대"],
    members: [
      {
        uid: "1",
        name: "John Doe",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "경험이 풍부한 개발자입니다.",
        mobile: "+82 010-1234-5678",
        email: "johndoe@google.com",
      },
    ],
    targets: ["개발자"],
    uid: "1001",
    fid: "",
    id: "1",
  },
  {
    name: "Microsoft",
    intro: "Microsoft는 세계적인 소프트웨어 및 하드웨어 회사입니다.",
    descs: [
      "클라우드 엔지니어 구함",
      "Azure 경험자 우대",
      "리눅스 및 윈도우 서버 운영 경험 필수",
    ],
    members: [
      {
        uid: "2",
        name: "Jane Smith",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "클라우드 기반 개발 경험이 있는 개발자입니다.",
        mobile: "+82 010-2345-6789",
        email: "janesmith@microsoft.com",
      },
    ],
    targets: ["개발자", "디자이너"],
    uid: "1002",
    fid: "",
    id: "2",
  },
  {
    name: "Amazon",
    intro: "Amazon은 세계적인 전자상거래 및 클라우드 서비스 제공업체입니다.",
    descs: [
      "풀스택 개발자 구함",
      "AWS 사용 경험 필수",
      "고급 JavaScript 능력자 우대",
    ],
    members: [
      {
        uid: "3",
        name: "Michael Johnson",
        jobDesc: "개발자",
        targets: ["개발자", "기획자"],
        experiences: [],
        intro: "풀스택 개발 경험이 풍부한 개발자입니다.",
        mobile: "+82 010-3456-7890",
        email: "michaeljohnson@amazon.com",
      },
    ],
    targets: ["개발자", "디자이너"],
    uid: "1003",
    fid: "",
    id: "3",
  },
  {
    name: "Apple",
    intro: "Apple은 혁신적인 기술과 제품으로 유명한 글로벌 기업입니다.",
    descs: ["iOS 개발자 구함", "Swift, Objective-C 경험자 우대"],
    members: [
      {
        uid: "4",
        name: "Emily Davis",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "iOS 개발에 전문성이 있는 개발자입니다.",
        mobile: "+82 010-4567-8901",
        email: "emilydavis@apple.com",
      },
    ],
    targets: ["개발자", "개발자"],
    uid: "1004",
    fid: "",
    id: "4",
  },
  {
    name: "Tesla",
    intro:
      "Tesla는 전기차 및 청정 에너지 솔루션을 제공하는 혁신적인 회사입니다.",
    descs: [
      "전기차 엔지니어 구함",
      "전기차 설계 경험자 우대",
      "기계공학 전공자",
    ],
    members: [
      {
        uid: "5",
        name: "David Lee",
        jobDesc: "기획자",
        targets: ["기획자"],
        experiences: [],
        intro: "전기차 분야에 관심이 많은 기획자입니다.",
        mobile: "+82 010-5678-9012",
        email: "davidlee@tesla.com",
      },
    ],
    targets: ["개발자", "디자이너"],
    uid: "1005",
    fid: "",
    id: "5",
  },
  {
    name: "Facebook",
    intro: "Facebook은 세계적인 소셜 미디어 플랫폼을 운영하는 회사입니다.",
    descs: ["백엔드 개발자 구함", "GraphQL 및 Node.js 경험자 우대"],
    members: [
      {
        uid: "6",
        name: "Chris Brown",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "백엔드 개발을 전문으로 하는 개발자입니다.",
        mobile: "+82 010-6789-0123",
        email: "chrisbrown@facebook.com",
      },
    ],
    targets: ["개발자", "대표자"],
    uid: "1006",
    fid: "",
    id: "6",
  },
  {
    name: "Netflix",
    intro: "Netflix는 세계적인 온라인 스트리밍 서비스 제공업체입니다.",
    descs: ["서버 엔지니어 구함", "Cloud Infrastructure 경험자 우대"],
    members: [
      {
        uid: "7",
        name: "Sophie Turner",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "스트리밍 서비스 인프라 개발에 경험이 있는 엔지니어입니다.",
        mobile: "+82 010-7890-1234",
        email: "sophieturner@netflix.com",
      },
    ],
    targets: ["개발자", "기획자", "디자이너"],
    uid: "1007",
    fid: "",
    id: "7",
  },
  {
    name: "Samsung",
    intro: "Samsung은 다양한 전자 제품과 솔루션을 제공하는 글로벌 기업입니다.",
    descs: [
      "제품 디자이너 구함",
      "UI/UX 디자인 경험자 우대",
      "모바일 제품 디자인 경험 필수",
    ],
    members: [
      {
        uid: "8",
        name: "Liam Harris",
        jobDesc: "디자이너",
        targets: ["디자이너"],
        experiences: [],
        intro: "UI/UX 디자인에 전문성을 가진 디자이너입니다.",
        mobile: "+82 010-8901-2345",
        email: "liamharris@samsung.com",
      },
    ],
    targets: ["디자이너", "개발자"],
    uid: "1008",
    fid: "",
    id: "8",
  },
  {
    name: "Adobe",
    intro:
      "Adobe는 다양한 크리에이티브 소프트웨어 솔루션을 제공하는 회사입니다.",
    descs: [
      "그래픽 디자이너 구함",
      "Photoshop, Illustrator 능숙자 우대",
      "웹 디자인 경험자 우대",
    ],
    members: [
      {
        uid: "9",
        name: "Olivia Martin",
        jobDesc: "디자이너",
        targets: ["디자이너"],
        experiences: [],
        intro: "그래픽 디자인 및 디지털 아트에 열정을 가진 디자이너입니다.",
        mobile: "+82 010-9012-3456",
        email: "oliviamartin@adobe.com",
      },
    ],
    targets: ["대표자"],
    uid: "1009",
    fid: "",
    id: "9",
  },
  {
    name: "IBM",
    intro: "IBM은 정보 기술과 서비스 솔루션을 제공하는 세계적인 기업입니다.",
    descs: [
      "AI 개발자 구함",
      "딥러닝 및 머신러닝 경험자 우대",
      "Python, R 능숙자",
    ],
    members: [
      {
        uid: "10",
        name: "James Wilson",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "AI 및 머신러닝 분야에서 경험이 있는 개발자입니다.",
        mobile: "+82 010-0123-4567",
        email: "jameswilson@ibm.com",
      },
    ],
    targets: ["기획자", "디자이너"],
    uid: "1010",
    fid: "",
    id: "10",
  },
  {
    name: "Spotify",
    intro: "Spotify는 음악 스트리밍 서비스의 글로벌 리더입니다.",
    descs: ["프론트엔드 개발자 구함", "React 및 JavaScript 능숙자 우대"],
    members: [
      {
        uid: "11",
        name: "Charlotte Taylor",
        jobDesc: "개발자",
        targets: ["개발자"],
        experiences: [],
        intro: "프론트엔드 기술에 전문성을 가진 개발자입니다.",
        mobile: "+82 010-1234-5678",
        email: "charlottetaylor@spotify.com",
      },
    ],
    targets: ["개발자", "디자이너"],
    uid: "1011",
    fid: "",
    id: "11",
  },
  {
    name: "DW아카데미",
    intro: "DW아카데미는 학원입니다.",
    descs: ["디자인 가능한 개발자 구함", "UI 맛깔나게 작성가능자 구함"],
    members: [initialUser],
    targets: ["디자이너"],
    uid: "123",
    fid: "",
    id: "1",
  },
  {
    name: "그린컴퓨터아카데미",
    intro: "그린컴퓨터아카데미는 또 다른 학원입니다.",
    descs: ["잡무 할 사람 구함", "청소 잘하면 우대", "개발도 잘해야 함"],
    members: [initialUser],
    targets: ["개발자"],
    uid: "1213",
    fid: "",
    id: "2",
  },
  {
    name: "패스트캠퍼스",
    intro: "패스트캠퍼스도 학원입니다. 특히 온라인 학원",
    descs: [
      "리액트 강사 구함",
      "리액트 잘 해야함",
      "강의도 잘 해야함",
      "보수 많이 줌",
    ],
    members: [initialUser],
    targets: ["개발자", "디자이너", "기획자"],
    uid: "1323",
    fid: "",
    id: "3",
  },
  {
    name: "또스",
    intro: "",
    descs: [
      "프로덕트 맛있게 디자인 하는 사람 구함",
      "자기 주도 프로덕트 개발 기획 디자인 가능자 우대",
    ],
    members: [initialUser],
    targets: ["기획자", "개발자"],
    uid: "1123",
    fid: "",
    id: "4",
  },
];
