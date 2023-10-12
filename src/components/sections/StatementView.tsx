import { type Problem } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

export type ProblemMetadata = Problem & {
  author: {
    id: string;
    name: string | null;
  };
};

export const StatementView = (props: { problem: ProblemMetadata }) => {
  return (
    <div className="min-h-full overflow-y-scroll">
      <div className="flex flex-row items-end gap-2">
        <h1 className="text-2xl">{props.problem.title}</h1>
        <h1 className="hidden text-xl md:inline">
          by {props.problem.author.name}
        </h1>
      </div>
      <div className="mb-3 flex w-fit flex-row items-center gap-1 bg-secondary-600">
        <p className="hidden bg-secondary-800 pr-2 md:inline">
          {props.problem.difficulty}
        </p>
        <p className="hidden bg-secondary-800 px-2 md:inline">
          {props.problem.timeLimitMs} ms
        </p>
        <p className="hidden bg-secondary-800 px-2 md:inline">
          {props.problem.memLimitBytes} bytes
        </p>
        <p className="hidden bg-secondary-800 pl-2 md:inline">
          solved by {props.problem.solvedBy} users
        </p>
      </div>
      <p>{props.problem.statement}</p>
      <div className="my-2">
        <p className="text-2xl">Input</p>
        <p>{props.problem.inputFormat}</p>
      </div>
      <div className="my-2">
        <p className="text-2xl">Output</p>
        <p>{props.problem.outputFormat}</p>
      </div>
      <div className="my-2">
        <p className="text-2xl">Examples</p>
        {props.problem.inputs.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.problem.inputs.map((input, index) => (
                <TableRow key={input} className="text-start">
                  <TableCell className="whitespace-pre align-top font-mono">
                    {input}
                  </TableCell>
                  <TableCell className="whitespace-pre align-top font-mono">
                    {props.problem.outputs[index]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="my-2">
        <p className="text-2xl">Notes</p>
        <p>{props.problem.notes}</p>
      </div>
      <div className="mb-6 mt-4 flex flex-row gap-3">
        {props.problem.tags.map((tag) => (
          <p
            key={tag}
            className="cursor-pointer rounded-md bg-secondary-700 px-4 py-1 hover:bg-secondary-600"
          >
            {tag}
          </p>
        ))}
      </div>
    </div>
  );
};
