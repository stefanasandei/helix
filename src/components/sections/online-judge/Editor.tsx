/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
import UIPanel from "~/components/ui/UIPanel";
import { type SetStateAction, useState } from "react";
import CodeEditor, {
  codeEditorDefaults,
} from "~/components/functional/code/CodeEditor";
import EditorSettings from "~/components/functional/code/EditorSettings";
import { api } from "~/utils/api";
import { toastSuccess } from "~/utils/toast";
import { supportedLanguages, testCode } from "~/utils/code";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  submissionLoadingAtom,
  yourTestsAtom,
  yourTestsResultsAtom,
} from "~/utils/atoms";
import { Submission, SubmissionTest } from "@prisma/client";

const Editor = ({
  problemId,
  isAnon,
}: {
  problemId: number;
  isAnon: boolean;
}) => {
  const [settings, setSettings] = useState(codeEditorDefaults);
  const [lang, setLang] = useState(settings.lang);
  const [code, setCode] = useState(settings.initialCode);

  const [, setSubmissionLoading] = useAtom(submissionLoadingAtom);

  const customTests = useAtomValue(yourTestsAtom);
  const setCustomTestResults = useSetAtom(yourTestsResultsAtom);

  const ojSupportedLanguages = supportedLanguages.filter((l) => {
    const oj = ["c", "cpp", "rust", "haskell"];
    return oj.includes(l.name);
  });

  const context = api.useContext();

  const sendSubmission = api.problem.sendSubmission.useMutation({
    onMutate: () => {
      setSubmissionLoading(true);
    },
    onSuccess: async (
      data:
        | Submission
        | {
            problemId: number;
            source: string;
            language: string;
            tests: { passed: boolean; points: number }[];
          }
    ) => {
      setSubmissionLoading(false);

      if (!isAnon) {
        await context.problem.getSubmissions.invalidate({
          problemId: problemId,
        });
      } else {
        // console.log(data);

        context.problem.getSubmissions.setData({ problemId: problemId }, [
          data as Submission & {
            user: { id: string; name: string | null };
            problem: { id: number; title: string };
            tests: SubmissionTest[];
          },
        ]);
      }
    },
  });

  return (
    <div className="h-full">
      <UIPanel
        pages={[]}
        leading={
          <div className="flex flex-row gap-3">
            <Select
              defaultValue={lang}
              onValueChange={(newValue: SetStateAction<string>) => {
                setLang(newValue.toString());
                setSettings({
                  fontFamily: settings.fontFamily,
                  fontSize: settings.fontSize,
                  theme: settings.theme,
                  vimMode: settings.vimMode,

                  lang: newValue.toString(),
                  initialCode: settings.initialCode,
                });
              }}
            >
              <SelectTrigger
                className="min-w-[8rem] max-w-[180px]"
                aria-label="Choose a language"
              >
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {ojSupportedLanguages.map((supLang) => (
                  <SelectItem value={supLang.name} key={supLang.name}>
                    {supLang.fancyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        controls={
          <div className="flex flex-row gap-3">
            <Button
              variant={"outline"}
              onClick={() => {
                sendSubmission.mutate({
                  language: lang,
                  source: code,
                  problemId: problemId,
                  isAnon: isAnon,
                });
                toastSuccess("Submission sent!");
              }}
            >
              Submit
            </Button>
            <Button
              variant={"outline"}
              onClick={async () => {
                toastSuccess("Custom tests are running!");
                setCustomTestResults([{ input: "", output: "loading" }]);

                const res = await testCode(
                  code,
                  lang,
                  customTests.map((test) => {
                    return {
                      input: test,
                      output: "",
                      points: 0,
                    };
                  })
                );
                if (res != undefined) {
                  setCustomTestResults(res);
                }
              }}
            >
              Custom tests
            </Button>
            <EditorSettings
              callback={(args) => {
                setSettings({
                  fontFamily: args.fontFamily,
                  fontSize: args.fontSize,
                  theme: args.theme,
                  vimMode: args.vimMode,

                  lang: lang,
                  initialCode: settings.initialCode,
                });
              }}
            />
          </div>
        }
      >
        <CodeEditor
          settings={settings}
          onCodeChange={(newCode) => setCode(newCode)}
        />
      </UIPanel>
    </div>
  );
};

export default Editor;
