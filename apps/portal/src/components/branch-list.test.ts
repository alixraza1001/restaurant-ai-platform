import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { BranchList } from './branch-list';

test('distinguishes no Restaurant selection from an empty authorized Restaurant and suppresses creation', () => {
  const noRestaurant = renderToStaticMarkup(
    createElement(BranchList, {
      branches: [],
      canCreate: true,
      context: { organisation: { id: 'org' } },
    }),
  );
  expect(noRestaurant).toContain('No Restaurant selected');
  expect(noRestaurant).not.toContain('No Branches yet');
  expect(noRestaurant).not.toContain('Create Branch');
  const emptyRestaurant = renderToStaticMarkup(
    createElement(BranchList, {
      branches: [],
      canCreate: false,
      context: { organisation: { id: 'org' }, selectedRestaurant: { id: 'restaurant' } },
    }),
  );
  expect(emptyRestaurant).toContain('No Branches yet');
  expect(emptyRestaurant).not.toContain('Create Branch');
});
