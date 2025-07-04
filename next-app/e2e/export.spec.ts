import { test, expect } from '@playwright/test';
import JSZip from 'jszip';

test('/api/export returns zip', async ({ page }) => {
  const response = await page.request.post('/api/export', {
    data: { project: 'dummy' },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('application/zip');

  const body = await response.body();
  const zip = await JSZip.loadAsync(body);
  expect(Object.keys(zip.files).length).toBeGreaterThan(0);
});
