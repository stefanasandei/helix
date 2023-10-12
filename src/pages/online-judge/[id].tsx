import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useWindowSize } from "usehooks-ts";
import { type ProblemMetadata } from "~/components/sections/StatementView";
import Editor from "~/components/sections/online-judge/Editor";
import Informations from "~/components/sections/online-judge/Informations";
import Solutions from "~/components/sections/online-judge/Solutions";
import AppShell from "~/components/ui/AppShell";
import { LoadingSection } from "~/components/ui/Loading";
import { api } from "~/utils/api";
import { toastPlain } from "~/utils/toast";

const OnlineJudgePage: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const size = useWindowSize();

  let isAnon = false;

  const problem = api.problem.getProblemById.useQuery({
    id: parseInt(router.query.id as string),
  });

  if (session.status === "loading" || problem.isLoading)
    return <LoadingSection />;

  if (session.status === "unauthenticated") {
    isAnon = true;
    // void router.push("/");
    // toastPlain("You need to be logged in to access this page!");
  }

  if (problem.data == null || problem.isError) {
    toastPlain("Problem not found!");
    void router.push("/online-judge");
    return <></>;
  }

  return (
    <AppShell>
      <Head>
        <title>Helix | Online Judge</title>
      </Head>
      <main className="h-screen bg-secondary-700 text-white">
        {size.width < 768 ? (
          <Informations problem={problem.data as ProblemMetadata} />
        ) : (
          <PanelGroup direction="horizontal" className="min-h-screen">
            <Panel defaultSize={50} minSize={42} maxSize={70}>
              <Informations problem={problem.data as ProblemMetadata} />
            </Panel>
            <PanelResizeHandle className="w-1 bg-secondary-700 focus:bg-secondary-600" />
            <Panel defaultSize={50} minSize={30} maxSize={58}>
              <PanelGroup direction="vertical" className="min-h-screen">
                <Panel defaultSize={75} minSize={20} maxSize={85}>
                  <Editor problemId={problem.data.id} isAnon={isAnon} />
                </Panel>
                <PanelResizeHandle className="h-1 bg-secondary-700 focus:bg-secondary-600" />
                <Panel defaultSize={25} minSize={15} maxSize={80}>
                  <Solutions problemId={problem.data.id} isAnon={isAnon} />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        )}
      </main>
    </AppShell>
  );
};

export default OnlineJudgePage;
