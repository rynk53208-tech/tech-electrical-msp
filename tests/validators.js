#!/usr/bin/env node

/**
 * validators.js - Tool validation functions
 * 
 * Provides validators for HTML, JavaScript, and Python files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Validators {
  /**
   * Validate HTML file
   * - Check file exists and is readable
   * - Validate basic HTML syntax (opening/closing tags)
   * - Check for required elements
   */
  static validateHTML(filePath) {
    const results = {
      file: filePath,
      passed: true,
      errors: [],
      warnings: [],
      checks: {},
    };

    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        results.passed = false;
        results.errors.push(`File not found: ${filePath}`);
        return results;
      }

      // Check readability
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
      } catch {
        results.passed = false;
        results.errors.push(`File not readable: ${filePath}`);
        return results;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      results.checks.fileSize = content.length;
      results.checks.lines = content.split('\n').length;

      // Check for DOCTYPE
      if (!/<!DOCTYPE\s+html/i.test(content)) {
        results.warnings.push('Missing DOCTYPE declaration');
        results.checks.hasDoctype = false;
      } else {
        results.checks.hasDoctype = true;
      }

      // Check for html, head, body tags
      const hasHtmlTag = /<html[\s>]/i.test(content);
      const hasHeadTag = /<head[\s>]/i.test(content);
      const hasBodyTag = /<body[\s>]/i.test(content);

      if (!hasHtmlTag) {
        results.errors.push('Missing <html> tag');
        results.passed = false;
      }
      if (!hasHeadTag) {
        results.warnings.push('Missing <head> tag');
      }
      if (!hasBodyTag) {
        results.warnings.push('Missing <body> tag');
      }

      results.checks.hasHtmlTag = hasHtmlTag;
      results.checks.hasHeadTag = hasHeadTag;
      results.checks.hasBodyTag = hasBodyTag;

      // Check for title tag
      if (!/<title[\s>]/i.test(content)) {
        results.warnings.push('Missing <title> tag');
        results.checks.hasTitle = false;
      } else {
        results.checks.hasTitle = true;
      }

      // Check for unclosed tags (basic heuristic)
      const openCount = (content.match(/<[^/][^>]*>/g) || []).length;
      const closeCount = (content.match(/<\/[^>]+>/g) || []).length;
      results.checks.openTags = openCount;
      results.checks.closeTags = closeCount;

      if (Math.abs(openCount - closeCount) > 10) {
        results.warnings.push(`Tag mismatch detected: ${openCount} opening, ${closeCount} closing`);
      }

      // Check for inline scripts (not an error, but a warning)
      if (/<script[^>]*>/i.test(content)) {
        results.checks.hasScripts = true;
      }

      // Check for console errors (search for obvious errors in script tags)
      if (/console\.error|throw new Error|console\.log\s*\(\s*["'](error|ERR|ERROR)/i.test(content)) {
        results.warnings.push('Potential error logging found in scripts');
      }

      return results;
    } catch (err) {
      results.passed = false;
      results.errors.push(`Validation error: ${err.message}`);
      return results;
    }
  }

  /**
   * Validate JavaScript file
   * - Check file exists
   * - Validate syntax using Node
   */
  static validateJavaScript(filePath) {
    const results = {
      file: filePath,
      passed: true,
      errors: [],
      warnings: [],
      checks: {},
    };

    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        results.passed = false;
        results.errors.push(`File not found: ${filePath}`);
        return results;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      results.checks.fileSize = content.length;
      results.checks.lines = content.split('\n').length;

      // Try to parse as JavaScript
      try {
        new Function(content);
        results.checks.syntaxValid = true;
      } catch (syntaxErr) {
        results.passed = false;
        results.errors.push(`Syntax error: ${syntaxErr.message}`);
        results.checks.syntaxValid = false;
        return results;
      }

      // Check for common issues
      if (/console\.error|console\.warn|throw new Error/.test(content)) {
        results.checks.hasErrorHandling = true;
      }

      // Check for require statements
      const requireCount = (content.match(/require\s*\(/g) || []).length;
      results.checks.requireCount = requireCount;

      // Check for exports
      if (/module\.exports|exports\s*=/.test(content)) {
        results.checks.hasExports = true;
      }

      return results;
    } catch (err) {
      results.passed = false;
      results.errors.push(`Validation error: ${err.message}`);
      return results;
    }
  }

  /**
   * Validate Python file
   * - Check file exists
   * - Validate syntax using python -m py_compile
   * - Check imports
   */
  static validatePython(filePath) {
    const results = {
      file: filePath,
      passed: true,
      errors: [],
      warnings: [],
      checks: {},
    };

    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        results.passed = false;
        results.errors.push(`File not found: ${filePath}`);
        return results;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      results.checks.fileSize = content.length;
      results.checks.lines = content.split('\n').length;

      // Check syntax using Python
      try {
        execSync(`python3 -m py_compile "${filePath}" 2>&1`, { stdio: 'pipe' });
        results.checks.syntaxValid = true;
      } catch (err) {
        results.passed = false;
        results.errors.push(`Python syntax error: ${err.message}`);
        results.checks.syntaxValid = false;
        return results;
      }

      // Check for shebang
      if (content.startsWith('#!/')) {
        results.checks.hasShebang = true;
      }

      // Check imports
      const imports = content.match(/^(?:from|import)\s+.+/gm) || [];
      results.checks.importCount = imports.length;
      results.checks.imports = imports.slice(0, 10); // Show first 10

      // Check for common stdlib imports
      const hasOs = /import\s+os|from\s+os\s+import/.test(content);
      const hasPathlib = /import\s+pathlib|from\s+pathlib\s+import/.test(content);
      results.checks.hasOs = hasOs;
      results.checks.hasPathlib = hasPathlib;

      // Check for main guard
      if (/if\s+__name__\s*==\s*['"']__main__['"]/.test(content)) {
        results.checks.hasMainGuard = true;
      }

      return results;
    } catch (err) {
      results.passed = false;
      results.errors.push(`Validation error: ${err.message}`);
      return results;
    }
  }

  /**
   * Auto-detect file type and validate
   */
  static validate(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.html') {
      return this.validateHTML(filePath);
    } else if (ext === '.js') {
      return this.validateJavaScript(filePath);
    } else if (ext === '.py') {
      return this.validatePython(filePath);
    } else {
      return {
        file: filePath,
        passed: false,
        errors: [`Unsupported file type: ${ext}`],
        warnings: [],
        checks: {},
      };
    }
  }

  /**
   * Generate a human-readable report
   */
  static reportToString(result) {
    const lines = [];
    lines.push(`\n📄 ${result.file}`);
    lines.push(`   Status: ${result.passed ? '✓ PASS' : '✗ FAIL'}`);

    if (result.checks && Object.keys(result.checks).length > 0) {
      lines.push('   Checks:');
      Object.entries(result.checks).forEach(([key, value]) => {
        let val = value;
        if (Array.isArray(val)) {
          val = val.length > 0 ? `[${val.length} items]` : '[]';
        }
        lines.push(`     ${key}: ${val}`);
      });
    }

    if (result.errors && result.errors.length > 0) {
      lines.push('   ❌ Errors:');
      result.errors.forEach(err => lines.push(`     - ${err}`));
    }

    if (result.warnings && result.warnings.length > 0) {
      lines.push('   ⚠️  Warnings:');
      result.warnings.forEach(warn => lines.push(`     - ${warn}`));
    }

    return lines.join('\n');
  }
}

module.exports = Validators;
