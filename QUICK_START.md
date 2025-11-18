# Quick Start: Generate Your First Test Script

## 5-Minute Quick Start

### 1. Prepare (1 minute)

```bash
# Create tests directory
mkdir -p tests

# Make sure Playwright is installed
npm install
npx playwright install chromium
```

### 2. Open Cursor Chat (1 minute)

1. Open Cursor IDE
2. Start new chat
3. Copy the prompt from `FIXED_QA_PROMPT.md`

### 3. Provide Task Info (1 minute)

Paste this format and fill in your details:

```
Task Description: [Your task description]

Manual Test Scripts:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Odoo Server: [Your server URL]
Odoo User: [Your username]
Odoo Password: [Your password]
Spec File: tests/my-test.spec.js
```

### 4. Generate Script (1 minute)

Type:
```
Go Ahead QA Assistant
```

### 5. Run Test (1 minute)

```bash
npx playwright test tests/my-test.spec.js --headed
```

## That's It! 🎉

Your test script should be generated and ready to run.

## If Something Goes Wrong

1. **Wrong selectors?** → Remind Cursor: "Use browser feature to inspect elements"
2. **Test fails?** → Share error with Cursor and ask to fix
3. **Need help?** → Check `STEP_BY_STEP_GUIDE.md` for detailed instructions

## Files You Need

- ✅ `FIXED_QA_PROMPT.md` - The prompt to give Cursor
- ✅ `correct-approach-example.spec.js` - Example of good code
- ✅ `CURSOR_INSTRUCTIONS.md` - Detailed instructions (optional)

## Common Commands

```bash
# Run test
npx playwright test tests/my-test.spec.js --headed

# Run all tests
npx playwright test --headed

# Debug mode
npx playwright test tests/my-test.spec.js --debug
```
