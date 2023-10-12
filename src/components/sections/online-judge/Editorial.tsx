import { useEffect } from "react";

import "highlight.js/styles/stackoverflow-dark.css";
import hljs from "highlight.js";

export const Editorial = ({ name }: { name: string }) => {
  useEffect(() => hljs.highlightAll(), []);

  if (name == "LoadingBar") {
    // TODO: will fix it, I'm tired rn
    return (
      <pre>
        <code className="language-cpp">{specificCode}</code>
      </pre>
    );
  }

  return <p>No editorial published yet for this problem.</p>;
};

const specificCode = `#include <cmath>
#include <iomanip>
#include <iostream>

using namespace std;

int n, blocks, len;
float unit, progress, ratio;

int main() {
  cin >> n;

  len = 20;

  unit = 100.0f / n;
  ratio = 100.0f / len;

  for (int i = 0; i <= n; i++) {
    blocks = floor(progress / ratio);

    cout << "[" << setfill('#') << setw(blocks + 1) << '#';
    cout << setfill(' ') << setw(len - blocks + 1) << ']';

    cout << " " << setprecision(2) << fixed << progress << "% \\n";

    progress += unit;
  }
  return 0;
}
`;
