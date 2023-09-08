import { type NextPage } from "next";
import Footer from "~/components/ui/Footer";
import HelixLogo from "~/components/ui/icons/HelixLogo";

const ChangeLog: NextPage = () => {
  return (
    <div className="pink bg-gradient-to-b from-slate-900 to-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-3 p-5">
        <div className="align-left justify-left flex flex-col">
          <HelixLogo width={300} height={100} viewBoxLeft={150} />
          <h1 className="mb-3 text-3xl font-bold">
            Changelog - Work in progress
          </h1>
        </div>
        {/* TODO(@Stefan)
            text-accent-400 doesn't really work here so I used text-pink-400,
            see what's wrong at a more reasonable hour please, I am coding this
            at 11:43 PM 9/7/2023 atm since once I get into the flow I can't stop.
            Thanks. - Mihai
        */}
        <ul className="list-inside list-disc text-left marker:text-pink-400">
          <li>
            <span className="font-bold">Helix 1.0.9</span>
            {" - "}Rebranded <span className="text-pink-400">Helix</span> logo,
            UI, made the GitHub organization{" "}
            <span className="text-pink-400">aesthetic</span> and wrote changelog
            up to <span className="text-pink-400">9/7/2023</span>.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.8</span>
            {" - "}Added{" "}
            <span className="text-pink-400">autoinstall scripts</span> for ease
            of deployment and <span className="text-pink-400">dockerized</span>{" "}
            Helix.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.7</span>
            {" - "}Moved to <span className="text-pink-400">#HelixTeam</span>{" "}
            repo and changed <span className="text-pink-400">license</span>.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.6</span>
            {" - "}UI Fixes:{" "}
            <span className="text-pink-400">
              Navbar, Buttons, Mobile UI, Color Scheme
            </span>
            .
          </li>
          <li>
            <span className="font-bold">Helix 1.0.5</span>
            {" - "}Added{" "}
            <span className="text-pink-400">
              contests page &amp; training CTF and Algorithms challenges
            </span>
            .
          </li>
          <li>
            <span className="font-bold">Helix 1.0.4</span>
            {" - "}Added more{" "}
            <span className="text-pink-400">educational content</span>.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.3</span>
            {" - "}Added new{" "}
            <span className="text-pink-400">aesthetic landing page</span> and
            fixed typos.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.2</span>
            {" - "}Added new{" "}
            <span className="text-pink-400">fluent ui home page</span> and fixed
            typos.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.1</span>
            {" - "}Added the <span className="text-pink-400">BitByBit</span>{" "}
            contests, extra documentation and more{" "}
            <span className="text-pink-400">SEO</span>.
          </li>
          <li>
            <span className="font-bold">Helix 1.0.0</span>
            {" - "}Won <span className="text-pink-400">#InfoEducatie2023</span>.
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default ChangeLog;
