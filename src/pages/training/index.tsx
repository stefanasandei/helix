import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ContestsTable } from "~/components/sections/ContestsTable";
import AppShell from "~/components/ui/AppShell";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { LoadingSection } from "~/components/ui/Loading";
import { Progress } from "~/components/ui/Progress";
import { api } from "~/utils/api";
import { type CategoryProgress } from "~/utils/code";
import { toastPlain } from "~/utils/toast";

const TrainingPage: NextPage = () => {
  const session = useSession();

  const cpProgress = api.problem.getProgress.useQuery();
  const ctfProgress = api.ctf.getProgress.useQuery();
  const eulerProgress: CategoryProgress = { count: 0, progress: 0.0 };

  const router = useRouter();

  if (
    session.status === "loading" ||
    cpProgress.isLoading ||
    ctfProgress.isLoading
  )
    return <LoadingSection />;

  if (session.status === "unauthenticated") {
    void router.push("/");
    toastPlain("You need to be logged in to access this page!");
  }

  return (
    <AppShell>
      <Head>
        <title>Helix | Training</title>
      </Head>
      <main className="mx-auto h-full max-w-7xl bg-secondary-700 text-white">
        <div className="rounded-lg bg-secondary-700 p-3 ring-secondary-600 lg:mt-5 lg:ring-4">
          <h2 className="items-center pb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Upcoming contests
          </h2>
          <div className="overflow-x-auto rounded-lg">
            <ContestsTable isSmall={false} isDark={false} />
          </div>
          {/* <div className="py-3">
            <p>write some text idk</p>
          </div> */}
        </div>
        <div className="mx-3 mt-5 grid grid-rows-3 gap-5 md:mx-0 md:grid-cols-3 md:grid-rows-1">
          <Card>
            <CardHeader>
              <CardTitle>Capture The Flag</CardTitle>
              <CardDescription>
                CTF challenges are related to cybersecurity and can help you
                gain a better understanding of IT infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ctf">
                <Button>See challenges</Button>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-3">
              <Progress value={ctfProgress.data?.progress} />
              <p>{ctfProgress.data?.count} challenges solved</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Competitive programming</CardTitle>
              <CardDescription>
                TODO: write good test, lorem ipsum doler mit amet lorem ipsum
                doler mit amet lorem ipsum doler mit amet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/online-judge">
                <Button>See challenges</Button>
              </Link>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-3">
              <Progress value={cpProgress.data?.progress} />
              <p>{cpProgress.data?.count} challenges solved</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Euler project</CardTitle>
              <CardDescription>
                Project Euler is a series of challenging mathematical problems
                that will require more than just mathematical insights to solve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant={"outline"}>Coming soon!</Button>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-3">
              <Progress value={eulerProgress.progress} />
              <p>{eulerProgress.count} challenges solved</p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex h-[20vh] items-center justify-center">
          <p>more content coming soon!</p>
        </div>
      </main>
    </AppShell>
  );
};

export default TrainingPage;
