import chalk from 'chalk';

const infoText = chalk;

type Input = string | { toString(): string };

export const info = (text: TemplateStringsArray | Input, ...args: Input[]) => {
    console.log(infoText(text as string, ...(args as string[])));
};
