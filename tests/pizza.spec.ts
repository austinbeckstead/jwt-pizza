import { test, expect } from 'playwright-test-coverage';
import { basicInit, login } from './util';
import { Role } from '../src/service/pizzaService';


test('login', async ({ page }) => {
  await basicInit(page);
  await login(page);

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
  await basicInit(page);

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();
  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('admin Dashboard', async ({ page }) => {

  // Login as admin
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

  // Open admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('list')).toContainText('admin-dashboard');
  await expect(page.locator('h3')).toContainText('Franchises');

  // Filter franchises
  await page.getByRole('textbox', { name: 'Filter franchises' }).fill('Lotapizza');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('table')).toContainText('LotaPizza');
  await expect(page.getByRole('table')).toContainText('Lehi');

  // Create a franchise
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Test Franchise');
  await page.getByRole('textbox', { name: 'franchise name' }).press('Tab');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('testfranchisee@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  // Close a franchise
  await page.getByRole('row', { name: 'LotaPizza  Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();

  








});

test('about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

