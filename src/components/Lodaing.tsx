import { CgSpinner } from "react-icons/cg";
import { twMerge } from "tailwind-merge";

interface LoadingProps {
  divClassName?: string;
  iconClassName?: string;
  pClassName?: string;
  message?: string;
  hideMessage?: boolean;
}

const Loading = ({
  divClassName,
  hideMessage,
  iconClassName,
  message,
  pClassName,
}: LoadingProps) => {
  return (
    <div
      className={twMerge(
        "fixed col gap-y-2.5 top-0 left-0 w-full h-screen items-center justify-center",
        divClassName
      )}
    >
      <CgSpinner
        className={twMerge("text-6xl animate-spin text-theme", iconClassName)}
      />
      {!hideMessage && (
        <p className={twMerge("text-xl font-light animate-pulse", pClassName)}>
          {message ?? "is Loading..."}
        </p>
      )}
    </div>
  );
};

export default Loading;
