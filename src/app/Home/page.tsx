import { useCallback } from "react";
import { HomeDesc, homeDescs } from "../../constants";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navi = useNavigate();

  const HomeItem = useCallback(
    ({ item }: ItemProps<HomeDesc>) => {
      return (
        <div className="col gap-y-5 justify-center snap-start min-h-screen items-center sm:items-start">
          <h1>{item.title}</h1>
          <p className="p">{item.subTitle}</p>
          <div className="row justify-center sm:justify-start">
            <button
              onClick={() => navi(`auth?target=${item.btnTitle}`)}
              className="sd primary"
            >
              {item.btnTitle}
            </button>
          </div>
        </div>
      );
    },
    [navi]
  );

  return (
    <div className="px-5 snap-y snap-mandatory overflow-y-auto h-screen">
      {homeDescs.map((item, index) => (
        <HomeItem key={index} item={item} />
      ))}
    </div>
  );
}
