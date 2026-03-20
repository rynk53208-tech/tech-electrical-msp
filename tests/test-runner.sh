#!/bin/bash

##############################################################################
# test-runner.sh - Comprehensive Test Framework (Shell Version)
# 
# Runs validation on HTML, JS, and Python tools.
# Outputs results to console AND log file.
# Usage: ./test-runner.sh [tool-name-or-path]
##############################################################################

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="${WORKSPACE_ROOT}/tools"
LOGS_DIR="${WORKSPACE_ROOT}/logs"

# Ensure log directories exist
mkdir -p "${LOGS_DIR}"

TODAY=$(date +%Y-%m-%d)
LOG_DIR="${LOGS_DIR}/${TODAY}"
mkdir -p "${LOG_DIR}"

GENERAL_LOG="${LOG_DIR}/${TODAY}-general.log"
ERROR_LOG="${LOG_DIR}/${TODAY}-error.log"
TEST_REPORT="${LOG_DIR}/test-report.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0
WARNINGS=0

##############################################################################
# LOGGING FUNCTIONS
##############################################################################

log_entry() {
  local level="$1"
  local action="$2"
  local status="$3"
  local details="$4"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
  local json="{\"timestamp\":\"${timestamp}\",\"toolName\":\"test-runner\",\"level\":\"${level}\",\"action\":\"${action}\",\"status\":\"${status}\",\"details\":${details:-'{}'}, \"pid\":$$}"
  
  # Write to appropriate log file
  if [ "$level" = "error" ]; then
    echo "$json" >> "$ERROR_LOG"
  else
    echo "$json" >> "$GENERAL_LOG"
  fi
}

console_log() {
  local level="$1"
  local message="$2"
  
  case "$level" in
    error)   echo -e "${RED}❌ ERROR${NC} $message" ;;
    warn)    echo -e "${YELLOW}⚠️  WARN${NC}  $message" ;;
    info)    echo -e "${BLUE}ℹ️  INFO${NC}  $message" ;;
    success) echo -e "${GREEN}✓ OK${NC}     $message" ;;
    *)       echo "$message" ;;
  esac
}

##############################################################################
# VALIDATION FUNCTIONS
##############################################################################

validate_html() {
  local file="$1"
  local basename=$(basename "$file")
  
  echo ""
  echo "📄 Testing HTML: $basename"
  
  if [ ! -f "$file" ]; then
    console_log error "File not found: $file"
    log_entry "error" "validate-html" "error" "{\"file\":\"$basename\",\"error\":\"File not found\"}"
    FAILED=$((FAILED + 1))
    return 1
  fi

  local errors=0
  local warnings=0

  # Check for DOCTYPE
  if ! grep -qi "<!DOCTYPE html" "$file"; then
    console_log warn "Missing DOCTYPE declaration"
    warnings=$((warnings + 1))
  fi

  # Check for required tags
  if ! grep -qi "<html" "$file"; then
    console_log error "Missing <html> tag"
    errors=$((errors + 1))
  fi

  if ! grep -qi "<head" "$file"; then
    console_log warn "Missing <head> tag"
    warnings=$((warnings + 1))
  fi

  if ! grep -qi "<body" "$file"; then
    console_log warn "Missing <body> tag"
    warnings=$((warnings + 1))
  fi

  if ! grep -qi "<title" "$file"; then
    console_log warn "Missing <title> tag"
    warnings=$((warnings + 1))
  fi

  if [ $errors -gt 0 ]; then
    log_entry "error" "validate-html" "error" "{\"file\":\"$basename\",\"errors\":$errors,\"warnings\":$warnings}"
    FAILED=$((FAILED + 1))
    WARNINGS=$((WARNINGS + warnings))
    return 1
  else
    console_log success "$basename"
    log_entry "info" "validate-html" "success" "{\"file\":\"$basename\",\"warnings\":$warnings}"
    PASSED=$((PASSED + 1))
    WARNINGS=$((WARNINGS + warnings))
    return 0
  fi
}

validate_javascript() {
  local file="$1"
  local basename=$(basename "$file")
  
  echo ""
  echo "📄 Testing JavaScript: $basename"
  
  if [ ! -f "$file" ]; then
    console_log error "File not found: $file"
    log_entry "error" "validate-js" "error" "{\"file\":\"$basename\",\"error\":\"File not found\"}"
    FAILED=$((FAILED + 1))
    return 1
  fi

  # Use Node to check syntax
  if ! node -c "$file" 2>/dev/null; then
    console_log error "Syntax error in $basename"
    log_entry "error" "validate-js" "error" "{\"file\":\"$basename\",\"error\":\"Syntax error\"}"
    FAILED=$((FAILED + 1))
    return 1
  else
    console_log success "$basename"
    log_entry "info" "validate-js" "success" "{\"file\":\"$basename\"}"
    PASSED=$((PASSED + 1))
    return 0
  fi
}

