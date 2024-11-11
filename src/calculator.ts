import { readFileSync, writeFileSync } from "node:fs";

export class Calculator {
    sum(...args: number[]): number {
        if(args.length === 0) {
            throw new Error('You must pass at least one number for summation.');
        }

        args.forEach((arg, index) => {
            if (typeof arg !== 'number' || isNaN(arg)) {
                throw new TypeError(`The argument at index ${index} is not a valid number`);
            }
        });

        return args.reduce((acc, curr) => acc + curr, 0);
    }

    subtract(n1: number, n2: number): number {
        if (typeof n1 !== 'number' || isNaN(n1)) {
            throw new TypeError('The first argument is not a valid number');
        }
        if (typeof n2 !== 'number' || isNaN(n2)) {
            throw new TypeError('The second argument is not a valid number');
        }

        return n1 - n2;
    }

    multiply(...args: number[]): number {
        if(args.length === 0) {
            throw new Error('You must pass at least one number to multiply.');
        }

        args.forEach((arg, index) => {
            if (typeof arg !== 'number' || isNaN(arg)) {
                throw new TypeError(`The argument at index ${index} is not a valid number`);
            }
        });

        return args.reduce((acc, curr) => acc * curr, 1);
    }

    divide(n1: number, n2: number): number {
        const result = n1 / n2;
        if (typeof n1 !== 'number' || isNaN(n1)) {
            throw new TypeError('The first argument is not a valid number');
        }
        if (typeof n2 !== 'number' || isNaN(n2)) {
            throw new TypeError('The second argument is not a valid number');
        }
        if (result === Number.POSITIVE_INFINITY || result === Number.NEGATIVE_INFINITY) {
            throw new Error('Zero devision is prohibited');
        }
        return result;
    }

    sumFromFile(filePath: string): number {
        if (typeof filePath !== 'string') {
            throw new TypeError('File path must be a string');
        }
        try {
            const fileContent = readFileSync(filePath, 'utf-8');
            const values = fileContent
            .split(/\s+/)
            .map((n) => parseFloat(n))
            .filter((n) => !isNaN(n));

            if (values.length === 0) {
                throw new Error('No valid numbers found in file');
            }
            return this.sum(...values);
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`);
        }
    }

    static writeToFile(filePath: string, data: any): void {
        if (typeof filePath !== 'string') {
            throw new TypeError('File path must be a string');
        }

        if (data === undefined || data === null) {
            throw new Error('The data to be recorded must not be empty.');
        }

        const content = `result: ${data}`;
        try {
            writeFileSync(filePath, content, 'utf-8');
        } catch (error) {
            throw new Error(`Error writing to file: ${error.message}`);
        }
    }
}