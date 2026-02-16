import { Page } from "@playwright/test";

export async function register(page: Page, name: string, email: string, password: string, isAdmin: boolean = false) {
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill(name);
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  if (isAdmin) {
    await page.getByRole('checkbox', { name: 'Register as Admin' }).check();
  }
  await page.getByRole('button', { name: 'Register' }).click();
}

export async function login(page: Page, email: string, password: string) {
await page.getByRole('link', { name: 'Login', exact: true }).first().click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}