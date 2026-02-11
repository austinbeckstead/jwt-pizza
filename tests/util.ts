import { expect } from 'playwright-test-coverage';
import { User, Role } from "../src/service/pizzaService";
import { Page } from '@playwright/test';

const TEST_USER_EMAIL = 'd@jwt.com';
const TEST_USER_PASSWORD = 'a';

export async function basicInit(page: Page, role: Role = Role.Diner) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { [TEST_USER_EMAIL]: { id: '3', name: 'Kai Chen', email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD, roles: [{ role: role }] } };

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
      if (route.request().method() === 'PUT') {
      const loginReq = route.request().postDataJSON();
      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }
      loggedInUser = validUsers[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: 'abcdef',
      };
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === 'DELETE') {
      loggedInUser = undefined;
      await route.fulfill({ status: 204 });
    } else if (route.request().method() === 'POST') {
      const registerReq = route.request().postDataJSON();
      const newUser: User = {
        id: '4',
        name: registerReq.name,
        email: registerReq.email,
        password: registerReq.password,
        roles: [{ role: Role.Diner }],
      };
      loggedInUser = newUser;
      validUsers[registerReq.email] = newUser;
      const registerRes = {
        user: newUser,
        token: 'abcdef',
      };
      await route.fulfill({ json: registerRes });
    }
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    const getFranchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
    };

    if (method === 'GET') {
          await route.fulfill({ json: getFranchiseRes });
    }
    // Createa a franchise
    else if (method === 'POST') {
      const franchiseReq = route.request().postDataJSON();
      const franchiseRes = { ...franchiseReq, id: 5 };
      expect(method).toBe('POST');
      await route.fulfill({
        json: franchiseRes,
    });
    }
    else if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
    }
  });


  await page.route(/\/api\/franchise\/\d+$/, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
      ] });
    }
  });
  
  // Delete a Store
  await page.route(/\/api\/franchise\/\d+\/store\/\d+$/, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
    }
  });

  // Create a Store
  await page.route(/\/api\/franchise\/\d+\/store$/, async (route) => {
    if (route.request().method() === 'POST') {
      const storeReq = route.request().postDataJSON();
      await route.fulfill({ json: { id: 10, name: storeReq.name || 'New Store' } });
    }
  });

  // Order a pizza.
  await page.route('*/**/api/order', async (route) => {
    if (route.request().method() === 'POST') {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
      await route.fulfill({ json: orderRes });
    } else if (route.request().method() === 'GET') {
      const orderHistoryRes = {
        id: "testOrder",
        dinerId: "1",
        orders: [
          {
            id: "23",
            franchiseId: "2",
            storeId: "4",
            date: new Date().toISOString(),
            items: [
              { menuId: "1", description: "Veggie", price: 0.0038 },
              { menuId: "2", description: "Pepperoni", price: 0.0042 },
            ],
          },
        ],
      }
      await route.fulfill({ json: orderHistoryRes });
    }
  });

  await page.goto('/');
}

export async function login(page: Page) {
await page.getByRole('link', { name: 'Login', exact: true }).first().click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(TEST_USER_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(TEST_USER_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
}