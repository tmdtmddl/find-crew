import { useCallback, useId } from "react";
import { twMerge } from "tailwind-merge";
export interface TextInputProps {
  //! 기본적인 컴포넌트 구성
  label: string;
  placholder?: string;
  value: string | number;
  onChangeText: (value: string) => void;
  divClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  props?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}
const useTextInput = ({
  label,
  onChangeText,
  value,
  divClassName,
  inputClassName,
  labelClassName,
  placholder,
  props,
}: TextInputProps) => {
  const id = useId();
  const Component = useCallback(() => {
    return (
      <div className="col gap-y-1">
        <label htmlFor={id}>{label}</label>
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          className={twMerge(
            "border border-border bg-lightGray rounded outline-none h-10 px-2.5 focus:border-l-0  ",
            props?.className
          )}
        />
      </div>
    );
  }, []);
  return {
    Component,
  };
};

export default useTextInput;
