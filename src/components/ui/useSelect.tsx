import { useCallback, useId, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface UseSelectProps {
  value: string | number;
  onChangeSelect: (value: string) => void;
  data: string[];
  label: string;
  placeholder?: string;

  containerClassName?: string;
  labelClassName?: string;
}

const useSelect = () => {
  const [showing, setShowing] = useState(false);
  const showPicker = useCallback(
    () => setTimeout(() => setShowing(true), 100),
    []
  );
  const hide = useCallback(() => setTimeout(() => setShowing(false), 100), []);

  const id = useId();

  const Component = useCallback(
    ({
      data,
      onChangeSelect,
      value,
      containerClassName,
      labelClassName,
      placeholder,
      label,
    }: UseSelectProps) => {
      return (
        <div className={twMerge("col gap-y-1", containerClassName)}>
          <label
            htmlFor={id}
            className={twMerge("text-gray text-sm", labelClassName)}
          >
            {label}
          </label>
          <button
            type="button"
            id={id}
            onClick={showPicker}
            className={twMerge("border border-border")}
          >
            {value && String(value).length > 0 ? value : placeholder ?? "선택"}
          </button>

          {showing && (
            <>
              <div className="row relative -mt-1">
                <ul className="absolute z-10 border border-border shadow:md overflow-hidden rounded top-1">
                  {data.map((item, index) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => {
                          onChangeSelect(item);
                          hide();
                        }}
                        className={twMerge(
                          "h-6 w-full rounded-none text-sm text-gray hover:bg-border",
                          item === String(value) &&
                            "primary text-white hover:bg-theme",
                          index !== 0 && "border-t border-white"
                        )}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
                <span
                  onClick={() => {
                    hide();
                  }}
                  className="fixed top-0 left-0 w-full h-screen z-0"
                />
              </div>
            </>
          )}
        </div>
      );
    },
    [showing, showPicker, hide, id]
  );
  return {
    Component,
    showPicker,
    hide,
  };
};

export default useSelect;
