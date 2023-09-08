import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { isCodingAtom } from "~/utils/atoms";

export const pages = [
  {
    name: "Home",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path
          fillRule="evenodd"
          d="M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2h-.001z"
        ></path>
      </svg>
    ),
    link: ["/"],
  },
  {
    name: "Forum",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path
          fillRule="evenodd"
          d="M1.5 2.75a.25.25 0 01.25-.25h8.5a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-3.5a.75.75 0 00-.53.22L3.5 11.44V9.25a.75.75 0 00-.75-.75h-1a.25.25 0 01-.25-.25v-5.5zM1.75 1A1.75 1.75 0 000 2.75v5.5C0 9.216.784 10 1.75 10H2v1.543a1.457 1.457 0 002.487 1.03L7.061 10h3.189A1.75 1.75 0 0012 8.25v-5.5A1.75 1.75 0 0010.25 1h-8.5zM14.5 4.75a.25.25 0 00-.25-.25h-.5a.75.75 0 110-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0114.25 12H14v1.543a1.457 1.457 0 01-2.487 1.03L9.22 12.28a.75.75 0 111.06-1.06l2.22 2.22v-2.19a.75.75 0 01.75-.75h1a.25.25 0 00.25-.25v-5.5z"
        ></path>
      </svg>
    ),
    link: ["/forum"],
  },
  {
    name: "Training & Contests",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path
          fillRule="evenodd"
          d="M4.72 3.22a.75.75 0 011.06 1.06L2.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L.47 8.53a.75.75 0 010-1.06l4.25-4.25zm6.56 0a.75.75 0 10-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 101.06 1.06l4.25-4.25a.75.75 0 000-1.06l-4.25-4.25z"
        ></path>
      </svg>
    ),
    link: ["/training", "/online-judge", "/contests", "/ctf"],
  },
  {
    name: "Code Runner",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path
          fillRule="evenodd"
          d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"
        ></path>
      </svg>
    ),
    link: ["/code-runner"],
  },
  {
    name: "AI Coach",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path d="M5.75 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm5.25.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"></path>
        <path
          fillRule="evenodd"
          d="M6.25 0a.75.75 0 000 1.5H7.5v2H3.75A2.25 2.25 0 001.5 5.75V8H.75a.75.75 0 000 1.5h.75v2.75a2.25 2.25 0 002.25 2.25h8.5a2.25 2.25 0 002.25-2.25V9.5h.75a.75.75 0 000-1.5h-.75V5.75a2.25 2.25 0 00-2.25-2.25H9V.75A.75.75 0 008.25 0h-2zM3 5.75A.75.75 0 013.75 5h8.5a.75.75 0 01.75.75v6.5a.75.75 0 01-.75.75h-8.5a.75.75 0 01-.75-.75v-6.5z"
        ></path>
      </svg>
    ),
    link: ["/ai-coach"],
  },
  {
    name: "Settings",
    icon: (
      <svg
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        height="25"
        width="25"
      >
        <path
          fillRule="evenodd"
          d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    ),
    link: ["/settings"],
  },
];

const NavBar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const [isCoding, setIsCoding] = useAtom(isCodingAtom);

  return (
    <nav
      className="fixed bottom-0 z-50 m-0 flex h-16 w-screen flex-row
      bg-secondary-800 text-primary-400 md:h-screen md:w-16 md:flex-col 
      md:[&>*:last-child]:fixed md:[&>*:last-child]:bottom-0 md:[&>*:last-child]:left-0"
    >
      {pages.map((page) => (
        <button
          className="mx-auto ml-2"
          key={page.name}
          onClick={async () => {
            let weMovin = true;
            if (isCoding) {
              const isGood = confirm(
                "You have unsaved code changes. Do you want to leave the page?"
              );
              if (isGood) {
                weMovin = true;
                setIsCoding(false);
              } else weMovin = false;
            }

            if (weMovin) await router.push(page.link[0] as string);
          }}
        >
          <div
            className={`relative my-2 flex h-12 w-12 items-center justify-center 
                      ${
                        (
                          page.link[0] == "/"
                            ? pathname === "/"
                            : page.link.filter((link) =>
                                pathname.startsWith(link)
                              ).length > 0
                        )
                          ? "rounded-xl bg-secondary-800 text-primary-400 ring-2 ring-accent-500"
                          : "bg-secondary-700 text-accent-400 hover:rounded-xl hover:bg-accent-500 hover:text-primary-400"
                      }
                      group rounded-3xl transition-all duration-200`}
          >
            {page.icon}

            <span
              className="absolute -top-14 z-10 m-2 w-auto min-w-max origin-left scale-0 rounded-md
              bg-secondary-900 p-2 text-xs font-bold
              text-primary-400 shadow-md transition-all
              duration-100 group-hover:scale-100 md:left-14 md:top-0"
            >
              {page.name}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
};

export default NavBar;
