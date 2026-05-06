import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # Start the dev server in the background (already handled by the sandbox usually,
        # but here we just need to hit the port 3000 where omni-ai usually runs)
        url = "http://localhost:3000"

        try:
            await page.goto(url, timeout=30000)
            await page.wait_for_timeout(2000)

            # Screenshot of Home/Chat
            await page.screenshot(path='/tmp/omni_ai_chat.png')

            # Navigate to Agents View
            # Assuming the sidebar link for Agents is there
            await page.click('[data-testid="nav-agents"]', timeout=5000)
            await page.wait_for_timeout(2000)
            await page.screenshot(path='/tmp/omni_ai_agents.png')

            print("Screenshots captured successfully.")
        except Exception as e:
            print(f"Failed to capture screenshots: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
