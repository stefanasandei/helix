/* eslint-disable @next/next/no-img-element */

import Image from "next/image";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  CommandLineIcon,
  CloudIcon,
  BookOpenIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import Show from "~/components/functional/Show";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Footer from "../ui/Footer";
import { motion } from "framer-motion";
import { Balancer } from "react-wrap-balancer";
import Head from "next/head";
import HelixLogo from "../ui/icons/HelixLogo";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    // { name: "Courses", href: "/courses" },
    { name: "Code Runner", href: "/code-runner" },
    { name: "Forum", href: "/forum" },
    // { name: "About", href: "/about" },
    { name: "Mission", href: "#mission" },
    { name: "Source", href: "https://github.com/HelixStudio/helix" },
  ];

  return (
    <>
      <Head>
        <title>Helix - Unleash your coding potential</title>
        <meta
          key="description"
          content="Meet the new standard for computer science education. Helix is an open-source platform that combines the best parts of every platform into one."
        />
        {/* TODO: find good preview image */}
        <meta
          property="og:image"
          content="https://media.discordapp.net/attachments/833285965019217980/1138861793578590339/Screenshot_2023-08-09_at_18.39.27.png?width=1538&height=1046"
        />
      </Head>
      <div
        id="main-container"
        className="pink flex min-h-screen flex-col bg-gradient-to-tr from-zinc-900 via-zinc-900 via-60% to-pink-500 lg:px-10"
      >
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="sticky top-0 z-50 max-w-5xl items-center bg-zinc-900/70 backdrop-blur-lg lg:top-[0.75rem] lg:mx-auto lg:mt-3 lg:w-[60rem] lg:rounded-lg"
        >
          <nav
            className="flex items-center justify-between p-2 lg:px-8"
            aria-label="Logo"
          >
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                {/* TODO: Replace me with an SVG, it will look better, trust me! -Michael */}
                <span className="text-lg font-bold leading-normal text-white">
                  {/* Helix<span className="text-accent-400">.</span> */}
                  {/* TODO(@Stefan) 
                  Verify this works evenly throughout resolutions, it should but just to be sure. -Mihai */}
                  <HelixLogo width={100} height={30} />
                </span>
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                aria-label="open main menu"
                className="-my-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-lg px-2 py-1 text-sm leading-6 text-gray-200 transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Button variant={"muted"} onClick={() => void signIn()}>
                Log in <span aria-hidden="true">&rarr;</span>
              </Button>
            </div>
          </nav>
        </motion.div>
        <Show when={mobileMenuOpen}>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-zinc-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="font-bold text-white">Helix</span>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-100/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 transition-colors hover:bg-gray-700"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Button variant={"primary"} onClick={() => void signIn()}>
                    Log in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Show>

        <div className="relative isolate px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.5,
            }}
            className="mx-auto py-32 sm:py-48 md:max-w-[50%] lg:pb-8 lg:pt-32"
          >
            {/* <div className="hidden p-3 sm:mb-8 sm:flex sm:justify-center">
              <div
                className="relative rounded-full bg-zinc-800 px-3 px-3 py-1 
              py-2 text-sm leading-6 text-gray-100 ring-1 ring-gray-100/10 
              transition-colors hover:bg-gray-700 hover:ring-gray-200/20"
              >
                <div
                  className="absolute -inset-2 -z-30
                 animate-pulse rounded-full bg-gradient-to-r from-purple-600
                  to-pink-600 opacity-25 blur"
                ></div>
                We&apos;re launching!{" "}
                <a
                  href="https://github.com/nikolatesla13/helix"
                  className="text-accent-400"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div> */}
            <div className="text-center">
              <h1 className="bg-gradient-to-br from-zinc-50 to-zinc-400 bg-clip-text pb-2 text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
                <div className="flex flex-col items-center">
                  {/* <Balancer>Helix</Balancer> */}
                  <Balancer className="text-5xl font-extrabold tracking-tighter md:text-6xl">
                    Unleash Your Coding Potential
                  </Balancer>
                </div>
              </h1>
              <p className="text-gray-11 dark:text-graydark-11 mt-6 leading-normal tracking-tight md:text-base md:leading-7">
                <Balancer>
                  Meet the new standard for computer science education. Helix is
                  an open-source platform that combines the best parts of every
                  platform into one. Built{" "}
                  <span className="italic underline decoration-[#F690C9] underline-offset-4">
                    by students for students.
                  </span>
                </Balancer>
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  variant={"secondary"}
                  size={"Homedefault"}
                  onClick={() => {
                    window.scrollBy(0, 600);
                  }}
                >
                  Features <span aria-hidden="true"> ↴</span>
                </Button>
                <Button
                  variant={"accent"}
                  size={"Homedefault"}
                  onClick={() => void signIn()}
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="inline sm:hidden">Login</span>
                  <span aria-hidden="true"> →</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto flex max-w-6xl items-center justify-center overflow-hidden rounded-lg px-10 py-10">
          <div className="flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-zinc-800 p-2 shadow-lg ring-1 ring-slate-200/20">
            <svg
              className="h-6 w-6 text-slate-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >
          <div className="overflow-hiddem relative isolate px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="lg:max-w-lg">
                    <p className="text-base font-semibold leading-7 text-accent-400">
                      Learn faster
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                      A better workflow
                    </h1>
                    <p className="mt-6 text-xl leading-8 text-gray-200">
                      Helix is designed from the ground up to be easy and
                      convinient to use.
                    </p>
                  </div>
                </div>
              </div>
              <div className="-ml-12 -mt-12 max-w-5xl p-12 lg:sticky lg:top-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                <div className="min-h-full overflow-hidden rounded-lg border-2 border-zinc-600">
                  <Image
                    className=""
                    src="https://media.discordapp.net/attachments/739478958118010911/1118188070274088990/Screenshot_2023-06-13_at_17.39.20.png?width=2080&height=1046"
                    alt="App screenshot"
                    width={1824}
                    height={1080}
                  />
                </div>
              </div>
              <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:pr-4">
                  <div className="max-w-xl text-base leading-7 text-gray-200 lg:max-w-lg">
                    <p>
                      Everything you need to learn programming is right here.
                      From a fast and modern code editor, debugger and code
                      runner to interactive courses, communities and forums. We
                      are a non-profit platform, built by students for students.
                    </p>
                    <ul role="list" className="mt-8 space-y-8 text-gray-200">
                      <li className="flex gap-x-3">
                        <CommandLineIcon
                          className="mt-1 h-5 w-5 flex-none text-accent-500"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold text-gray-100">
                            Integrated development enviorment
                          </strong>
                          {": "}
                          No need to leave the browser window with our web IDE.
                          Write the code with the problem statement
                          side-by-side.
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <BookOpenIcon
                          className="mt-1 h-5 w-5 flex-none text-accent-500"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold text-gray-100">
                            Courses
                          </strong>
                          {": "}
                          Learn new things by taking our free courses.
                          They&apos;re fast paced and well explained.
                        </span>
                      </li>
                      <li className="flex gap-x-3">
                        <CloudIcon
                          className="mt-1 h-5 w-5 flex-none text-accent-500"
                          aria-hidden="true"
                        />
                        <span>
                          <strong className="font-semibold text-gray-100">
                            Cloud
                          </strong>
                          {": "}
                          All your projects and progress is automatically saved
                          securely in the cloud. Access from your account on any
                          device.
                        </span>
                      </li>
                    </ul>
                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-100">
                      No experience? No problem.
                    </h2>
                    <p className="mt-6">
                      Helix is a platform open to learning. Take our beginner
                      courses to get started in the world of programming.
                      Designed to take minimal time and get straight to the
                      point. Discuss with other learners on our forum!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >
          <div className="mb-44 w-full max-w-6xl px-4 pt-12 lg:mx-auto ">
            <h1 className="mb-5 text-2xl">What makes us different?</h1>
            <Table>
              <TableCaption>
                A comparison between similar websites.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>PbInfo</TableHead>
                  {/* <TableHead>InfoArena</TableHead> */}
                  <TableHead>CodeForces</TableHead>
                  <TableHead>Helix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Algorithm problems</TableCell>
                  <TableCell>✅</TableCell>
                  {/* <TableCell>✅</TableCell> */}
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Forum</TableCell>
                  <TableCell>❌</TableCell>
                  {/* <TableCell>✅</TableCell> */}
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contests</TableCell>
                  <TableCell>❌</TableCell>
                  {/* <TableCell>❌</TableCell> */}
                  <TableCell>✅</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                {/* 
                <TableRow>
                  <TableCell>Free courses (WIP)</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow> 
                */}
                <TableRow>
                  <TableCell>Custom help</TableCell>
                  <TableCell>❌</TableCell>
                  {/* <TableCell>❌</TableCell> */}
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Full personalization</TableCell>
                  <TableCell>❌</TableCell>
                  {/* <TableCell>❌</TableCell> */}
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Integrated modern editor</TableCell>
                  <TableCell>❌</TableCell>
                  {/* <TableCell>❌</TableCell> */}
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CTF challenges</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>❌</TableCell>
                  <TableCell>✅</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >
          <div className="w-full max-w-6xl px-4 pt-12 lg:mx-auto ">
            <h1 className="mx-auto mb-20 max-w-[20ch] text-center text-5xl font-extrabold tracking-tighter">
              Sponsors
            </h1>
            <div className="flex w-full">
              <div className="mx-auto">
                <img
                  src="https://uploads-ssl.webflow.com/63d93bbadbe872564cebbb37/63d9454769f8a6423cd69c4c_binomeway%20logo%20white.png"
                  alt="Binomeway Logo"
                  className="bject-cover max-w-[80vw] md:max-w-lg"
                />
                <p className="text-center">
                  <Link
                    href="https://www.binomeway.com/"
                    className="text-accent-400 underline hover:text-accent-500"
                    target="_blank"
                  >
                    Binomeway
                  </Link>
                </p>
              </div>
            </div>
            {/* How to make this fit in?
            <p className="mt-10 text-lg">
              We are very greateful for our sponsors!
            </p> */}
          </div>
        </motion.div>

        <div id="mission" />
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
        >
          <div className="container mx-auto mt-36 flex flex-col gap-8 lg:mt-56">
            <h1 className="mx-auto max-w-[20ch] text-center text-5xl font-extrabold tracking-tighter md:text-6xl">
              <span>Our Mission</span>
            </h1>
            <p className="mx-auto leading-7 text-gray-300 lg:max-w-[80ch]">
              You know that friend that you talk about the future with?
              <br />
              <br />
              Well we&apos;re two friends, Stefan and Mihai that talk about the
              future.{" "}
              <span className="text-accent-400">
                The future of education.
              </span>{" "}
              We both came up with a similar idea while talking about how great
              it would be to have a platform that would emphasize the importance
              of practical programming in 🇷🇴 Romania.
              <br />
              <br />
              Stefan took it a step further and implemented it for{" "}
              <a
                className="text-accent-400"
                href="https://infoeducatie.ro/rezultate"
                target="_blank"
              >
                #InfoEducatie2023
              </a>
              , where the project also won the first place. Later on, Mihai came
              and started reworking its foundations and started writing CTF
              challenges for our contest{" "}
              <span className="text-accent-400">BitByBit</span>.
              <br />
              <br />
              We wanted a platform that could emphasize{" "}
              <span className="text-accent-400">practical programming</span> in
              an easy to use way, give us information about various CS career
              paths and still teach{" "}
              <span className="text-accent-400">DS&A</span>. Web based IDEs,
              Forums, Contests and so much more. What you see as Helix is only
              the beginning.
              <br />
              <br />
              <span className="text-accent-400">Helix</span> is an attempt at
              becoming a blend of everything that we needed when we started
              pursuing our degrees and an attempt at modernizing the education
              system.
            </p>
          </div>
        </motion.div>

        <div className="text-gray-12 mt-36 flex h-full w-full flex-col justify-center gap-2 rounded-2xl bg-[#ff2dadc4] px-4 py-14 lg:mx-auto lg:mt-56">
          <div className="container mx-auto flex flex-col items-start gap-6">
            <h1 className="max-w-[553px] text-5xl font-extrabold tracking-tighter text-black md:text-6xl">
              <Balancer>So what are you waiting for?</Balancer>
            </h1>
            <p className="max-w-[620px] font-semibold tracking-tight text-black">
              It would mean the world to us if you think Helix will impact your
              education for the better and would sign up! We are working hard to
              deliver the best <span className="text-primary-400">free</span>{" "}
              and <span className="text-primary-400">open source</span>{" "}
              experience to improve computer science education.
            </p>{" "}
            <Button
              variant={"primary"}
              className="font-bold"
              size={"Homedefault"}
              onClick={() => void signIn()}
            >
              Join Helix <span aria-hidden="true"> →</span>
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
