import { baseStyle, tailwindConfigScript } from "./tailwindBits.js";

const style = document.createElement("style");
style.textContent = baseStyle;
document.head.appendChild(style);

const run = () => {
  // eslint-disable-next-line no-eval
  eval(tailwindConfigScript);
};

if (window.tailwind) run();
else {
  const t = setInterval(() => {
    if (window.tailwind) {
      clearInterval(t);
      run();
    }
  }, 20);
}
