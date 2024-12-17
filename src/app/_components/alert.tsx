import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import cn from "classnames";

type Props = {
  preview?: boolean;
};

const Alert = ({ preview }: Props) => {
  return (
    <div
      className={cn("p-4 text-center", {
        "bg-yellow-200 text-yellow-800": preview,
        "bg-green-200 text-green-800": !preview,
      })}
    >
      {preview ? "Preview mode is on." : "Live mode is active."}
    </div>
  );
};
export default Alert;
