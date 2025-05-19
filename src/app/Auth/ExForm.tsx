import { useCallback, useMemo, useState } from "react";
import useTextInput from "../../components/ui/useTextInput";
import useSelect from "../../components/ui/useSelect";
import { AiOutlineClose } from "react-icons/ai";

interface ExFormProps {
  payload?: TeamUserEx;

  onChange: (newEx: TeamUserEx) => void;
  onCancel: () => void;
}

//초기값 정하기
const initialState: TeamUserEx = {
  descs: [],
  length: { start: { year: 0, month: 0 }, end: "현재까지" },
  name: "",
};

const ExForm = ({ onCancel, onChange, payload }: ExFormProps) => {
  const [ex, setEx] = useState(payload ?? initialState);
  const [desc, setDesc] = useState("");
  const [isSelectingEnd, setIsSelectingEnd] = useState(
    payload && payload.length.end !== "현재까지" ? true : false
  );

  const Name = useTextInput();
  const Desc = useTextInput();
  const StartYear = useSelect();
  const StartMonth = useSelect();
  const End = useSelect();
  const EndYear = useSelect();
  const EndMonth = useSelect();

  const nameMessage = useMemo(() => {
    if (ex.name.length === 0) {
      return "회사 이름을 입력해주세요.";
    }
    return null;
  }, [ex.name]);
  const descMessage = useMemo(() => {
    if (desc.length === 0 && ex.descs.length === 0) {
      return "경력을 입력해주세요.";
    }
    return null;
  }, [desc, ex.descs]);

  const startYearMessage = useMemo(() => {
    const isYear = checkYear(ex.length.start.year);
    if (!isYear) {
      return "경력 시작 년도를 확인해주세요.";
    }
    return null;
  }, [ex.length.start.year]);
  const startMonthMessage = useMemo(() => {
    const isMonth = checkMonth(ex.length.start.month);
    if (!isMonth) {
      return "경력 시작 월을 확인해주세요.";
    }
    return null;
  }, [ex.length.start.month]);

  const endYearMessage = useMemo(() => {
    if (typeof ex.length.end === "string") {
      return null;
    }
    const isYear = checkYear(ex.length.end.year);
    if (!isYear) {
      return "경력 종료 년도를 확인해주세요.";
    }
    return null;
  }, [ex.length.end]);
  const endMonthMessage = useMemo(() => {
    if (typeof ex.length.end === "string") {
      return null;
    }
    const isMonth = checkMonth(ex.length.end.month);
    if (!isMonth) {
      return "경력 종료 월을 확인해주세요.";
    }
    return null;
  }, [ex.length.end]);

  const onSubmit = useCallback(() => {
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }
    if (startYearMessage) {
      alert(startYearMessage);
      return StartYear.showPicker();
    }
    if (startMonthMessage) {
      alert(startMonthMessage);
      return StartMonth.showPicker();
    }
    if (endYearMessage) {
      alert(endYearMessage);
      return EndYear.showPicker();
    }
    if (endMonthMessage) {
      alert(endMonthMessage);
      return EndMonth.showPicker();
    }
    if (descMessage) {
      alert(descMessage);
      return Desc.focus();
    }

    if (payload) {
      const isDescDiff = () => {
        let res = false;
        for (const desc of payload.descs) {
          const found = ex.descs.find((item) => item === desc);
          if (!found) {
            res = true;
            break;
          }
        }
        return res;
      };
      if (
        (payload.name === ex.name &&
          payload.length.start.year === ex.length.start.year &&
          payload.length.start.month === ex.length.start.month &&
          payload.length.end === "현재까지" &&
          ex.length.end === "현재까지") ||
        (typeof payload.length.end !== "string" &&
          typeof ex.length.end !== "string" &&
          payload.length.end.year === ex.length.end.year &&
          payload.length.end.month === ex.length.end.month &&
          !isDescDiff())
      ) {
        return alert("변경사항이 없습니다.");
      }
    }

    onChange(ex);
    onCancel();
  }, [
    nameMessage,
    descMessage,
    startYearMessage,
    startMonthMessage,
    endYearMessage,
    endMonthMessage,
    Name,
    Desc,
    StartYear,
    StartMonth,
    EndYear,
    EndMonth,
    onChange,
    onCancel,
    ex,
    payload,
  ]);

  return (
    <div className="col gap-y-2.5 max-w-100 mx-auto w-full">
      <Name.Component
        value={ex.name}
        onChangeText={(name) => setEx((prev) => ({ ...prev, name }))}
        label="회사 이름"
        placeholder="DW 아카데미"
        message={nameMessage}
        onSubmitEditing={() => {
          if (nameMessage) {
            alert(nameMessage);
            return Name.focus();
          }
        }}
        props={{
          onKeyDown: ({ key }) => {
            if (key === "Enter") {
              onSubmit();
            }
          },
        }}
      />
      <div className="row gap-x-2.5">
        <div className="row gap-x-1">
          <StartYear.Component
            data={years}
            label="시작년도"
            onChangeSelect={(year) => {
              setEx((prev) => ({
                ...prev,
                length: {
                  ...prev.length,
                  start: {
                    ...prev.length.start,
                    year: Number(year),
                  },
                },
              }));
              StartMonth.showPicker();
            }}
            value={ex.length.start.year}
          />
          <StartMonth.Component
            data={months}
            label="시작월"
            onChangeSelect={(month) => {
              setEx((prev) => ({
                ...prev,
                length: {
                  ...prev.length,
                  start: {
                    ...prev.length.start,
                    month: Number(month),
                  },
                },
              }));
              //   StartMonth.showPicker();
            }}
            value={ex.length.start.month}
          />
        </div>
        <div className="row gap-x-1 items-end">
          {isSelectingEnd ? (
            <>
              <EndYear.Component
                data={years}
                label="종료년도"
                onChangeSelect={(year) => {
                  setEx((prev) => ({
                    ...prev,
                    length: {
                      ...prev.length,
                      end:
                        typeof prev.length.end === "string"
                          ? prev.length.end
                          : {
                              ...prev.length.end,
                              year: Number(year),
                            },
                    },
                  }));
                  EndMonth.showPicker();
                }}
                value={
                  typeof ex.length.end === "string" ? 0 : ex.length.end.year
                }
              />
              <EndMonth.Component
                data={months}
                label="종료월"
                onChangeSelect={(month) => {
                  setEx((prev) => ({
                    ...prev,
                    length: {
                      ...prev.length,
                      end:
                        typeof prev.length.end === "string"
                          ? prev.length.end
                          : {
                              ...prev.length.end,
                              month: Number(month),
                            },
                    },
                  }));
                  Desc.focus();
                }}
                value={
                  typeof ex.length.end === "string" ? 0 : ex.length.end.month
                }
              />
              <button
                className="border border-border"
                onClick={() => {
                  setIsSelectingEnd(false);
                  setEx((prev) => ({
                    ...prev,
                    length: { ...prev.length, end: "현재까지" },
                  }));
                  Desc.focus();
                }}
                type="button"
              >
                현재까지
              </button>
            </>
          ) : (
            <End.Component
              label="종료시기"
              data={["현재까지", "직접선택"]}
              onChangeSelect={(value) => {
                if (value === "직접선택") {
                  setIsSelectingEnd(true);
                  setEx((prev) => ({
                    ...prev,
                    length: { ...prev.length, end: { year: 0, month: 0 } },
                  }));
                  return EndYear.showPicker();
                }
                setEx((prev) => ({
                  ...prev,
                  length: { ...prev.length, end: value as "현재까지" },
                }));
              }}
              value={typeof ex.length.end === "string" ? ex.length.end : ""}
            />
          )}
        </div>
      </div>

      <Desc.Component
        label="세부 경력 내용"
        onChangeText={setDesc}
        value={desc}
        message={descMessage}
        placeholder="웹사이트 개발 고수"
        props={{
          onKeyDown: ({ key, nativeEvent }) => {
            if (
              (key === "Enter" || key === "Tab") &&
              !nativeEvent.isComposing
            ) {
              if (descMessage) {
                alert(descMessage);
                return Desc.focus();
              }
              const found = ex.descs.find((item) => item === desc);
              if (found) {
                return alert("중복된 경력 사항입니다.");
              }
              setEx((prev) => ({ ...prev, descs: [...prev.descs, desc] }));
              setDesc("");
              Desc.focus();
            }
          },
        }}
        // resetHidden
      />

      {ex.descs.length > 0 && (
        <ul className="col gap-y-1">
          {ex.descs.map((d, index) => (
            <li
              key={d}
              className="text-sm border border-border rounded px-1 bg-lightGray row justify-between items-center"
            >
              {index + 1}. {d}
              <button
                type="button"
                className="h-auto p-0"
                onClick={() =>
                  setEx((prev) => ({
                    ...prev,
                    descs: prev.descs.filter((item) => item !== d),
                  }))
                }
              >
                <AiOutlineClose />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="row gap-x-2 5">
        <button type="button" onClick={onCancel}>
          취소
        </button>
        <button className="primary" type="button" onClick={onSubmit}>
          {payload ? "수정" : "추가"}
        </button>
      </div>
    </div>
  );
};

export default ExForm;

const checkMonth = (month: number) => {
  if (month < 1 || month > 12) {
    return false;
  }
  return true;
};

const checkYear = (year: number) => {
  if (year === 0) {
    return false;
  }
  return true;
};

const years = Array.from({ length: 100 }, (_, i) => {
  const currentYear = new Date().getFullYear();
  return String(currentYear - i);
});

const months = Array.from({ length: 12 }, (_, i) => {
  return String(1 + i);
});
