import React from "react";
import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
  title: string;
  content: string;
}

const MainContainer = ({ fixed, content, title, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        "peer-[.header-fixed]/header:mt-16",
        "px-4 py-6",
        fixed && "fixed-main flex grow flex-col overflow-hidden"
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{content}</p>
        </div>
      </div>
      {props.children}
    </main>
  );
};
export default MainContainer;
