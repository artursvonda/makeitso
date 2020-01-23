import chalk from 'chalk';

const infoText = chalk;
const logText = chalk;
const errorText = chalk.bgRed.white;

type Input = string | { toString(): string };

export const info = (text: TemplateStringsArray | Input, ...args: Input[]) => {
    console.log(infoText(text as string, ...(args as string[])));
};

export const log = (text: TemplateStringsArray | Input, ...args: Input[]) => {
    console.log(logText(text as string, ...(args as string[])));
};

export const error = (text: TemplateStringsArray | Input, ...args: Input[]) => {
    console.error(errorText('!Error!'));
    console.error(logText(text as string, ...(args as string[])));
};
