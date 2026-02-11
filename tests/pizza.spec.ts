import { test, expect } from 'playwright-test-coverage';
import { basicInit, login } from './util';
import { Role } from '../src/service/pizzaService';


test('login', async ({ page }) => {
  await basicInit(page);
  await login(page);

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('logout', async ({ page }) => {
  await basicInit(page);
  await login(page);
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
});

test('register', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('Test User');
  await page.getByPlaceholder('Name').press('Tab');
  await page.getByPlaceholder('Email address').fill('testuser@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('link', { name: 'TU' })).toBeVisible();
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

});

test('create a franchise', async ({ page }) => {
  // Login as admin
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

  // Open admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();

  // Create a franchise
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Test Franchise');
  await page.getByRole('textbox', { name: 'franchise name' }).press('Tab');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('testfranchisee@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
});


test('close a franchise', async ({ page }) => {
  // Login as admin
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

  // Open admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();


  // Close a franchise
  const lotaPizzaRow = page.getByRole('row', { name: /LotaPizza/ });
  const closeFranchiseButton = lotaPizzaRow.getByRole('button', { name: 'Close' });
  await expect(closeFranchiseButton).toBeVisible();
  await closeFranchiseButton.click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
});

test('close a store', async ({ page }) => {
  // Login as admin
  await basicInit(page, Role.Admin);
  await login(page);
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

  // Open admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();

  // Close a store
  const lehiRow = page.getByRole('row', { name: /Lehi/ });
  const closeStoreButton = lehiRow.getByRole('button', { name: 'Close' });
  await expect(closeStoreButton).toBeVisible();
  await closeStoreButton.click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
});


test('diner dashboard', async ({ page }) => {
  await basicInit(page);
  await login(page);

  await page.getByRole('link', { name: 'KC' }).click();
  await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');

  await expect(page.getByRole('main')).toContainText('Here is your history of all the good times.');
  await expect(page.locator('tbody')).toContainText('23');
});

test('about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

test('history page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
});

test('docs page', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');
});

test('not found page', async ({ page }) => {
  await page.goto('/opps');
  await expect(page.getByRole('main')).toContainText('It looks like we have dropped a pizza on the floor. Please try another page.');
});

