import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CodeRunnerFile } from "./code";

export const colorThemes = [
  "red",
  "orange",
  "amber",
  "green",
  "teal",
  "blue",
  "indigo",
  "pink",
];
export type ColorTheme = (typeof colorThemes)[number];

export const homepageLayouts = ["informative", "spacious"];
export type HomePageLayouts = (typeof homepageLayouts)[number];

export type YourTestsEvent = {
  tests: {
    input: string;
  }[];
};

export const themeAtom = atomWithStorage<ColorTheme>("colorTheme", "pink");

export const homepageLayoutAtom = atomWithStorage<HomePageLayouts>(
  "homepageLayout",
  "spacious"
);

export const submissionLoadingAtom = atom(false);

export const yourTestsAtom = atom<string[]>([]);
export const yourTestsResultsAtom = atom<{ input: string; output: string }[]>(
  []
);

export const isCodingAtom = atom<boolean>(false);

export const fileTreeAtom = atomWithStorage<CodeRunnerFile[]>("fileTree", []);
