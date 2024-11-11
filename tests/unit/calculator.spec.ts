import { Calculator } from "../../src/calculator";
import { test, expect, describe, beforeEach, vi, MockedFunction } from "vitest";
import { readFileSync, writeFileSync } from 'fs';

vi.mock('fs', () => ({
    writeFileSync: vi.fn(),
    readFileSync: vi.fn()
}));

const mockedReadFileSync = readFileSync as MockedFunction<typeof readFileSync>;
const mockedWriteFileSync = writeFileSync as MockedFunction<typeof writeFileSync>;

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        vi.resetAllMocks();
        calculator = new Calculator;
    });

    describe('method sum', () => {
        test('the sum of an arbitrary number of numbers', () => {
            expect(calculator.sum(1, 3, 5, 10)).toBe(19);
        });

        test('sum of only positive numbers', () => {
            expect(calculator.sum(4, 7, 2)).toBe(13);
        });

        test('sum of only negative numbers', () => {
            expect(calculator.sum(-1, -9, -12, -2)).toBe(-24);
        });

        test('sum of different (positive and negative) numbers', () => {
            expect(calculator.sum(-1, 8, -2, 6)).toBe(11);
        });

        test('error, if arguments are not passed', () => {
            expect(() => calculator.sum()).toThrow('You must pass at least one number for summation.');
        });

        test('TypeError, if argument is not number', () => {
            expect(() => calculator.sum(1, '2' as any, 3)).toThrow(TypeError);
        });
    });

    describe('method subtract', () => {
        test('subtracting one number from another', () => {
            expect(calculator.subtract(15, 8)).toBe(7);
        });

        test('TypeError if argument n1 is not a number', () => {
            expect(() => calculator.subtract('15' as any, 8)).toThrow(new TypeError('The first argument is not a valid number'));
        });

        test('TypeError if argument n2 is not a number', () => {
            expect(() => calculator.subtract(15, '8' as any)).toThrow(new TypeError('The second argument is not a valid number'));
        });

        test('subtracting n2 from n1, when n2 > n1', () => {
            expect(calculator.subtract(8, 15)).toBe(-7);
        });
    });

    describe('method multiply', () => {
        test('multiplication of an arbitrary number of numbers', () => {
            expect(calculator.multiply(2, 5, 10)).toBe(100);
        });

        test('error, if arguments are not passed', () => {
            expect(() => calculator.multiply()).toThrow('You must pass at least one number to multiply.');
        });

        test('TypeError, if argument is not number', () => {
            expect(() => calculator.multiply(2, '5' as any, 10)).toThrow(TypeError);
        });

        test('multiplication when one of the arguments is zero', () => {
            expect(calculator.multiply(2, 5, 0, 10)).toBe(0);
        });

        test('multiplication when all arguments are negative', () => {
            expect(calculator.multiply(-3, -5, -4, -10)).toBe(600);
        });
    });

    describe('method divide', () => {
        test('dividing one number by another', () => {
            expect(calculator.divide(20, 4)).toBe(5);
        });

        test('throw an error if divider is 0 (plus infinity)', () => {
            const risky = () => calculator.divide(20, 0);
            expect(risky).toThrowError('Zero devision is prohibited');
        });

        test('throw an error if divider is 0 (minus infinity)', () => {
            const risky = () => calculator.divide(-20, 0);
            expect(risky).toThrowError('Zero devision is prohibited');
        });

        test('TypeError if argument n1 is not a number', () => {
            expect(() => calculator.divide('20' as any, 4)).toThrow(new TypeError('The first argument is not a valid number'));
        });

        test('TypeError if argument n2 is not a number', () => {
            expect(() => calculator.subtract(20, '4' as any)).toThrow(new TypeError('The second argument is not a valid number'));
        });
    });

    describe('method sumFromFile', () => {
        test('summing numbers from a file', () => {
            const filePath = 'values.txt';
            const fileContent = '1 2 3 4 5';
            mockedReadFileSync.mockReturnValue(fileContent);

            const result = calculator.sumFromFile(filePath);

            expect(result).toBe(15);
            expect(mockedReadFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
        });

        test('throw an error if the file does not contain valid numbers', () => {
            const filePath = 'invalid_values.txt';
            const fileContent = 'a b c d';
            mockedReadFileSync.mockReturnValue(fileContent);

            expect(() => calculator.sumFromFile(filePath)).toThrow('No valid numbers found in file');
        });

        test('throw an error if the file path is not a string', () => {
            const filePath = 123 as any;
            expect(() => calculator.sumFromFile(filePath)).toThrow(new TypeError('File path must be a string'));
        });

        test('throw an error when there is a problem reading the file', () => {
            const filePath = 'nonexistent.txt';
            const errorMessage = 'Error: no such file or directory, open \'nonexistent.txt\'';
            mockedReadFileSync.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            expect(() => calculator.sumFromFile(filePath)).toThrow(`Error reading file: ${errorMessage}`);
        });
    });

    describe('method writeToFile', () => {
        test('write the result to a file', () => {
            const filePath = 'output.txt';
            const data = 58;
            const content = `result: ${data}`;
            mockedWriteFileSync.mockImplementation(() => {});

            Calculator.writeToFile(filePath, data);

            expect(mockedWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
        });

        test('throw an error if there is no data to write', () => {
            const filePath = 'output.txt';
            const data = null;

            expect(() => Calculator.writeToFile(filePath, data)).toThrow('The data to be recorded must not be empty.');
        });

        test('throw an error if the file path is not a string', () => {
            const filePath = 123 as any;
            const data = 24;
            expect(() => Calculator.writeToFile(filePath, data)).toThrow(new TypeError('File path must be a string'));
        });

        test('throw an error when there is a problem reading the file', () => {
            const filePath = 'output.txt';
            const data = 58;
            const content = `result: ${data}`;
            const errorMessage = 'Error: permission denied, open \'output.txt\'';
            mockedWriteFileSync.mockImplementation(() => {
                throw new Error(errorMessage);
            });

            expect(() => Calculator.writeToFile(filePath, data)).toThrow(`Error writing to file: ${errorMessage}`);
        });
    });
})