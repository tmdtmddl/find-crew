import { useCallback, useId, useRef } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

export interface TextInputProps {
  //! 기본적인 컴포넌트 구성
  label: string;
  placeholder?: string;
  value: string | number;
  onChangeText: (value: string) => void;
  message?: string | null;

  onSubmitEditing?: () => void;

  resetHidden?: boolean;

  //! div, label 추가 스타일링
  divClassName?: string;
  labelClassName?: string;
  messageClassName?: string;

  //! input의 내용을 변경하고 싶을 때 쓰면 되는 창구
  props?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

const useTextInput = () => {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () => setTimeout(() => ref.current?.focus(), 100),
    []
  );

  const Component = useCallback(
    ({
      label,
      onChangeText,
      value,
      placeholder,
      divClassName,
      labelClassName,
      props,
      message,
      messageClassName,
      onSubmitEditing,
      resetHidden,
    }: TextInputProps) => {
      return (
        <div className={twMerge("col gap-y-1", divClassName)}>
          {label.length > 0 && (
            <label
              htmlFor={id}
              className={twMerge("text-gray text-sm", labelClassName)}
            >
              {label}
            </label>
          )}
          <div className="relative">
            {!resetHidden && (
              <AiOutlineCloseCircle
                className="absolute top-[50%] right-[10px] text-gray-500 cursor-pointer translate-y-[-50%] active:scale-95 active:opacity-50 transition duration-75"
                onClick={() => {
                  onChangeText("");
                  focus();
                }}
              />
            )}
            <input
              ref={ref}
              {...props}
              id={id}
              value={value}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder={placeholder}
              className={twMerge(
                "border border-border bg-lightGray outline-none rounded h-10 px-2.5 focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b focus:border-b-theme focus:rounded-none focus:bg-white transition w-full",
                props?.className
              )}
              onKeyDown={(e) => {
                const { key, nativeEvent } = e;
                if (key === "Tab" && !nativeEvent.isComposing) {
                  if (onSubmitEditing) {
                    onSubmitEditing();
                  }
                }
                if (props?.onKeyDown) {
                  props.onKeyDown(e);
                }
              }}
            />
          </div>
          {message && (
            <label
              htmlFor={id}
              className={twMerge("text-sm text-red-500", messageClassName)}
            >
              {message}
            </label>
          )}
        </div>
      );
    },
    [id, focus]
  );

  return {
    Component,
    ref,
    focus,
  };
};

export default useTextInput;
