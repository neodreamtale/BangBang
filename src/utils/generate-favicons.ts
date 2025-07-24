// 创建不同尺寸的 Hammer favicon

// 16x16 favicon (小尺寸)
const favicon16 = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <rect width="100%" height="100%" fill="white" rx="2" stroke="none"/>
  <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
  <path d="M17.64 15 22 10.64"/>
  <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>
</svg>`;

// 32x32 favicon (标准尺寸)
const favicon32 = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="100%" height="100%" fill="white" rx="4" stroke="none"/>
  <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
  <path d="M17.64 15 22 10.64"/>
  <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>
</svg>`;

// Apple Touch Icon (180x180)
const appleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect width="100%" height="100%" fill="white" rx="20" stroke="none"/>
  <g transform="translate(2, 2) scale(0.833)">
    <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
    <path d="M17.64 15 22 10.64"/>
    <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>
  </g>
</svg>`;

console.log('16x16 Favicon:');
console.log(`data:image/svg+xml,${encodeURIComponent(favicon16)}`);

console.log('\n32x32 Favicon:');
console.log(`data:image/svg+xml,${encodeURIComponent(favicon32)}`);

console.log('\nApple Touch Icon:');
console.log(`data:image/svg+xml,${encodeURIComponent(appleIcon)}`);

export { favicon16, favicon32, appleIcon };
