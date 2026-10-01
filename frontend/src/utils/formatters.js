export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDuration = (days) => {
  if (!days) return 'Lifetime';
  return `${days} days`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getStatusBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'published':
    case 'submitted':
    case 'success':
      return 'success';
    case 'inactive':
    case 'unpublished':
    case 'cancelled':
    case 'failed':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};
