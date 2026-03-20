#!/bin/bash
# Test script for Network Mapper tool

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Network Mapper - System Test                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS=0
FAIL=0

# Test 1: Check HTML file exists
echo "[*] Test 1: Checking HTML frontend..."
if [ -f "$TOOLS_DIR/network-mapper.html" ]; then
    SIZE=$(wc -c < "$TOOLS_DIR/network-mapper.html")
    echo "    ✅ HTML file found ($SIZE bytes)"
    ((PASS++))
else
    echo "    ❌ HTML file not found"
    ((FAIL++))
fi

# Test 2: Check Python backend exists
echo "[*] Test 2: Checking Python backend..."
if [ -f "$TOOLS_DIR/network-scanner.py" ]; then
    echo "    ✅ Python file found"
    ((PASS++))
else
    echo "    ❌ Python file not found"
    ((FAIL++))
fi

# Test 3: Check Python syntax
echo "[*] Test 3: Validating Python syntax..."
if python3 -m py_compile "$TOOLS_DIR/network-scanner.py" 2>/dev/null; then
    echo "    ✅ Python syntax is valid"
    ((PASS++))
else
    echo "    ❌ Python syntax error"
    ((FAIL++))
fi

# Test 4: Check Flask installed
echo "[*] Test 4: Checking Flask installation..."
if python3 -c "import flask" 2>/dev/null; then
    echo "    ✅ Flask is installed"
    ((PASS++))
else
    echo "    ⚠️  Flask not installed - run: pip3 install flask flask-cors"
    ((FAIL++))
fi

# Test 5: Check HTML contains demo data
echo "[*] Test 5: Checking HTML contains demo data..."
if grep -q "demoData" "$TOOLS_DIR/network-mapper.html"; then
    echo "    ✅ Demo data found in HTML"
    ((PASS++))
else
    echo "    ❌ Demo data not found"
    ((FAIL++))
fi

# Test 6: Check HTML has Mermaid
echo "[*] Test 6: Checking for topology visualization..."
if grep -q "mermaid" "$TOOLS_DIR/network-mapper.html"; then
    echo "    ✅ Mermaid diagram library detected"
    ((PASS++))
else
    echo "    ❌ Mermaid not found"
    ((FAIL++))
fi

# Test 7: Check backend port handling
echo "[*] Test 7: Checking backend Flask configuration..."
if grep -q "Flask.*app" "$TOOLS_DIR/network-scanner.py"; then
    echo "    ✅ Flask app configured"
    ((PASS++))
else
    echo "    ❌ Flask not properly configured"
    ((FAIL++))
fi

# Test 8: Check backend API endpoints
echo "[*] Test 8: Checking API endpoints..."
if grep -q "@app.route('/api/scan'" "$TOOLS_DIR/network-scanner.py"; then
    echo "    ✅ Scan endpoint found"
    ((PASS++))
else
    echo "    ❌ Scan endpoint not found"
    ((FAIL++))
fi

# Test 9: Check documentation
echo "[*] Test 9: Checking documentation..."
DOCS_COUNT=$(ls -1 "$TOOLS_DIR"/*README* "$TOOLS_DIR"/*QUICK* 2>/dev/null | wc -l)
if [ "$DOCS_COUNT" -ge 2 ]; then
    echo "    ✅ Documentation found ($DOCS_COUNT files)"
    ((PASS++))
else
    echo "    ⚠️  Limited documentation"
    ((FAIL++))
fi

# Test 10: Check if can make network connections
echo "[*] Test 10: Checking network connectivity..."
if ping -c 1 -W 1 8.8.8.8 >/dev/null 2>&1; then
    echo "    ✅ Network connectivity OK"
    ((PASS++))
else
    echo "    ⚠️  Cannot reach external network (may affect scanning)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                         Test Results                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "    ✅ Passed: $PASS"
echo "    ❌ Failed: $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "🎉 All tests passed! Network Mapper is ready to use."
    echo ""
    echo "📖 Quick Start:"
    echo "   1. Demo mode (no setup):  Open network-mapper.html in browser, click 'Demo Data'"
    echo "   2. Real scanning:         python3 network-scanner.py"
    echo "   3. Then:                  Open network-mapper.html, enter subnet, click 'Scan'"
    echo ""
    exit 0
else
    echo "⚠️  Some tests failed. Review the issues above."
    echo ""
    echo "📋 Common fixes:"
    echo "   - Flask missing?    pip3 install flask flask-cors"
    echo "   - Python error?     python3 network-scanner.py --help"
    echo "   - HTML issue?       Use a modern browser (Chrome, Firefox, Safari)"
    echo ""
    exit 1
fi
