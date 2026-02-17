import { test, expect } from 'playwright-test-coverage';
import { login, register } from './integration.util';
test('updateUser', async ({ page }) => {

  // Register a new user
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await register(page, 'pizza diner', email, 'diner');

  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  // Open and close edit user
  await page.getByRole('button', { name: 'Edit' }).click();   
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza diner');

  // Edit username, email, and password
  const newName = 'pizza dinerx';
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
  
  // Login with new credentials
  await page.getByRole('link', { name: 'Logout' }).click();
  await login(page, newEmail, newPassword);

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText(newName); 
});

test ('list users in admin dashboard', async ({ page }) => {

    // Login as admin
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await register(page, 'pizza diner', email, 'diner', true);
    await login(page, email, 'diner');
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

    // Open admin dashboard
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('list')).toContainText('admin-dashboard');

    // Check that the user we just created is in the user list
    await expect(page.getByRole('table')).toContainText(email);

});

test('delete user', async ({ page }) => {

    // Register a new user
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    const adminEmail = `admin${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await register(page, 'pizza diner', email, 'diner');
    await page.getByRole('link', { name: 'Logout' }).click();
    await register(page, 'admin', adminEmail, 'diner', true);
    await login(page, adminEmail, 'diner');
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

    // Open admin dashboard
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('list')).toContainText('admin-dashboard');

    // Delete the user we just created
    const userRow = page.getByRole('row', { name: new RegExp(email) });
    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Confirm deletion
    await expect(page.locator('h3')).toContainText('Delete user');
    await page.getByRole('button', { name: 'Delete' }).click();

    // Check that the user is no longer in the user list
    await expect(page.getByRole('table')).not.toContainText(email);
});
