import { useSearchParams } from "react-router-dom";
import { useState } from "react";
export default function AuthPage() {
  const params = useSearchParams()[0].get("target");
  const [x, setX] = useState<number[]>([]);
  const extractor = (params: string | null) => {
    if (!params) {
      return [];
    }
    const copy = params.replace(",", "");
    console.log(copy);
    const split = params.split("");
    return split.splice(0, 2);
  };

  const targets = extractor(params);
  const context = useSearchParams()[0].get("context");
  console.log(context);
  return (
    <div className="">
      <h1>찾고 있는대상 :{targets.length}개의 직군</h1>
      <div className="border-4 w-full  overflow-x-auto snap-x snap-mandatory row">
        <div
          className="h-screen min-w-full snap-start bg-theme"
          draggable
          onDragStart={(e) => setX([e.clientX])}
          onDragOver={(e) => {
            if (e.clientX < x[0]) {
              console.log("next item");
            }
          }}
        ></div>
        <div className="h-screen min-w-full snap-start bg-pink-50"></div>
        <div className="h-screen min-w-full snap-start bg-orange-50"></div>
      </div>
    </div>
  );
}
