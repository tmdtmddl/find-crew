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
