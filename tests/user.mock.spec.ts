import { test, expect } from 'playwright-test-coverage';
import { basicInit, login } from './util';
import { Role } from '../src/service/pizzaService';

// Mocks are set up in basicInit from util.ts

test('updateUser (mocked)', async ({ page }) => {
  await basicInit(page);

  // Register a new user (simulate by logging in as a new user)
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  // Simulate registration by setting up the user in the mock (if needed, extend util.ts)
  // For now, just login as the test user
  await login(page);

  await page.getByRole('link', { name: 'TU' }).click();
  await expect(page.getByRole('main')).toContainText('Test User');

  // Open and close edit user
  await page.getByRole('button', { name: 'Edit' }).click();   
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });
  await expect(page.getByRole('main')).toContainText('Test User');

  // Edit username, email, and password (mocked, so just check UI flow)
  const newName = 'Test Userx';
  const newEmail = `x${email}`;
  const newPassword = 'dinerx';
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox', { name: 'name' }).fill(newName);
  await page.getByRole('textbox', {name: 'email'}).fill(newEmail);
  await page.getByRole('textbox', {name: 'password'}).fill(newPassword);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });
  await expect(page.getByRole('main')).toContainText(newName);
  await expect(page.getByRole('main')).toContainText(newEmail);

  // Login with new credentials (mocked, so just login as the test user again)
  await page.getByRole('link', { name: 'Logout' }).click();
  await login(page, newEmail, newPassword);
  await page.getByRole('link', { name: 'TU' }).click();
  await expect(page.getByRole('main')).toContainText('Test Userx'); 
});

test('list users in admin dashboard (mocked)', async ({ page }) => {
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toContainText('admin-dashboard');
  // Filter users (mocked, so just check UI flow)
  await page.getByRole('textbox', { name: 'Filter users' }).fill('Test');
  await page.getByTitle('Filter Users').click();
  await expect(page.getByTitle('User Table')).toContainText('Test User');
  await expect(page.getByTitle('User Table')).toContainText('test@jwt.com');
});

test('delete user (mocked)', async ({ page }) => {
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toContainText('admin-dashboard');
  // Filter users (mocked, so just check UI flow)
  await page.getByRole('textbox', { name: 'Filter users' }).fill('Test');
  await page.getByTitle('Filter Users').click();
  // Delete the user (mocked, so just check UI flow)
  const userRow = page.getByRole('row', { name: /test@jwt.com/ });
  const deleteButton = userRow.getByRole('button', { name: 'Delete' });
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
});
