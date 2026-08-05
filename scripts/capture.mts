/**
 * Re-runnable project screenshot capture.
 *
 * Start the target project's dev server on the port below, then:
 *   pnpm capture            all projects whose server is reachable
 *   pnpm capture transworld one project
 *
 * Output: public/shots/<project>/NN-name.jpg
 */
import { chromium, type Page } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Shot = {
  name: string;
  route: string;
  wait?: number;
  /** Optional interaction run after navigation, before the screenshot. */
  act?: (page: Page) => Promise<void>;
};

type Project = { id: string; base: string; start: string; shots: Shot[] };

const PROJECTS: Project[] = [
  {
    id: "transworld",
    base: "http://localhost:3100",
    start: "cd ~/Desktop/ArroyoDev/haashow/haashow && npx next dev -p 3100",
    shots: [
      // Explicit show id: NEXT_PUBLIC_DEFAULT_SHOW_ID points at a different show.
      { name: "01-floor-plan", route: "/floor-plan/haa-2026", wait: 5000 },
      {
        name: "02-exhibitor-detail",
        route: "/floor-plan/haa-2026",
        wait: 5000,
        act: async (p) => {
          await p.locator('button:has-text("Booth 1623")').first().click();
          await p.waitForTimeout(6000);
        },
      },
      {
        name: "03-search",
        route: "/floor-plan/haa-2026",
        wait: 4500,
        act: async (p) => {
          await p.locator('input[placeholder*="Search exhibitor"]').first().fill("haunt");
          await p.waitForTimeout(2500);
        },
      },
      { name: "05-home", route: "/", wait: 5000 },
    ],
  },
  {
    id: "suga",
    // Needs NEXT_PUBLIC_USE_MOCK_DASHBOARD=true; AuthGuard only checks the token is truthy.
    base: "http://localhost:3200",
    start:
      "cd ~/Desktop/Suga/sugaFrontend && NEXT_PUBLIC_USE_MOCK_DASHBOARD=true npx next dev -p 3200",
    shots: [
      { name: "01-dashboard", route: "/dashboard", wait: 6000 },
      {
        name: "02-workflow-builder",
        route: "/workflows/builder",
        wait: 6000,
        // The palette uses HTML5 drag with dataTransfer, which Playwright's
        // mouse-driven dragAndDrop cannot populate. Dispatch the events
        // ourselves so dragstart and drop share one DataTransfer.
        act: async (p) => {
          const place = async (label: string, x: number, y: number) => {
            await p.evaluate(
              ({ label, x, y }) => {
                const item = [...document.querySelectorAll('[draggable="true"]')].find((el) =>
                  el.textContent?.trim().startsWith(label),
                );
                const pane =
                  document.querySelector(".react-flow__pane") ??
                  document.querySelector(".react-flow");
                if (!item || !pane) return;
                const dataTransfer = new DataTransfer();
                item.dispatchEvent(new DragEvent("dragstart", { dataTransfer, bubbles: true }));
                const r = pane.getBoundingClientRect();
                const opts = {
                  dataTransfer,
                  bubbles: true,
                  cancelable: true,
                  clientX: r.left + x,
                  clientY: r.top + y,
                };
                pane.dispatchEvent(new DragEvent("dragover", opts));
                pane.dispatchEvent(new DragEvent("drop", opts));
              },
              { label, x, y },
            );
            await p.waitForTimeout(800);
          };
          // Two nodes, generously spaced. Three crowd the canvas once the
          // viewport transform is applied, and nothing wires connections anyway.
          await place("Webhook", 260, 200);
          await place("Send Email", 260, 580);
          await p.waitForTimeout(1500);
        },
      },
      { name: "03-marketing", route: "/", wait: 5000 },
      { name: "04-pricing", route: "/pricing", wait: 4000 },
    ],
  },
];

/** Framework dev badges are not part of the product. */
const HIDE_DEV_CHROME = `
  nextjs-portal, [data-nextjs-dev-tools-button], #__next-build-watcher,
  [data-nextjs-toast], vite-error-overlay { display: none !important; }
`;

/** Generous: dev servers compile routes on demand, and a cold first hit can take many seconds. */
async function reachable(base: string) {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 30_000);
    await fetch(base, { signal: c.signal, redirect: "manual" });
    clearTimeout(t);
    return true;
  } catch {
    return false;
  }
}

const only = process.argv[2];
const targets = only ? PROJECTS.filter((p) => p.id === only) : PROJECTS;
if (!targets.length) {
  console.error(`unknown project "${only}". known: ${PROJECTS.map((p) => p.id).join(", ")}`);
  process.exit(1);
}

const browser = await chromium.launch();

for (const project of targets) {
  if (!(await reachable(project.base))) {
    console.log(`\n${project.id}: SKIPPED, nothing at ${project.base}`);
    console.log(`  start it with:  ${project.start}`);
    continue;
  }

  const out = resolve(ROOT, "public/shots", project.id);
  await mkdir(out, { recursive: true });
  console.log(`\n${project.id} -> public/shots/${project.id}`);

  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1.5,
  });
  // Suga's AuthGuard is client-side and only checks truthiness.
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("suga_access_token", "local-capture");
    } catch {}
  });

  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 90)));

  for (const shot of project.shots) {
    try {
      await page.goto(project.base + shot.route, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      await page.waitForTimeout(shot.wait ?? 4000);
      if (shot.act) await shot.act(page);
      await page.addStyleTag({ content: HIDE_DEV_CHROME });
      await page.waitForTimeout(300);
      await page.screenshot({
        path: `${out}/${shot.name}.jpg`,
        type: "jpeg",
        quality: 86,
      });
      console.log(`  ok  ${shot.name}`);
    } catch (e) {
      console.log(`  FAIL ${shot.name}: ${(e as Error).message.split("\n")[0].slice(0, 90)}`);
    }
  }

  if (errors.length) console.log(`  page errors: ${errors.slice(0, 3).join(" | ")}`);
  await ctx.close();
}

await browser.close();
console.log("\ndone");
