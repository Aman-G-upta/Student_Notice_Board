// Always coerce input to a trimmed string (blocks NoSQL operator injection like {"$gt": ""}).
const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { clean, escapeRegex };
