/**
 * LeetCode problem URL generator and pattern recognizer.
 * Automatically generates direct LeetCode problem URLs for any question title.
 */

export interface CuratedProblem {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export const POPULAR_LEETCODE_PROBLEMS: CuratedProblem[] = [
  { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing' },
  { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', topic: 'Arrays & Hashing' },
  { title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium', topic: 'Arrays & Hashing' },
  { title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', topic: 'Two Pointers' },
  { title: '3Sum', slug: '3sum', difficulty: 'Medium', topic: 'Two Pointers' },
  { title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers' },
  { title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', topic: 'Two Pointers' },
  { title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', topic: 'Sliding Window' },
  { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', topic: 'Sliding Window' },
  { title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', topic: 'Sliding Window' },
  { title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack' },
  { title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', topic: 'Stack' },
  { title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium', topic: 'Stack' },
  { title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', topic: 'Binary Search' },
  { title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium', topic: 'Binary Search' },
  { title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', topic: 'Binary Search' },
  { title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', topic: 'Linked List' },
  { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', topic: 'Linked List' },
  { title: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium', topic: 'Linked List' },
  { title: 'LRU Cache', slug: 'lru-cache', difficulty: 'Medium', topic: 'Linked List' },
  { title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees' },
  { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', topic: 'Trees' },
  { title: 'Same Tree', slug: 'same-tree', difficulty: 'Easy', topic: 'Trees' },
  { title: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', topic: 'Trees' },
  { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', topic: 'Trees' },
  { title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'Easy', topic: 'Trees' },
  { title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium', topic: 'Trees' },
  { title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', topic: 'Graphs' },
  { title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium', topic: 'Graphs' },
  { title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', topic: 'Graphs' },
  { title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', topic: 'Graphs' },
  { title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium', topic: 'Graphs' },
  { title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', topic: 'Dynamic Programming' },
  { title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: 'Dynamic Programming' },
  { title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: 'Dynamic Programming' },
  { title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', topic: 'Dynamic Programming' },
];

/**
 * Converts a problem title (e.g. "1. Two Sum" or "200. Number of Islands") into a LeetCode URL slug.
 */
export function generateLeetCodeSlug(rawTitle: string): string {
  if (!rawTitle) return '';

  // 1. Check if matches known curated problem
  const normalized = rawTitle.toLowerCase().trim();
  const found = POPULAR_LEETCODE_PROBLEMS.find(
    (p) => p.title.toLowerCase() === normalized || p.slug === normalized
  );
  if (found) return found.slug;

  // 2. Strip leading numbers like "1. ", "1 - ", "#1 ", "200: "
  let cleaned = rawTitle
    .replace(/^#?\s*\d+[\.\:\-\s\)\]]+/, '')
    .trim()
    .toLowerCase();

  // 3. Remove non-alphanumeric characters (keep hyphens and spaces)
  cleaned = cleaned.replace(/[^a-z0-9\s-]/g, '');

  // 4. Replace whitespace or multiple hyphens with a single hyphen
  const slug = cleaned.replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  return slug;
}

/**
 * Returns the full official LeetCode problem URL.
 */
export function getLeetCodeUrl(rawTitleOrUrl: string): string {
  if (!rawTitleOrUrl) return 'https://leetcode.com/problemset/';

  // If already a full URL, return it
  if (rawTitleOrUrl.startsWith('http://') || rawTitleOrUrl.startsWith('https://')) {
    return rawTitleOrUrl;
  }

  const slug = generateLeetCodeSlug(rawTitleOrUrl);
  if (!slug) return 'https://leetcode.com/problemset/';

  return `https://leetcode.com/problems/${slug}/`;
}

/**
 * Returns problem metadata if known, or sensible defaults.
 */
export function getProblemMetadata(title: string): {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
} {
  const slug = generateLeetCodeSlug(title);
  const matched = POPULAR_LEETCODE_PROBLEMS.find((p) => p.slug === slug);

  if (matched) {
    return {
      difficulty: matched.difficulty,
      topic: matched.topic,
      url: `https://leetcode.com/problems/${matched.slug}/`,
    };
  }

  // Guess topic from title keywords
  const lower = title.toLowerCase();
  let topic = 'General Algorithms';
  if (lower.includes('tree') || lower.includes('bst')) topic = 'Trees';
  else if (lower.includes('graph') || lower.includes('island') || lower.includes('course')) topic = 'Graphs';
  else if (lower.includes('array') || lower.includes('duplicate') || lower.includes('sum')) topic = 'Arrays & Hashing';
  else if (lower.includes('list') || lower.includes('lru')) topic = 'Linked List';
  else if (lower.includes('dp') || lower.includes('subsequence') || lower.includes('coin') || lower.includes('stair')) topic = 'Dynamic Programming';
  else if (lower.includes('search')) topic = 'Binary Search';
  else if (lower.includes('window') || lower.includes('stock')) topic = 'Sliding Window';

  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
  if (lower.includes('hard') || lower.includes('trap')) difficulty = 'Hard';
  else if (lower.includes('easy') || lower.includes('palindrome') || lower.includes('invert')) difficulty = 'Easy';

  return {
    difficulty,
    topic,
    url: slug ? `https://leetcode.com/problems/${slug}/` : 'https://leetcode.com/problemset/',
  };
}
