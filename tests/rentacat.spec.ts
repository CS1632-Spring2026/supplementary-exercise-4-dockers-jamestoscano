import { test, expect } from '@playwright/test';
//lets do this
test.beforeEach(async ({ page }) => {
  // Fixture step 2: Navigate to the website
  await page.goto('http://localhost:8080/');

  // set all the cats to available
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });

  // Reload so the page reflects the cookie state
  await page.reload();
});

/* over all test case structure for copy and paste future reference
test('TEST-1-Catalog', async ({ page }) => {
    
});
*/

/*
IDENTIFIER: TEST-1-RESET
TEST CASE: Given that cats ID 1, 2, and 3 have been rented out,
           check that resetting the system results in all cats being available.
PRECONDITIONS: The value of cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
EXECUTION STEPS:
1. Press the "Reset" link.
POSTCONDITIONS: 
1. The first item in the cat listing is "ID 1. Jennyanydots".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "ID 3. Mistoffelees".
*/

test('TEST-1-RESET', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  //preq all cats rented out
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  //gotta reflect the changes
  await page.reload();

  //exec
  await page.getByRole('link', { name: 'Reset' }).click();

  //post check all the cats are available again so the text fixture state
  // set all the cats to available
  await expect(page.getByText('ID 1. Jennyanydots')).toBeVisible();
  await expect(page.getByText('ID 2. Old Deuteronomy')).toBeVisible();
  await expect(page.getByText('ID 3. Mistoffelees')).toBeVisible();
});

/*
```
IDENTIFIER: TEST-2-CATALOG
TEST CASE: Check that the second item in the catalog is an image named "cat2.jpg".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Catalog" link.
POSTCONDITIONS: The source of the second image in the catalog is "/images/cat2.jpg".
```
*/

