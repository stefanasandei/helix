// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/* eslint no-use-before-define: 0 */
import { Editor, useMonaco } from "@monaco-editor/react";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { PanelGroup, Panel } from "react-resizable-panels";
import EditorSettings, {
  getDefaultEditorSettings,
} from "~/components/functional/code/EditorSettings";
import PreviewShader from "~/components/sections/PreviewShader";
import AppShell from "~/components/ui/AppShell";
import { LoadingSpinner } from "~/components/ui/Loading";
import { registerThemes, type Theme } from "~/utils/monaco-themes";
import { WGSLlanguage } from "~/utils/wgsl";

const shader = `struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) coord: vec2f,
};
 
@vertex
fn vertexMain(@location(0) coord: vec2f) -> VertexOutput {
  var out: VertexOutput;
  out.coord = coord;
  out.position = vec4f(coord, 0.0, 1.0);
      
  return out;
}
 
@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4f {
  let normalized = (in.coord + vec2f(1.0, 1.0)) / 2.0;
 
  return vec4f(normalized.xy, 0.0, 1.0);
}
`;

const CanvasPage: NextPage = () => {
  const [code, setCode] = useState(shader);
  const [fontSize, setFontSize] = useState(getDefaultEditorSettings().fontSize);
  const [fontFamily, setFontFamily] = useState(
    getDefaultEditorSettings().fontFamily
  );
  const [theme, setTheme] = useState<Theme>(getDefaultEditorSettings().theme);
  const [vimMode, setVimMode] = useState<boolean>(false);
  const [vim, setVim] = useState<{ dispose: () => void } | undefined>(
    undefined
  );

  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) return;

    registerThemes(monaco);

    setFontSize(getDefaultEditorSettings().fontSize);
    setFontFamily(getDefaultEditorSettings().fontFamily);
    setTheme(getDefaultEditorSettings().theme);
    setVimMode(getDefaultEditorSettings().vimMode);

    monaco.languages.register({ id: "wgsl" });
    monaco.languages.setMonarchTokensProvider(
      "wgsl",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      WGSLlanguage as any
    );

    monaco.editor.setTheme(theme);

    if (localStorage.getItem("shaderCode") != null) {
      setCode(localStorage.getItem("shaderCode") as string);
    }

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

  const handleEditorChange = (value: string | undefined, _: unknown) => {
    setCode(value as string);
    localStorage.setItem("shaderCode", value as string);
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
  };

  return (
    <AppShell>
      <Head>
        <title>Helix | Code Runner</title>
      </Head>
      <div>
        <PanelGroup direction="horizontal" className="min-h-screen">
          <Panel defaultSize={50} minSize={30} maxSize={70} className="h-full">
            <div className="flex w-full flex-row items-center justify-between">
              <p className="pl-3">WebGPU Shading Language</p>
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
              height="94vh"
              loading={<LoadingSpinner />}
              defaultLanguage={"wgsl"}
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
          {/* <PanelResizeHandle className="w-1 bg-secondary-800 focus:bg-secondary-600" /> */}
          <PreviewShader shader={code} />
        </PanelGroup>
      </div>
    </AppShell>
  );
};

export default CanvasPage;
