import { LoadingSpinner } from "~/components/ui/Loading";
import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { addHaskellSyntax, getLanguage } from "~/utils/code";
import {
  type EditorSettingsProps,
  getDefaultEditorSettings,
} from "./EditorSettings";
import { registerThemes } from "~/utils/monaco-themes";
import { isCodingAtom } from "~/utils/atoms";
import { useAtom } from "jotai";

export type CodeEditorSettings = {
  lang: string;
  initialCode: string;
} & EditorSettingsProps;

export const codeEditorDefaults: CodeEditorSettings = {
  lang: "cpp",
  initialCode: getLanguage("cpp").defaultCode,
  fontSize: getDefaultEditorSettings().fontSize,
  fontFamily: getDefaultEditorSettings().fontFamily,
  theme: getDefaultEditorSettings().theme,
  vimMode: getDefaultEditorSettings().vimMode,
};

const CodeEditor = ({
  settings,
  onCodeChange,
}: {
  settings: CodeEditorSettings;
  onCodeChange: (code: string) => void;
}) => {
  const [code, setCode] = useState(settings.initialCode);
  const [vim, setVim] = useState<{ dispose: () => void } | undefined>(
    undefined
  );

  const [isCoding, setIsCoding] = useAtom(isCodingAtom);

  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) return;

    addHaskellSyntax(monaco);

    registerThemes(monaco);

    monaco.editor.setTheme(settings.theme);

    if (settings.vimMode) {
      const enableVim = (MonacoVim: {
        initVimMode: (
          // this is a mess anyway :)
          arg0: unknown,
          arg1: HTMLElement | null
        ) => { dispose: () => void };
      }) => {
        setVim(
          MonacoVim.initVimMode(
            monaco.editor.getEditors()[0],
            document.getElementById("vim-bar") // TODO
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
  }, [monaco, settings.theme, settings.vimMode]);

  return (
    <div className="h-full">
      <MonacoEditor
        loading={<LoadingSpinner />}
        defaultLanguage={settings.lang}
        language={settings.lang}
        theme={settings.theme as string}
        options={{
          smoothScrolling: true,
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          fontLigatures: true,
        }}
        defaultValue={code}
        value={code}
        onChange={(value, _) => {
          setCode(value as string);
          onCodeChange(value as string);
          setIsCoding(true);
        }}
        onMount={() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          window.require.config({
            paths: {
              "monaco-vim":
                "https://unpkg.com/monaco-vim@0.4.0/dist/monaco-vim.js",
            },
          });

          setIsCoding(false);
        }}
      />
    </div>
  );
};

export default CodeEditor;