//get it? Cat-alog? lmao
test('TEST-2-CATALOG', async ({ page }) => {
  //go catalog
  await page.getByRole('link', { name: 'Catalog' }).click();

  //check image source
  const images = page.getByRole('img');
  await expect(images.nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

/*
IDENTIFIER: TEST-3-LISTING
TEST CASE: Check that the listing has three cats and the third is "ID 3. Mistoffelees".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Catalog" link.
POSTCONDITIONS: 
1. There are exactly three items in the listing.
2. The text in the third item is "ID 3. Mistoffelees".
*/

test('TEST-3-LISTING', async ({ page }) => {
  //go catalog
  await page.getByRole('link', { name: 'Catalog' }).click();

  //make sure 3 items in listing
  await expect(page.locator('#listing li')).toHaveCount(3);


  //text in third item is ID3. Mistoffelees
  await expect(page.locator('#listing li').nth(2)).toHaveText('ID 3. Mistoffelees');
});

/*
IDENTIFIER: TEST-4-RENT-A-CAT
TEST CASE: Check that the "Rent" and "Return" buttons exist in the Rent-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
POSTCONDITIONS: 
1. A "Rent" button exists on the page.
2. A "Return" button exists on the page.
*/
test('TEST-4-RENT-A-CAT', async ({ page }) => {
  //press the link
  await page.getByRole('link', { name: "Rent-A-Cat" }).click();

  //check button exisgt
  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

/*
IDENTIFIER: TEST-5-RENT
TEST CASE: Check that renting cat ID 1 works as expected.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
2. Enter "1" into the input box for the rented cat ID.
3. Press the "Rent" button.
POSTCONDITIONS: 
1. The first item in the cat listing is "Rented out".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "ID 3. Mistoffelees".
4. The text "Success!" is displayed in the element with ID "rentResult"
*/

test('TEST-5-RENT', async ({ page }) => {
  //press the link
  await page.getByRole('link', { name: "Rent-A-Cat" }).click();

  //enter 1
  await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');

  //press button
  await page.getByRole('button', { name: 'Rent' }).click();

  //check item conditions
  await expect(page.locator('#listing li').nth(0)).toHaveText('Rented out');
  await expect(page.locator('#listing li').nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(page.locator('#listing li').nth(2)).toHaveText('ID 3. Mistoffelees');

  //check success
  await expect(page.locator('#rentResult')).toHaveText('Success!');

});

/*
IDENTIFIER: TEST-6-RETURN
TEST CASE: Check that returning cat ID 2 works as expected.
PRECONDITIONS: The value of cookies "2" and "3" are set to "true" (cats ID 2 and 3 are rented).
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
2. Enter "2" into the input box for the returned cat ID.
3. Press the "Return" button.
POSTCONDITIONS: 
1. The first item in the cat listing is "ID 1. Jennyanydots".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "Rented out".
4. The text "Success!" is displayed in the element with ID "returnResult"
*/

test('TEST-6-RETURN', async ({ page }) => {
  //same but different from the prev test

  //preqs:
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  //press the link
  await page.getByRole('link', { name: "Rent-A-Cat" }).click();

  //enter 1
  await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');

  //press button
  await page.getByRole('button', { name: 'Return' }).click();

  //check item conditions
  await expect(page.getByText('ID 1. Jennyanydots')).toBeVisible();
  await expect(page.getByText('ID 2. Old Deuteronomy')).toBeVisible();
  await expect(page.getByText('Rented out')).toBeVisible();

  //check success
  await expect(page.locator('#returnResult')).toHaveText('Success!');
});

/*
IDENTIFIER: TEST-7-FEED-A-CAT
TEST CASE: Check that the "Feed" button exists in the Feed-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
POSTCONDITIONS: 
1. A "Feed" button exists on the page.
*/
test('TEST-7-FEED-A-CAT', async ({ page }) => {
  //like test 4:

  //press the link
  await page.getByRole('link', { name: "Feed-A-Cat" }).click();

  //check button exisgt
  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();

});

/*
IDENTIFIER: TEST-8-FEED
TEST CASE: Check that feeding 6 catnips to 3 cats results in "Nom, nom, nom.".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
2. Enter "6" into the input box for number of catnips.
3. Press the "Feed" button.
POSTCONDITIONS: 
1. The text "Nom, nom, nom." is displayed in the element with ID "feedResult"
*/
test('TEST-8-FEED', async ({ page }) => {

  //press the link
  await page.getByRole('link', { name: "Feed-A-Cat" }).click();

  //feed the catnips 6
  await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');

  //Feed the cats
  await page.getByRole('button', { name: 'Feed' }).click();

  //test post
  await expect(page.locator('#feedResult')).toHaveText('Nom, nom, nom.', { timeout: 10000 });

});

/*
IDENTIFIER: TEST-9-GREET-A-CAT
TEST CASE: Check that 3 cats respond with three "Meow!"s in the Greet-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Greet-A-Cat" link.
POSTCONDITIONS: 
1. The text "Meow!Meow!Meow!" appears on the page.
*/
test('TEST-9-GREET-A-CAT', async ({ page }) => {
  //press the link
  await page.getByRole('link', { name: "Greet-A-Cat" }).click();

  //post meow meow meow
  await expect(page.getByRole('heading', { name: 'Meow!Meow!Meow!' })).toBeVisible();

});

/*
IDENTIFIER: TEST-10-GREET-A-CAT-WITH-NAME
TEST CASE: Check that greeting Jennyanydots results in "Meow!"s in the Greet-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Navigate to the `/greet-a-cat/Jennyanydots` URL by opening on browser.
POSTCONDITIONS: 
1. The text "Meow! from Jennyanydots." appears on the page.
*/
test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  //gotta hop to the specified link: 
  await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');

  //post custom meow
  await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});

/*
IDENTIFIER: TEST-11-FEED-A-CAT-SCREENSHOT
TEST CASE: Check that the Feed-A-Cat page matches the corresponding screenshot in the tests/rentacat.spec.ts.snapshots folder.
PRECONDITIONS: The value of cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
POSTCONDITIONS: 
1. The screenshot of the body of the page matches the one in tests/rentacat.spec.ts.snapshots for the browser and OS.
*/
test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  //preq
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.reload();

  //press link
  await page.getByRole('link', { name: "Feed-A-Cat" }).click();

  //check post
  await expect(page.locator('body')).toHaveScreenshot();

});















