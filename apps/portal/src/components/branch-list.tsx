import type { BranchSummary } from '@business-ai/contracts';
import Link from 'next/link';

import { branchSummaryToListItem } from '../lib/branch-settings-model';
import {
  branchSettingsHref,
  portalContextQuery,
  type PortalContextSelection,
} from './portal-navigation';

export function BranchList({
  branches,
  canCreate,
  context,
}: Readonly<{
  branches: readonly BranchSummary[];
  canCreate: boolean;
  context: PortalContextSelection;
}>) {
  if (context.selectedRestaurant === undefined) {
    return (
      <div className="data-state">
        <strong>No Restaurant selected</strong>
        <p>Select an authorized Restaurant workspace to view its Branches.</p>
      </div>
    );
  }
  const createHref = `/portal/settings/branches/new?${portalContextQuery(context)}`;

  return (
    <section aria-labelledby="branch-list-title" className="branch-list">
      <div className="branch-list-heading">
        <div>
          <h3 id="branch-list-title">Restaurant Branches</h3>
          <p>Open a Branch to manage its identity, location, and configuration.</p>
        </div>
        {canCreate && branches.length > 0 ? (
          <Link className="primary-button branch-create-link" href={createHref}>
            Create Branch
          </Link>
        ) : null}
      </div>

      {branches.length === 0 ? (
        <div className="settings-empty-state branch-zero-state">
          <strong>No Branches yet</strong>
          <p>
            This Restaurant does not have a Branch. Branch creation is intentional and never happens
            automatically.
          </p>
          {canCreate ? (
            <Link className="primary-button branch-create-link" href={createHref}>
              Create Branch
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="branch-list-items">
          {branches.map((branch) => {
            const item = branchSummaryToListItem(branch);
            return (
              <li key={item.branchId}>
                <Link
                  aria-label={`Manage ${item.name}`}
                  className="branch-list-link"
                  href={branchSettingsHref(context, item.branchId)}
                >
                  <span className="branch-list-identity">
                    <strong>{item.name}</strong>
                    {item.code === null ? null : <span>Code {item.code}</span>}
                    {item.location === null ? null : <span>{item.location}</span>}
                  </span>
                  <span className="branch-list-statuses">
                    {item.isDefault ? (
                      <span className="branch-default-status">Default Branch</span>
                    ) : null}
                    <span className={`branch-lifecycle-status is-${item.status}`}>
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                  <span aria-hidden="true" className="branch-list-arrow">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
