# START HERE: How to Generate Test Scripts

## 🎯 Your Goal

Generate reliable Playwright test scripts for Odoo UAT/QA using Cursor.

## 📋 What You Need

1. **Task Titan Details** - Your task information
2. **Odoo Credentials** - Server URL, username, password
3. **Cursor IDE** - Open and ready
4. **This Framework** - All files in place ✅

## 🚀 Quick Start (Choose Your Path)

### Option 1: I Want It Fast (5 minutes)
👉 Read: `QUICK_START.md`

### Option 2: I Want Detailed Steps
👉 Read: `STEP_BY_STEP_GUIDE.md`

### Option 3: I Want a Checklist
👉 Read: `WORKFLOW_CHECKLIST.md`

## 📁 Key Files You'll Use

| File | When to Use |
|------|-------------|
| **`FIXED_QA_PROMPT.md`** | ⭐ **START HERE** - Copy this prompt to Cursor |
| `correct-approach-example.spec.js` | Reference for what good code looks like |
| `CURSOR_INSTRUCTIONS.md` | Detailed instructions (if you need more info) |

## 🔄 The Process (Simple Version)

```
1. Copy prompt from FIXED_QA_PROMPT.md
   ↓
2. Paste into Cursor chat
   ↓
3. Provide your task details
   ↓
4. Type "Go Ahead QA Assistant"
   ↓
5. Cursor generates script
   ↓
6. Run: npx playwright test tests/your-file.spec.js --headed
   ↓
7. Done! ✅
```

## 📝 Example: What to Send to Cursor

### Step 1: Copy the Prompt
Copy everything from `FIXED_QA_PROMPT.md` and paste into Cursor.

### Step 2: Provide Task Info
```
Task Description: Create product in Odoo

Manual Test Scripts:
1. Navigate to Sales > Products
2. Click Create
3. Fill Product Name: "Test Product"
4. Fill Price: "100.00"
5. Click Save
6. Verify success message

Odoo Server: https://your-server.com
Odoo User: admin
Odoo Password: admin123
Spec File: tests/create-product.spec.js
```

### Step 3: Start Generation
```
Go Ahead QA Assistant
```

## ✅ Success Checklist

After Cursor generates your script, verify:

- [ ] Code uses `input[name="..."]` for form fields
- [ ] Code uses `getByRole('button', { name: '...' })` for buttons
- [ ] Code has `waitForLoadState('networkidle')` after navigation
- [ ] Code is simple and readable
- [ ] Test runs successfully: `npx playwright test tests/your-file.spec.js --headed`

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Don't know where to start | Read `QUICK_START.md` |
| Want detailed steps | Read `STEP_BY_STEP_GUIDE.md` |
| Want a checklist | Read `WORKFLOW_CHECKLIST.md` |
| Selectors are wrong | Read `CURSOR_INSTRUCTIONS.md` |
| Need examples | Check `correct-approach-example.spec.js` |

## 🎓 Learning Path

1. **First Time?** → Start with `QUICK_START.md`
2. **Want Details?** → Read `STEP_BY_STEP_GUIDE.md`
3. **Need Reference?** → Check `correct-approach-example.spec.js`
4. **Troubleshooting?** → See `CURSOR_INSTRUCTIONS.md`

## 💡 Pro Tips

1. **Always use browser feature** - Remind Cursor to inspect elements
2. **Test immediately** - Run tests right after generation
3. **Keep it simple** - Don't let Cursor create complex code
4. **Iterate** - Fix issues as they come up

## 📚 All Available Guides

- `QUICK_START.md` - 5-minute quick start
- `STEP_BY_STEP_GUIDE.md` - Detailed step-by-step guide
- `WORKFLOW_CHECKLIST.md` - Visual checklist
- `FIXED_QA_PROMPT.md` - ⭐ The prompt to use
- `CURSOR_INSTRUCTIONS.md` - Detailed instructions
- `correct-approach-example.spec.js` - Code examples

## 🎯 Your Next Action

**Right Now:**
1. Open `FIXED_QA_PROMPT.md`
2. Copy the entire prompt
3. Open Cursor
4. Paste the prompt
5. Provide your task details
6. Type "Go Ahead QA Assistant"

**That's it!** Your test script will be generated.

---

## Questions?

- **How do I...?** → Check `STEP_BY_STEP_GUIDE.md`
- **What if...?** → Check `CURSOR_INSTRUCTIONS.md`
- **Show me...** → Check `correct-approach-example.spec.js`

**Ready?** → Go to `FIXED_QA_PROMPT.md` and start! 🚀
