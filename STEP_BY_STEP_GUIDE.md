# Step-by-Step Guide: Generating Test Scripts

## Prerequisites

1. ✅ Framework files are updated
2. ✅ Playwright is installed (`npm install` and `npx playwright install`)
3. ✅ You have Task Titan details ready
4. ✅ You have Odoo server credentials

## Step-by-Step Process

### Step 1: Prepare Your Task Information

Gather all the information you'll provide to Cursor:

- [ ] Task Description
- [ ] Manual Test Scripts
- [ ] Problem Statement
- [ ] Description
- [ ] User Story
- [ ] Odoo Server URL
- [ ] Odoo Username
- [ ] Odoo Password
- [ ] Spec file path (e.g., `tests/my-task.spec.js`)

### Step 2: Create Test Directory (if needed)

```bash
mkdir -p tests
```

### Step 3: Open Cursor and Start New Chat

1. Open Cursor IDE
2. Start a new chat/conversation
3. Make sure you're in the workspace directory

### Step 4: Provide the QA Assistant Prompt

**Copy and paste the entire prompt from `FIXED_QA_PROMPT.md`**

This tells Cursor how to behave and what rules to follow.

### Step 5: Provide Task Information

Send the task information to Cursor in separate messages (or one message):

**Example:**

```
Task Description: Create a new product in Odoo with name and price

Manual Test Scripts:
1. Navigate to Sales > Products > Products
2. Click Create button
3. Fill Product Name field with "Test Product"
4. Fill Sale Price field with "100.00"
5. Click Save button
6. Verify success notification appears

Problem Statement: Need to automate product creation testing

Description: This task involves creating products in Odoo Sales module

User Story: As a sales manager, I want to create products so that I can add them to sales orders

Odoo Server: https://your-odoo-server.com
Odoo User: admin
Odoo Password: admin123
Spec File: tests/create-product.spec.js
```

### Step 6: Tell Cursor to Start

After providing all information, write:

```
Go Ahead QA Assistant
```

### Step 7: Cursor Will Generate the Script

Cursor will:
1. Use browser feature to explore Odoo
2. Inspect elements using browser feature
3. Generate Playwright script with correct selectors
4. Write the script to your spec file

### Step 8: Review the Generated Script

Check the generated script:
- [ ] Uses `input[name="..."]` for form fields
- [ ] Uses `getByRole()` for buttons and menus
- [ ] Has `waitForLoadState('networkidle')` after navigation
- [ ] Code is simple and readable
- [ ] No complex CSS selectors or XPath

### Step 9: Run the Test Script

```bash
# Run in headed mode to see what's happening
npx playwright test tests/your-script.spec.js --headed
```

### Step 10: Fix Any Issues

If the test fails:

1. **Check the error message** - What element wasn't found?
2. **Use browser feature** - Inspect the element again
3. **Ask Cursor to fix** - Provide the error and ask Cursor to update the selector
4. **Re-run the test** - Verify it works now

### Step 11: Verify Test Passes

```bash
# Run test again
npx playwright test tests/your-script.spec.js --headed
```

You should see:
- ✅ Browser opens
- ✅ Test executes automatically
- ✅ All steps complete successfully
- ✅ Test passes

## Example: Complete Workflow

### Message 1: Provide the Prompt
```
[Copy entire content from FIXED_QA_PROMPT.md]
```

### Message 2: Provide Task Details
```
Task Description: Create product in Odoo
Manual Test Scripts: [your test steps]
Odoo Server: https://odoo.example.com
Odoo User: admin
Odoo Password: admin123
Spec File: tests/create-product.spec.js
```

### Message 3: Start Generation
```
Go Ahead QA Assistant
```

### Message 4: Review and Test
- Review generated script
- Run: `npx playwright test tests/create-product.spec.js --headed`
- Fix any issues if needed

## Troubleshooting

### Issue: Cursor generates wrong selectors

**Solution:**
- Remind Cursor: "Remember to use browser feature to inspect elements"
- Remind Cursor: "Use name attributes for form fields"
- Remind Cursor: "Use getByRole for buttons"

### Issue: Test fails with "element not found"

**Solution:**
1. Share the error with Cursor
2. Ask: "Use browser feature to inspect this element again and fix the selector"
3. Provide the element name/description

### Issue: Test is too fast, elements not ready

**Solution:**
- Ask Cursor: "Add more waits after navigation"
- Check if `waitForLoadState('networkidle')` is present

### Issue: Cursor creates complex code

**Solution:**
- Remind Cursor: "Keep code simple, use direct Playwright methods"
- Reference: "Follow the code structure template from the prompt"

## Quick Reference Checklist

Before generating scripts:
- [ ] Read `FIXED_QA_PROMPT.md`
- [ ] Have all task information ready
- [ ] Created `tests/` directory
- [ ] Know your spec file path

When generating:
- [ ] Provide the prompt from `FIXED_QA_PROMPT.md`
- [ ] Provide all task details
- [ ] Write "Go Ahead QA Assistant"
- [ ] Review generated code

After generation:
- [ ] Check selectors are correct (name attributes, getByRole)
- [ ] Check waits are present
- [ ] Run test in headed mode
- [ ] Fix any issues
- [ ] Verify test passes

## Tips for Success

1. **Be specific** - Provide clear task details
2. **Reference the prompt** - Keep `FIXED_QA_PROMPT.md` open
3. **Use browser feature** - Remind Cursor to use it
4. **Test immediately** - Run tests right after generation
5. **Iterate** - Fix issues as they come up

## Next Steps After Script Generation

1. ✅ Test script runs successfully
2. ✅ All test cases pass
3. ✅ Script is stable (runs multiple times without failure)
4. ✅ Share with BPS team for execution
5. ✅ Document any special requirements
