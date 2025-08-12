#!/usr/bin/env python3
import asyncio
import os
import sys
import argparse
from typing import Optional

from playwright.async_api import async_playwright, Page


async def wait_for_login_success(page: Page, timeout_ms: int = 30000) -> bool:
    # Detect success by URL change to /web (not /web/login) and presence of main navbar
    try:
        await page.wait_for_url("**/web", timeout=timeout_ms)
    except Exception:
        # URL didn't change in time; could still be logged in via same URL, so continue checks
        pass

    # Check for error alert first
    try:
        error_alert = page.locator(".alert.alert-danger, .o_login_error")
        if await error_alert.is_visible():
            return False
    except Exception:
        pass

    # Check for main UI elements that indicate a logged-in session
    try:
        await page.wait_for_selector("nav.o_main_navbar, .o_web_client, .o_menu_systray", timeout=timeout_ms)
        return True
    except Exception:
        return False


async def perform_login(url: str, username: str, password: str, headless: bool = True, screenshot_path: Optional[str] = None) -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(url, wait_until="domcontentloaded", timeout=60000)

        # Fill credentials
        await page.fill('input[name="login"]', username)
        await page.fill('input[name="password"]', password)

        # Submit the form
        # Odoo typically uses button[type="submit"]
        await page.click('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")')

        # Wait for login to complete
        success = await wait_for_login_success(page)

        if screenshot_path:
            try:
                await page.screenshot(path=screenshot_path, full_page=True)
            except Exception:
                pass

        await context.close()
        await browser.close()

        return 0 if success else 1


def parse_args(argv):
    parser = argparse.ArgumentParser(description="Automate Odoo login using Playwright")
    parser.add_argument("--url", default=os.getenv("ODOO_URL", "https://86723719-18-0-all.runbot227.odoo.com/web/login"), help="Odoo login URL")
    parser.add_argument("--username", default=os.getenv("ODOO_USERNAME", "admin"), help="Username for login")
    parser.add_argument("--password", default=os.getenv("ODOO_PASSWORD", "admin"), help="Password for login")
    parser.add_argument("--headed", action="store_true", help="Run browser in headed mode")
    parser.add_argument("--screenshot", default=os.getenv("SCREENSHOT_PATH", "after_login.png"), help="Path to save a screenshot after login (set empty to skip)")
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])

    screenshot_path: Optional[str] = args.screenshot if (args.screenshot or args.screenshot == "") else None
    if screenshot_path == "":
        screenshot_path = None

    exit_code = asyncio.run(
        perform_login(
            url=args.url,
            username=args.username,
            password=args.password,
            headless=not args.headed,
            screenshot_path=screenshot_path,
        )
    )

    if exit_code == 0:
        print("Login successful")
    else:
        print("Login failed", file=sys.stderr)

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())