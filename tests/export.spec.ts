import { test, expect } from '@playwright/test';
import JSZip from 'jszip';

const PROJECT = 'cosense-exporter-test';

async function readZip(buffer: Buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const files = Object.keys(zip.files);
  return files;
}

test('preview and export', async ({ page, request }) => {
  await page.goto('/');
  await page.fill('input:nth-of-type(1)', PROJECT);
  await page.click('button:has-text("プレビュー")');
  const modal = page.locator('pre');
  await expect(modal).toContainText('test1.md');
  await expect(modal).toContainText('test2.md');
  await page.click('button:has-text("エクスポート")');
  const resp = await page.waitForResponse(res => res.url().includes('/api/export') && res.status() === 200);
  expect(resp.headers()['content-type']).toBe('application/zip');
  const buf = Buffer.from(await resp.body());
  const files = await readZip(buf);
  expect(files).toContain('test1.md');
  expect(files).toContain('test2.md');
});

