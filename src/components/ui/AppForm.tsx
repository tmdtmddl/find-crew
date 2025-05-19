import { twMerge } from "tailwind-merge";

export type FormType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

const AppForm = (props: FormType) => {
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.onSubmit) {
          props.onSubmit(e);
        }
      }}
      className={twMerge(
        "max-w-100 mx-auto col gap-y-2.5 p-5",
        props?.className
      )}
    />
  );
};

export default AppForm;
