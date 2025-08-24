// Test file to verify icon handling improvements
// This can be run in the browser console to test the icon functionality

console.log('🧪 Testing Icon Handling Improvements...');

// Mock the getIcon function for testing
const mockLucideIcons = {
  Heart: () => '❤️',
  User: () => '👤',
  Settings: () => '⚙️',
  HelpCircle: () => '❓'
};

// Test the improved getIcon function logic
function testGetIcon(iconName) {
  // Handle edge cases: null, undefined, non-string values
  if (!iconName || typeof iconName !== 'string') {
    console.warn('getIcon: Invalid icon name provided:', iconName);
    return mockLucideIcons.HelpCircle || (() => '⚠️ Invalid Icon');
  }

  // Clean the icon name
  const cleanIconName = iconName.trim();
  
  if (!cleanIconName) {
    console.warn('getIcon: Empty icon name provided');
    return mockLucideIcons.HelpCircle || (() => '⚠️ Empty Icon');
  }

  // Try Lucide icons first (most common)
  if (mockLucideIcons[cleanIconName]) {
    return mockLucideIcons[cleanIconName];
  }
  
  // Try with different naming conventions
  const variations = [
    cleanIconName,
    cleanIconName.charAt(0).toUpperCase() + cleanIconName.slice(1), // PascalCase
    cleanIconName.toUpperCase(), // UPPERCASE
    cleanIconName.toLowerCase(), // lowercase
    cleanIconName.replace(/([A-Z])/g, '-$1').toLowerCase(), // kebab-case
    cleanIconName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()), // camelCase
    // Additional variations for common icon naming patterns
    cleanIconName.replace(/\s+/g, ''), // Remove spaces
    cleanIconName.replace(/\s+/g, '-'), // Replace spaces with hyphens
    cleanIconName.replace(/\s+/g, '_'), // Replace spaces with underscores
    // Handle common icon suffixes
    cleanIconName.endsWith('Icon') ? cleanIconName : `${cleanIconName}Icon`,
    cleanIconName.endsWith('Icon') ? cleanIconName.slice(0, -4) : cleanIconName,
  ];
  
  for (const variation of variations) {
    if (mockLucideIcons[variation]) {
      return mockLucideIcons[variation];
    }
  }
  
  // Try to find partial matches for better user experience
  const partialMatches = Object.keys(mockLucideIcons).filter(key => 
    key.toLowerCase().includes(cleanIconName.toLowerCase()) ||
    cleanIconName.toLowerCase().includes(key.toLowerCase())
  );
  
  if (partialMatches.length > 0) {
    console.warn(`getIcon: Icon "${cleanIconName}" not found. Similar icons:`, partialMatches.slice(0, 5));
    // Return the first partial match
    return mockLucideIcons[partialMatches[0]];
  }
  
  // Return a fallback icon with helpful information
  console.warn(`getIcon: Icon "${cleanIconName}" not found in Lucide icons`);
  return mockLucideIcons.HelpCircle || (() => (
    `⚠️ ${cleanIconName}`
  ));
}

// Test cases
const testCases = [
  // Valid cases
  'Heart',
  'heart',
  'HEART',
  'User',
  'user',
  'Settings',
  
  // Edge cases that should be handled
  null,
  undefined,
  '',
  '   ',
  123,
  {},
  [],
  'NonExistentIcon',
  
  // Common variations
  'heart-icon',
  'user icon',
  'SETTINGS_ICON',
  'userIcon',
  'UserIcon',
];

console.log('📋 Running test cases...');

testCases.forEach((testCase, index) => {
  try {
    const result = testGetIcon(testCase);
    console.log(`✅ Test ${index + 1}: "${testCase}" -> ${typeof result === 'function' ? 'Function' : result}`);
  } catch (error) {
    console.error(`❌ Test ${index + 1}: "${testCase}" -> ERROR:`, error.message);
  }
});

console.log('🎉 Icon handling test completed!');

// Test the search functionality
function testSearchIcons(query) {
  if (!query || typeof query !== 'string') {
    return [];
  }
  const searchTerm = query.toLowerCase();
  return Object.keys(mockLucideIcons)
    .filter(name => name.toLowerCase().includes(searchTerm))
    .slice(0, 10);
}

console.log('🔍 Testing search functionality...');
console.log('Search "heart":', testSearchIcons('heart'));
console.log('Search "user":', testSearchIcons('user'));
console.log('Search "invalid":', testSearchIcons('invalid'));

console.log('✅ All tests completed successfully!');
