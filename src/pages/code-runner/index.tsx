// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/* eslint no-use-before-define: 0 */
import { Editor, useMonaco } from "@monaco-editor/react";
import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type SetStateAction, useEffect, useState } from "react";
import { PanelGroup, PanelResizeHandle, Panel } from "react-resizable-panels";
import { useWindowSize } from "usehooks-ts";
import EditorSettings, {
  getDefaultEditorSettings,
} from "~/components/functional/EditorSettings";
import AppShell from "~/components/ui/AppShell";
import { LoadingSpinner } from "~/components/ui/Loading";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/Select";
import { Textarea } from "~/components/ui/Textarea";
import { api } from "~/utils/api";
import { fileTreeAtom, isCodingAtom } from "~/utils/atoms";
import { cn } from "~/utils/cn";
import {
  type CodeRunnerFile,
  addHaskellSyntax,
  getLanguage,
  supportedLanguages,
} from "~/utils/code";
import { registerThemes, type Theme } from "~/utils/monaco-themes";
import { AiOutlineFileAdd } from "react-icons/ai";

// yes this should be broken into multiple components
const CodeRunnerPage: NextPage = () => {
  const session = useSession();

  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState(getLanguage(lang).defaultCode);
  const [executing, setExecuting] = useState(false);
  const [fontSize, setFontSize] = useState(getDefaultEditorSettings().fontSize);
  const [fontFamily, setFontFamily] = useState(
    getDefaultEditorSettings().fontFamily
  );
  const [theme, setTheme] = useState<Theme>(getDefaultEditorSettings().theme);
  const [vimMode, setVimMode] = useState<boolean>(false);
  const [vim, setVim] = useState<{ dispose: () => void } | undefined>(
    undefined
  );

  const [_isCoding, setIsCoding] = useAtom(isCodingAtom);
  const [fileTree, setFileTree] = useAtom(fileTreeAtom);

  const [isLeftSide] = useState(true);
  const [currentTab, setCurrentTab] = useState<"output" | "input">("output");
  const [input, setInput] = useState("");

  const size = useWindowSize();

  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    addHaskellSyntax(monaco);

    registerThemes(monaco);

    setFontSize(getDefaultEditorSettings().fontSize);
    setFontFamily(getDefaultEditorSettings().fontFamily);
    setTheme(getDefaultEditorSettings().theme);
    setVimMode(getDefaultEditorSettings().vimMode);

    monaco.editor.setTheme(theme);

    if (vimMode) {
      const enableVim = (MonacoVim: {
        initVimMode: (
          arg0: unknown | undefined,
          arg1: HTMLElement | null
        ) => { dispose: () => void };
      }) => {
        setVim(
          MonacoVim.initVimMode(
            monaco.editor.getEditors()[0],
            document.getElementById("vim-bar")
          ) as { dispose: () => void }
        );
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.require(["monaco-vim"], enableVim);
    } else {
      if (vim != undefined) {
        vim.dispose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco, theme, vimMode]);

  const runCode = api.code.runCode.useMutation({
    onSuccess: (data) => {
      setOutput(data as string);
      setExecuting(false);
    },
  });

  const handleEditorChange = (value: string | undefined, _: unknown) => {
    setCode(value as string);
    setIsCoding(true);

    setFileTree(
      fileTree.map((file) => {
        // todo: lang vs language vs extension
        if (file.name == "main" && file.language == lang)
          file.contents = value as string;
        return file;
      })
    );
  };

  const handleEditorMount = (_editor: unknown, _monaco: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.require.config({
      paths: {
        "monaco-vim": "https://unpkg.com/monaco-vim@0.4.0/dist/monaco-vim.js",
      },
    });

    if (fileTree.length == 0) {
      // todo...
      setIsCoding(false);
      setFileTree([
        {
          contents: code,
          language: lang,
          name: "main",
        },
      ]);
    } else setIsCoding(true);
  };

  const run = () => {
    setExecuting(true);
    setCurrentTab("output");
    runCode.mutate({ code: code, language: lang, input: input });
  };

  const sidebar = (
    <div className="h-full rounded-md bg-secondary-800 p-2">
      <div className="mb-2 flex w-full flex-row items-center gap-3">
        <button onClick={() => run()}>
          <p
            className={`relative flex h-10 w-10 items-center justify-center 
                      ${"bg-secondary-700 text-accent-400 hover:rounded-xl hover:bg-accent-500 hover:text-primary-400"}
                      group rounded-3xl transition-all duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          </p>
        </button>
        {session.status == "authenticated" && (
          <button
            onClick={() => {
              const filename = prompt("Please enter a filename:", "");
              if (filename != null && filename != "") {
                // todo: create file, file tree, all in local storage\
                let name = filename,
                  ext = "cpp";
                if (filename.includes(".")) {
                  name = filename.substring(0, filename.indexOf("."));
                  ext = filename.substring(filename.indexOf(".") + 1);
                }

                const file: CodeRunnerFile = {
                  name: name,
                  language: ext,
                  contents: getLanguage(ext, true).defaultCode,
                };

                setFileTree([...fileTree, file]);
              }
            }}
          >
            <p
              className={`relative flex h-10 w-10 items-center justify-center 
                      ${"bg-secondary-700 text-accent-400 hover:rounded-xl hover:bg-accent-500 hover:text-primary-400"}
                      group rounded-3xl transition-all duration-200`}
            >
              <AiOutlineFileAdd className="h-6 w-6" />
            </p>
          </button>
        )}
        <Select
          defaultValue={lang}
          onValueChange={(newValue: SetStateAction<string>) => {
            setFileTree(
              fileTree.map((file) => {
                // todo: lang vs language vs extension
                if (file.name == "main" && file.language == lang) {
                  file.contents = getLanguage(newValue.toString()).defaultCode;
                  file.language = newValue.toString();
                }
                return file;
              })
            );

            if (_isCoding) {
              if (
                confirm(
                  "You have unsaved changes. Do you want to switch the language?"
                )
              ) {
                setLang(newValue.toString());
                setCode(getLanguage(newValue.toString()).defaultCode);
                setOutput("");
                setIsCoding(false);
              }
            } else {
              setLang(newValue.toString());
              setCode(getLanguage(newValue.toString()).defaultCode);
              setOutput("");
              setIsCoding(false);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((supLang) => (
              <SelectItem value={supLang.name} key={supLang.name}>
                {supLang.fancyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {session.status == "loading" ? (
        <div className="flex h-full items-center justify-center text-center">
          <LoadingSpinner size={40} />
        </div>
      ) : (
        <></>
      )}
      {session.status == "unauthenticated" ? (
        <div className="flex h-full items-center justify-center text-center">
          <p>
            <Link href="/auth/signin" className="text-accent-400 underline">
              Login
            </Link>{" "}
            to be able to edit multiple files and save your projects.
          </p>
        </div>
      ) : (
        session.status ==
          "authenticated" /* todo: add default file and change when select lang */ && (
          <div className="mt-5">
            {/* <h1>Files:</h1> */}
            {fileTree.map((file) => {
              return (
                <div
                  key={file.name}
                  className="my-2 w-full rounded-lg bg-secondary-700 p-2 transition-all hover:cursor-pointer hover:bg-secondary-600"
                  onClick={() => console.log(file.contents)}
                >
                  <p>
                    {file.name}.{file.language}
                  </p>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );

  const editor = (
    <PanelGroup direction="vertical">
      <Panel className="m-0" defaultSize={70} maxSize={90} minSize={60}>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row">
            <div className="m-1 flex flex-row items-center justify-between gap-1 rounded-t-lg bg-accent-500 px-2 py-1">
              <p>main.{getLanguage(lang).extension}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 20"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div className="mr-5 flex flex-row items-center gap-3">
            <div>
              {vimMode && (
                <div
                  className="mr-3 bg-secondary-700 font-mono text-primary-500"
                  id="vim-bar"
                ></div>
              )}
            </div>
            <EditorSettings
              callback={(args) => {
                setFontSize(args.fontSize);
                setFontFamily(args.fontFamily);
                setTheme(args.theme);
                setVimMode(args.vimMode);
              }}
            />
          </div>
        </div>
        <Editor
          height="90vh"
          loading={<LoadingSpinner />}
          defaultLanguage={lang}
          language={lang}
          theme={theme as string}
          options={{
            smoothScrolling: true,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontLigatures: true,
          }}
          defaultValue={code}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
        />
      </Panel>
      <PanelResizeHandle className="h-1 bg-secondary-800 focus:bg-secondary-600" />
      <Panel
        defaultSize={30}
        minSize={10}
        maxSize={40}
        className="flex h-full flex-col "
      >
        <div className="h-full overflow-y-auto whitespace-pre bg-secondary-800 p-2 font-mono text-sm">
          {currentTab == "output" ? (
            !executing ? (
              <span>
                {output != "" ? output : "Run your code to see the output!"}
              </span>
            ) : (
              <div className="flex min-h-full items-center justify-center">
                <LoadingSpinner size={50} />
              </div>
            )
          ) : (
            <></>
          )}
          {currentTab == "input" && (
            <div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your input data here!"
                className="h-full border-none ring-2 ring-secondary-700"
              ></Textarea>
            </div>
          )}
        </div>
        <div className="flex w-full flex-row gap-5 border-t-2 border-secondary-700 bg-secondary-800 p-1 transition-all">
          <button
            className={cn(
              "rounded-lg border-2 p-2 transition-all",
              currentTab == "output"
                ? "border-black bg-black text-accent-400"
                : "border-secondary-800 hover:bg-secondary-600"
            )}
            onClick={() => setCurrentTab("output")}
          >
            output
          </button>
          <button
            className={cn(
              "rounded-lg border-2 p-2 transition-all",
              currentTab != "output"
                ? "border-black bg-black text-accent-400"
                : "border-secondary-800 hover:bg-secondary-600"
            )}
            onClick={() => setCurrentTab("input")}
          >
            input
          </button>
        </div>
      </Panel>
    </PanelGroup>
  );

  return (
    <AppShell>
      <Head>
        <title>Helix | Code Runner</title>
      </Head>
      <PanelGroup direction="horizontal">
        {isLeftSide ? (
          <>
            <Panel
              className="hidden md:block"
              collapsible={true}
              defaultSize={15}
              minSize={10}
              maxSize={40}
            >
              {sidebar}
            </Panel>
            <PanelResizeHandle className="w-1 bg-secondary-800 focus:bg-secondary-600" />
            <Panel minSize={60}>{editor}</Panel>
          </>
        ) : (
          <>
            <Panel minSize={70}>{editor}</Panel>
            <PanelResizeHandle className="w-1 bg-secondary-800 focus:bg-secondary-600" />
            {size.width > 768 && (
              <Panel
                collapsible={true}
                defaultSize={20}
                minSize={10}
                maxSize={30}
              >
                {sidebar}
              </Panel>
            )}
          </>
        )}
      </PanelGroup>
    </AppShell>
  );
};

export default CodeRunnerPage;
