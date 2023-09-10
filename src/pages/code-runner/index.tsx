// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/* eslint no-use-before-define: 0 */
import { useAtom } from "jotai";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { type SetStateAction, useState } from "react";
import { PanelGroup, PanelResizeHandle, Panel } from "react-resizable-panels";
import EditorSettings, {
  getDefaultEditorSettings,
} from "~/components/functional/code/EditorSettings";
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
import { fileTreeAtom } from "~/utils/atoms";
import { cn } from "~/utils/cn";
import {
  type CodeRunnerFile,
  getLanguage,
  supportedLanguages,
} from "~/utils/code";
import { type Theme } from "~/utils/monaco-themes";
import { AiOutlineFileAdd } from "react-icons/ai";
import CodeEditor, {
  codeEditorDefaults,
} from "~/components/functional/code/CodeEditor";
import { SlOptionsVertical } from "react-icons/sl";

const CodeRunnerPage: NextPage = () => {
  const session = useSession();

  // code settings
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

  // files state
  const [currentFile, setCurrentFile] = useState<string>("main");
  const [fileTree, setFileTree] = useAtom(fileTreeAtom);

  // bottom io bar
  const [currentTab, setCurrentTab] = useState<"output" | "input">("output");
  const [input, setInput] = useState("");

  const runCode = api.code.runCode.useMutation({
    onSuccess: (data) => {
      setOutput(data as string);
      setExecuting(false);
    },
  });

  const onEditorChange = (code: string) => {
    setCode(code);

    setFileTree(
      fileTree.map((file) => {
        if (file.name == currentFile) file.contents = code;
        return file;
      })
    );
  };

  const onEditorMount = () => {
    // if (fileTree.length == 0) {
    //   setFileTree([
    //     {
    //       contents: code,
    //       extension: getLanguage(lang).extension,
    //       name: currentFile,
    //     },
    //   ]);
    // }
  };

  const run = () => {
    setExecuting(true);
    setCurrentTab("output");
    runCode.mutate({ code: code, language: lang, input: input });
  };

  const changeFile = (newFile: CodeRunnerFile) => {
    setCurrentFile(newFile.name);

    setLang(getLanguage(newFile.extension, true).name);
    setCode(newFile.contents);
  };

  const createNewFile = (userIsNormie = false) => {
    let filename: string | null = fileTree.length == 0 ? "main.cpp" : "";
    if (!userIsNormie) {
      filename = prompt("Please enter a filename:", filename);
      if (filename == null || filename == "") {
        return;
      }
    }

    let name = filename,
      ext = codeEditorDefaults.lang;

    if (filename.includes(".")) {
      name = filename.substring(0, filename.indexOf("."));
      ext = filename.substring(filename.indexOf(".") + 1);
    }

    const file: CodeRunnerFile = {
      name: name,
      extension: ext,
      contents: getLanguage(ext, true).defaultCode,
    };

    setFileTree([...fileTree, file]);
  };

  const deleteFile = (oldFile: CodeRunnerFile) => {
    if (confirm(`Delete ${oldFile.name}.${oldFile.extension}?`))
      setFileTree(fileTree.filter((file) => file.name != oldFile.name));
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
          <button onClick={() => createNewFile()}>
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
            const newLang = getLanguage(newValue.toString());

            setFileTree(
              fileTree.map((file) => {
                if (file.name == currentFile) {
                  file.contents = newLang.defaultCode;
                  file.extension = newLang.extension;
                }
                return file;
              })
            );

            setLang(newValue.toString());
            setOutput("");
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
        session.status == "authenticated" && (
          <div className="mt-5 h-full">
            {fileTree.map((file) => {
              return (
                <div
                  key={file.name}
                  className="my-2 flex w-full flex-row justify-between rounded-lg 
                  bg-secondary-700 p-2 transition-all hover:cursor-pointer hover:bg-secondary-600"
                  onClick={() => changeFile(file)}
                >
                  <p>
                    {file.name}.{file.extension}
                  </p>
                  <button onClick={() => deleteFile(file)}>
                    <SlOptionsVertical />
                  </button>
                </div>
              );
            })}
            {fileTree.length == 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p>You have no file created.</p>
                  <p>
                    <span
                      onClick={() => createNewFile()}
                      className="text-accent-500 hover:cursor-pointer hover:underline"
                    >
                      Click here
                    </span>{" "}
                    to create one.
                  </p>
                </div>
              </div>
            )}
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
            <div className="m-1 flex flex-row items-center justify-between gap-1 rounded-lg bg-accent-500 px-2 py-1">
              <p>
                {currentFile}.{getLanguage(lang).extension}
              </p>
              {/* <svg
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
              </svg> */}
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
        <CodeEditor
          settings={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            initialCode: code,
            lang: lang,
            theme: theme,
            vimMode: vimMode,
          }}
          onCodeChange={onEditorChange}
          onMount={onEditorMount}
          updatedCode={code}
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
        <div className="flex w-full flex-row gap-5 bg-secondary-800 p-1 transition-all">
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
        <Panel
          className="hidden md:block"
          collapsible={true}
          defaultSize={20}
          minSize={10}
          maxSize={40}
        >
          {sidebar}
        </Panel>
        <PanelResizeHandle className="w-1 bg-secondary-800 focus:bg-secondary-600" />
        <Panel minSize={60}>
          {fileTree.length > 0 || session.status == "unauthenticated" ? (
            editor
          ) : (
            <div className="mt-16 flex h-full items-center justify-center">
              <p>
                No file opened.{" "}
                <span
                  onClick={() => createNewFile(true)}
                  className="text-accent-500 hover:cursor-pointer hover:underline"
                >
                  Create a new one!
                </span>
              </p>
            </div>
          )}
        </Panel>
      </PanelGroup>
    </AppShell>
  );
};

export default CodeRunnerPage;
