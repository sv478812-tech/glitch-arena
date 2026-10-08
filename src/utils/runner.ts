import { TestCase, TestResult, ExecutionOutput, Language } from '@/types';

// Utility for deep comparison
function areEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!areEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!areEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

// Format values for terminal printing
function formatValue(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

/**
 * Execute JavaScript Code against test cases client-side
 */
export function executeJavaScript(
  code: string,
  functionName: string,
  testCases: TestCase[]
): ExecutionOutput {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const results: TestResult[] = [];
  const startTime = performance.now();

  try {
    // Intercept console inside function
    const customConsole = {
      log: (...args: any[]) => {
        stdout.push(args.map(formatValue).join(' '));
      },
      warn: (...args: any[]) => {
        stdout.push(`[WARN] ` + args.map(formatValue).join(' '));
      },
      error: (...args: any[]) => {
        stderr.push(`[ERROR] ` + args.map(formatValue).join(' '));
      },
    };

    // Prepare sandbox
    // Return the declared function by name or return the last defined function
    const wrappedCode = `
      "use strict";
      const console = customConsole;
      ${code};
      if (typeof ${functionName} === 'function') {
        return ${functionName};
      }
      // Fallback: search for any function
      throw new ReferenceError("Function '${functionName}' is not defined. Ensure you defined '${functionName}'.");
    `;

    // Create sandbox runner
    const sandboxFactory = new Function('customConsole', wrappedCode);
    const targetFn = sandboxFactory(customConsole);

    // Run test cases
    for (const tc of testCases) {
      const tcStart = performance.now();
      try {
        // Deep clone input args to prevent mutations between tests
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const actual = targetFn(...clonedArgs);
        const tcDuration = Number((performance.now() - tcStart).toFixed(2));
        const passed = areEqual(actual, tc.expected);

        results.push({
          testId: tc.id,
          inputDescription: tc.inputDescription,
          passed,
          actual,
          expected: tc.expected,
          executionTimeMs: tcDuration,
        });
      } catch (err: any) {
        const tcDuration = Number((performance.now() - tcStart).toFixed(2));
        results.push({
          testId: tc.id,
          inputDescription: tc.inputDescription,
          passed: false,
          expected: tc.expected,
          error: `${err.name || 'Error'}: ${err.message}`,
          executionTimeMs: tcDuration,
        });
        stderr.push(`Test [${tc.inputDescription}] failed with error: ${err.message}`);
      }
    }

    const totalTime = Number((performance.now() - startTime).toFixed(2));
    const allPassed = results.length > 0 && results.every((r) => r.passed);

    return {
      stdout,
      stderr,
      results,
      allPassed,
      executionTimeMs: totalTime,
    };
  } catch (err: any) {
    const totalTime = Number((performance.now() - startTime).toFixed(2));
    stderr.push(`${err.name || 'Syntax/Runtime Error'}: ${err.message}`);
    return {
      stdout,
      stderr,
      results: [],
      allPassed: false,
      executionTimeMs: totalTime,
      syntaxError: `${err.name || 'Error'}: ${err.message}`,
    };
  }
}

/**
 * Client-Side Python Sandbox Runner
 * Transpiles and executes Python function definitions with authentic Python error semantics
 * (IndexError, TypeError on string/int concat, dict key error, list mutations)
 */
export function executePython(
  code: string,
  functionName: string,
  testCases: TestCase[]
): ExecutionOutput {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const results: TestResult[] = [];
  const startTime = performance.now();

  try {
    // Check basic Python syntax
    const lines = code.split('\n');
    let hasDef = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith(`def ${functionName}(`)) {
        hasDef = true;
      }
    }

    if (!hasDef) {
      throw new Error(`NameError: name '${functionName}' is not defined. Did you define 'def ${functionName}(...)'?`);
    }

    // Python-to-JS Sandbox Transpilation Engine
    // Transforms common Python idioms into JS while injecting Python runtime safety checks
    let jsTranspiled = '';
    const indentStack: number[] = [0];

    lines.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        return; // skip empty or comment
      }

      const indent = rawLine.search(/\S/);

      // Handle block dedent
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsTranspiled += '\n}\n';
      }

      // Convert print(...) to stdout.push
      let line = trimmed
        .replace(/print\((.*)\)/g, 'customPrint($1)')
        .replace(/\bNone\b/g, 'null')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!');

      // Transpile def fn(args):
      if (line.startsWith('def ')) {
        const match = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):/);
        if (match) {
          const fnName = match[1];
          const args = match[2];
          jsTranspiled += `function ${fnName}(${args}) {\n`;
          indentStack.push(indent + 4);
          return;
        }
      }

      // Transpile for x in range(...):
      if (line.startsWith('for ') && line.includes(' in range(')) {
        const match = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/);
        if (match) {
          const varName = match[1];
          const rangeArgs = match[2].split(',').map((s) => s.trim());
          let start = '0';
          let stop = '0';
          let step = '1';

          if (rangeArgs.length === 1) {
            stop = rangeArgs[0];
          } else if (rangeArgs.length === 2) {
            start = rangeArgs[0];
            stop = rangeArgs[1];
          } else if (rangeArgs.length === 3) {
            start = rangeArgs[0];
            stop = rangeArgs[1];
            step = rangeArgs[2];
          }

          // In Python, range is integers.
          jsTranspiled += `for (let ${varName} = ${start}; ${varName} < ${stop}; ${varName} += ${step}) {\n`;
          indentStack.push(indent + 4);
          return;
        }
      }

      // Transpile for item in list:
      if (line.startsWith('for ') && line.endsWith(':')) {
        const match = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):$/);
        if (match) {
          const itemVar = match[1];
          const listExpr = match[2];
          jsTranspiled += `for (const ${itemVar} of ${listExpr}) {\n`;
          indentStack.push(indent + 4);
          return;
        }
      }

      // Transpile if / elif / else:
      if (line.startsWith('if ') && line.endsWith(':')) {
        const cond = line.slice(3, -1);
        jsTranspiled += `if (${cond}) {\n`;
        indentStack.push(indent + 4);
        return;
      }
      if (line.startsWith('elif ') && line.endsWith(':')) {
        const cond = line.slice(5, -1);
        jsTranspiled += `} else if (${cond}) {\n`;
        return;
      }
      if (line === 'else:') {
        jsTranspiled += `} else {\n`;
        return;
      }

      // Detect Python string + int concatenation bug to throw authentic TypeError!
      // Example: "Score: " + user["score"] where score is int or total += item['price'] + item['qty']
      // We wrap additions with a type check helper
      line = line.replace(/([a-zA-Z0-9_\[\]'"]+)\s*\+\s*([a-zA-Z0-9_\[\]'"]+)/g, (match, left, right) => {
        return `pyAdd(${left}, ${right}, ${lineNum})`;
      });

      // Wrap array access arr[i] with Python bounds check
      line = line.replace(/([a-zA-Z0-9_]+)\[([a-zA-Z0-9_+\- ]+)\]/g, (match, arrName, idxExpr) => {
        if (arrName === 'console' || arrName === 'customPrint') return match;
        return `pyGetItem(${arrName}, ${idxExpr}, ${lineNum})`;
      });

      // Handle len(...)
      line = line.replace(/len\((.*?)\)/g, '($1 ? ($1.length !== undefined ? $1.length : Object.keys($1).length) : 0)');

      // Handle .append(...)
      line = line.replace(/\.append\((.*?)\)/g, '.push($1)');

      // Handle variable assignment without let
      if (!line.startsWith('return') && !line.startsWith('for') && !line.startsWith('if') && line.includes('=')) {
        if (!line.includes('==') && !line.includes('+=') && !line.includes('-=') && !line.includes('*=')) {
          const firstWord = line.split('=')[0].trim();
          if (/^[a-zA-Z0-9_]+$/.test(firstWord)) {
            line = `var ${line}`;
          }
        }
      }

      jsTranspiled += `${line};\n`;
    });

    // Close remaining blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsTranspiled += '\n}\n';
    }

    // Python Runtime Environment Helpers
    const sandboxHelpers = `
      function customPrint(...args) {
        customStdout.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      }
      function pyGetItem(target, index, lineNum) {
        if (target == null) {
          throw new Error("TypeError: 'NoneType' object is not subscriptable (Line " + lineNum + ")");
        }
        if (Array.isArray(target)) {
          if (typeof index !== 'number' || index < 0 || index >= target.length) {
            throw new Error("IndexError: list index out of range at line " + lineNum + " (index " + index + ", size " + target.length + ")");
          }
          return target[index];
        }
        if (typeof target === 'object') {
          if (!(index in target)) {
            throw new Error("KeyError: '" + index + "' at line " + lineNum);
          }
          return target[index];
        }
        return target[index];
      }
      function pyAdd(a, b, lineNum) {
        if (typeof a === 'string' && typeof b === 'number') {
          throw new Error("TypeError: can only concatenate str (not 'int') to str at line " + lineNum);
        }
        if (typeof a === 'number' && typeof b === 'string') {
          throw new Error("TypeError: unsupported operand type(s) for +: 'int' and 'str' at line " + lineNum);
        }
        return a + b;
      }
      ${jsTranspiled}
      return ${functionName};
    `;

    const runner = new Function('customStdout', sandboxHelpers);
    const targetFn = runner(stdout);

    // Run test cases
    for (const tc of testCases) {
      const tcStart = performance.now();
      try {
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));
        const actual = targetFn(...clonedArgs);
        const tcDuration = Number((performance.now() - tcStart).toFixed(2));
        const passed = areEqual(actual, tc.expected);

        results.push({
          testId: tc.id,
          inputDescription: tc.inputDescription,
          passed,
          actual,
          expected: tc.expected,
          executionTimeMs: tcDuration,
        });
      } catch (err: any) {
        const tcDuration = Number((performance.now() - tcStart).toFixed(2));
        results.push({
          testId: tc.id,
          inputDescription: tc.inputDescription,
          passed: false,
          expected: tc.expected,
          error: err.message,
          executionTimeMs: tcDuration,
        });
        stderr.push(`Test [${tc.inputDescription}] failed: ${err.message}`);
      }
    }

    const totalTime = Number((performance.now() - startTime).toFixed(2));
    const allPassed = results.length > 0 && results.every((r) => r.passed);

    return {
      stdout,
      stderr,
      results,
      allPassed,
      executionTimeMs: totalTime,
    };
  } catch (err: any) {
    const totalTime = Number((performance.now() - startTime).toFixed(2));
    stderr.push(`${err.message}`);
    return {
      stdout,
      stderr,
      results: [],
      allPassed: false,
      executionTimeMs: totalTime,
      syntaxError: err.message,
    };
  }
}

/**
 * Universal Unified Runner
 */
export function runCodeSuite(
  code: string,
  language: Language,
  functionName: string,
  testCases: TestCase[]
): ExecutionOutput {
  if (language === 'python') {
    return executePython(code, functionName, testCases);
  }
  return executeJavaScript(code, functionName, testCases);
}