validate_python() {
  local file="$1"
  local basename=$(basename "$file")
  
  echo ""
  echo "📄 Testing Python: $basename"
  
  if [ ! -f "$file" ]; then
    console_log error "File not found: $file"
    log_entry "error" "validate-python" "error" "{\"file\":\"$basename\",\"error\":\"File not found\"}"
    FAILED=$((FAILED + 1))
    return 1
  fi

  # Check Python syntax
  if ! python3 -m py_compile "$file" 2>/dev/null; then
    console_log error "Syntax error in $basename"
    log_entry "error" "validate-python" "error" "{\"file\":\"$basename\",\"error\":\"Syntax error\"}"
    FAILED=$((FAILED + 1))
    return 1
  else
    console_log success "$basename"
    log_entry "info" "validate-python" "success" "{\"file\":\"$basename\"}"
    PASSED=$((PASSED + 1))
    return 0
  fi
}

##############################################################################
# MAIN LOGIC
##############################################################################

discover_and_test_all() {
  echo "🔍 Discovering tools in $TOOLS_DIR..."
  
  if [ ! -d "$TOOLS_DIR" ]; then
    console_log error "Tools directory not found: $TOOLS_DIR"
    return 1
  fi

  # Find all HTML files
  for file in "$TOOLS_DIR"/*.html; do
    if [ -f "$file" ]; then
      TOTAL=$((TOTAL + 1))
      validate_html "$file"
    fi
  done

  # Find all JavaScript files
  for file in "$TOOLS_DIR"/*.js; do
    if [ -f "$file" ]; then
      TOTAL=$((TOTAL + 1))
      validate_javascript "$file"
    fi
  done

  # Find all Python files
  for file in "$TOOLS_DIR"/*.py; do
    if [ -f "$file" ]; then
      TOTAL=$((TOTAL + 1))
      validate_python "$file"
    fi
  done
}

test_specific() {
  local tool_ref="$1"
  local file_path=""

  # Try to resolve the tool reference
  if [ "${tool_ref#/}" != "$tool_ref" ]; then
    # Absolute path
    file_path="$tool_ref"
  elif [ "${tool_ref#./}" != "$tool_ref" ] || [ "${tool_ref#../}" != "$tool_ref" ]; then
    # Relative path
    file_path="$(cd "$(dirname "$tool_ref")" && pwd)/$(basename "$tool_ref")"
  else
    # Try to find in tools directory
    if [ -f "${TOOLS_DIR}/${tool_ref}" ]; then
      file_path="${TOOLS_DIR}/${tool_ref}"
    else
      # Try with common extensions
      for ext in .html .js .py; do
        if [ -f "${TOOLS_DIR}/${tool_ref}${ext}" ]; then
          file_path="${TOOLS_DIR}/${tool_ref}${ext}"
          break
        fi
      done
    fi
  fi

  if [ ! -f "$file_path" ]; then
    console_log error "Tool not found: $tool_ref"
    return 1
  fi

  TOTAL=$((TOTAL + 1))

  case "$file_path" in
    *.html) validate_html "$file_path" ;;
    *.js)   validate_javascript "$file_path" ;;
    *.py)   validate_python "$file_path" ;;
    *)      console_log error "Unsupported file type: $file_path"; FAILED=$((FAILED + 1)) ;;
  esac
}

generate_report() {
  {
    echo ""
    echo "========================================================================"
    echo "                        TEST RUNNER REPORT"
    echo "========================================================================"
    echo ""
    echo "📊 SUMMARY"
    echo "   Total Tests: $TOTAL"
    if [ $TOTAL -gt 0 ]; then
      PCT=$((PASSED * 100 / TOTAL))
    else
      PCT=0
    fi
    echo "   ✓ Passed:    $PASSED ($PCT%)"
    echo "   ✗ Failed:    $FAILED"
    echo "   ⚠️  Warnings: $WARNINGS"
    echo ""
    echo "========================================================================"
    if [ $FAILED -eq 0 ]; then
      echo "✓ ALL TESTS PASSED"
    else
      echo "✗ $FAILED TEST(S) FAILED - See details above"
    fi
    echo "========================================================================"
    echo ""
    echo "📝 Logs:"
    echo "   General: $GENERAL_LOG"
    echo "   Errors:  $ERROR_LOG"
    echo ""
  } | tee -a "$TEST_REPORT"
}

##############################################################################
# ENTRY POINT
##############################################################################

echo "🧪 Test Runner Starting..."
log_entry "info" "test-run-start" "info" "{\"mode\":\"cli\"}"

if [ $# -gt 0 ]; then
  # Test specific tool(s)
  for arg in "$@"; do
    test_specific "$arg"
  done
else
  # Test all tools
  discover_and_test_all
fi

echo ""
generate_report

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
  log_entry "error" "test-run-complete" "error" "{\"total\":$TOTAL,\"passed\":$PASSED,\"failed\":$FAILED}"
  exit 1
else
  log_entry "info" "test-run-complete" "success" "{\"total\":$TOTAL,\"passed\":$PASSED,\"failed\":$FAILED}"
  exit 0
fi
