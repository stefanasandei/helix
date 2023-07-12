import { themeAtom } from "~/utils/atoms";
import CommandMenu from "../functional/CommandMenu";
import NavBar from "./NavBar";
import { useAtom } from "jotai";

const AppShell = (props: { children: React.ReactNode }) => {
  const [theme] = useAtom(themeAtom);

  return (
    <>
      <main className={`${theme} dark flex flex-row bg-secondary-700`}>
        <CommandMenu />
        <NavBar />
        <div className="min-h-screen w-full md:ml-16">{props.children}</div>
      </main>
    </>
  );
};

export default AppShell;
