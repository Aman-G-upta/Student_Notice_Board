export const CATEGORIES = ['Academic', 'Examination', 'Placement', 'Events', 'Fees', 'General'];

export const PRIORITIES = [
  { value: 'normal', label: 'Normal', hint: 'Regular update' },
  { value: 'important', label: 'Important', hint: 'Students should read this' },
  { value: 'urgent', label: 'Urgent', hint: 'Needs action right away' },
];

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const timeAgo = (iso) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(iso);
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

export const isImageAttachment = (attachment) =>
  Boolean(attachment) && /^(jpe?g|png|webp)$/i.test(attachment.format || '');

export const formatBytes = (bytes = 0) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
