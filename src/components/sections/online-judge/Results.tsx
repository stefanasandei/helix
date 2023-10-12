/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useAtomValue } from "jotai";
import { yourTestsResultsAtom } from "~/utils/atoms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import { LoadingSpinner } from "~/components/ui/Loading";

export const Results = () => {
  const yourTestsResults = useAtomValue(yourTestsResultsAtom);

  return (
    <div className="h-full">
      {yourTestsResults.length == 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex w-fit flex-col gap-3">
            <p>No custom tests ran yet.</p>
          </div>
        </div>
      ) : yourTestsResults.length == 1 &&
        yourTestsResults[0]?.output == "loading" ? (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size={40} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Input</TableHead>
              <TableHead>Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yourTestsResults.map(
              (test: { input: string; output: string }, index) => (
                <TableRow key={test.input}>
                  <TableCell className="align-top">{index}</TableCell>
                  <TableCell className="whitespace-pre-wrap align-top font-mono">
                    {test.input}
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap align-top font-mono">
                    {test.output}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
