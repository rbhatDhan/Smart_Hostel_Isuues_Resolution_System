import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', className: 'badge-pending' },
    'in-progress': { label: 'In Progress', className: 'badge-progress' },
    resolved: { label: 'Resolved', className: 'badge-resolved' },
    delayed: { label: 'Delayed', className: 'badge-delayed' },
    cancelled: { label: 'Cancelled', className: 'badge-cancelled' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

export default StatusBadge;