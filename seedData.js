import { toISODateString } from '../lib/sm2.js';

export function getSeedData() {
  const today = new Date();
  const todayStr = toISODateString(today);

  // Helper for relative dates
  const addDays = (n) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + n);
    return toISODateString(d);
  };

  const yesterdayStr = addDays(-1);

  const decks = [
    {
      id: 'deck_algorithms',
      name: 'Algorithms',
      description: 'Master core algorithmic paradigms: sorting, graph traversals, dynamic programming, and asymptotic complexity.',
      category: 'Computer Science',
      icon: '⚡',
      color: '#4f46e5',
      createdAt: '2026-10-01'
    },
    {
      id: 'deck_data_structures',
      name: 'Data Structures',
      description: 'Advanced data structures: balanced search trees, heaps, disjoint-set unions, trie, and hash collisions.',
      category: 'Computer Science',
      icon: '🌲',
      color: '#059669',
      createdAt: '2026-10-05'
    },
    {
      id: 'deck_system_design',
      name: 'System Design & OS',
      description: 'Scalability architectures, CAP theorem, consistent hashing, caching strategies, and OS concurrency.',
      category: 'System Design',
      icon: '🖥️',
      color: '#d97706',
      createdAt: '2026-10-10'
    },
    {
      id: 'deck_gre_vocab',
      name: 'GRE High-Frequency Vocab',
      description: 'Crucial academic and analytical vocabulary for competitive exams with contextual sample sentences.',
      category: 'Verbal & Language',
      icon: '📚',
      color: '#7c3aed',
      createdAt: '2026-10-15'
    }
  ];

  const cards = [
    // ---------------------------------------------------------
    // ALGORITHMS DECK (5 CARDS DUE TODAY FOR DEMO SCENARIO!)
    // ---------------------------------------------------------
    {
      id: 'card_algo_1',
      deckId: 'deck_algorithms',
      question: 'What is the time complexity of QuickSort?',
      answer: `• **Best & Average Case:** $\\mathcal{O}(n \\log n)$\n• **Worst Case:** $\\mathcal{O}(n^2)$ (occurs when the chosen pivot consistently partitions the array into size 0 and $n-1$, such as an already sorted array with the leftmost/rightmost element chosen as pivot).\n• **Space Complexity:** $\\mathcal{O}(\\log n)$ recursion stack with tail-call optimization.\n• **Optimization:** Use **Randomized QuickSort** or **Median-of-Three** pivot selection to reduce worst-case probability to near zero.`,
      tags: ['Algorithms', 'Sorting', 'Complexity', 'Must-Know'],
      repetitions: 1, // Key for demo: rating 5 will advance to 6 days!
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: [
        { date: yesterdayStr, grade: 4, interval: 1, easeFactor: 2.50, repetitions: 1 }
      ]
    },
    {
      id: 'card_algo_2',
      deckId: 'deck_algorithms',
      question: 'What is the time complexity of searching in a Balanced BST (AVL / Red-Black) vs. an Unbalanced BST?',
      answer: `• **Balanced BST (AVL / Red-Black):** $\\mathcal{O}(\\log n)$ guaranteed in worst case due to self-balancing height invariant ($h \\le 1.44 \\log_2 n$ for AVL).\n• **Unbalanced BST:** $\\mathcal{O}(n)$ in worst case when items are inserted in sorted order, degenerating into a singly-linked list.\n• **Operations:** Search, Insertion, and Deletion are all $\\mathcal{O}(\\log n)$ in balanced variants.`,
      tags: ['Algorithms', 'Trees', 'Complexity'],
      repetitions: 1,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: [
        { date: yesterdayStr, grade: 3, interval: 1, easeFactor: 2.50, repetitions: 1 }
      ]
    },
    {
      id: 'card_algo_3',
      deckId: 'deck_algorithms',
      question: "Explain the difference between Dijkstra's algorithm and Bellman-Ford algorithm.",
      answer: `• **Dijkstra's Algorithm:**\n  - Greedy strategy.\n  - Non-negative edge weights only.\n  - Time: $\\mathcal{O}((V + E) \\log V)$ using Min-Heap / Priority Queue.\n• **Bellman-Ford Algorithm:**\n  - Dynamic Programming strategy (relaxes all $E$ edges $V-1$ times).\n  - Works with negative edge weights and detects negative weight cycles.\n  - Time: $\\mathcal{O}(V \\times E)$.`,
      tags: ['Algorithms', 'Graphs', 'Shortest-Path'],
      repetitions: 1,
      interval: 1,
      easeFactor: 2.45,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: [
        { date: yesterdayStr, grade: 3, interval: 1, easeFactor: 2.45, repetitions: 1 }
      ]
    },
    {
      id: 'card_algo_4',
      deckId: 'deck_algorithms',
      question: 'Compare Memoization (Top-Down) vs. Tabulation (Bottom-Up) in Dynamic Programming.',
      answer: `• **Memoization (Top-Down):**\n  - Recursively breaks down problem from target to base cases.\n  - Caches results in a hash table or array.\n  - Advantage: Computes only required subproblems.\n  - Disadvantage: Call stack overhead ($\\\\mathcal{O}(N)$ depth) can trigger stack overflow.\n• **Tabulation (Bottom-Up):**\n  - Iteratively builds solutions starting from base cases upward.\n  - Advantage: No recursion overhead, allows space-optimization (rolling variables).\n  - Disadvantage: Computes all entries in the table.`,
      tags: ['Algorithms', 'Dynamic Programming', 'Optimization'],
      repetitions: 0,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: null,
      reviewCount: 0,
      history: []
    },
    {
      id: 'card_algo_5',
      deckId: 'deck_algorithms',
      question: 'How does the Two-Pointer technique find a target pair sum in a sorted array in $\\mathcal{O}(n)$ time?',
      answer: `\`\`\`js
function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++; // Need larger sum
    else right--;                  // Need smaller sum
  }
  return null;
}
\`\`\`\n• **Time Complexity:** $\\mathcal{O}(n)$, each element is examined at most once.\n• **Space Complexity:** $\\mathcal{O}(1)$ auxiliary memory.`,
      tags: ['Algorithms', 'Two Pointers', 'Arrays'],
      repetitions: 0,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: null,
      reviewCount: 0,
      history: []
    },
    // Algorithms cards scheduled for later:
    {
      id: 'card_algo_6',
      deckId: 'deck_algorithms',
      question: "What is Floyd's Cycle-Finding Algorithm (Tortoise and Hare) and its complexities?",
      answer: `• **Concept:** Uses two pointers moving at different speeds: slow moves 1 step, fast moves 2 steps.\n• If a cycle exists, they must collide inside the cycle.\n• **Time Complexity:** $\\mathcal{O}(n)$.\n• **Space Complexity:** $\\mathcal{O}(1)$ auxiliary space.`,
      tags: ['Algorithms', 'Linked List', 'Pointers'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.60,
      nextReviewDate: addDays(4),
      lastReviewedDate: addDays(-2),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_algo_7',
      deckId: 'deck_algorithms',
      question: 'What is the Master Theorem for divide-and-conquer recurrences: $T(n) = a T(n/b) + f(n)$?',
      answer: `Compare $f(n)$ with $n^{\\log_b a}$:\n1. If $f(n) = \\mathcal{O}(n^{\\log_b a - \\epsilon})$, then $T(n) = \\Theta(n^{\\log_b a})$.\n2. If $f(n) = \\Theta(n^{\\log_b a} \\log^k n)$, then $T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n)$.\n3. If $f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ and regularity holds, then $T(n) = \\Theta(f(n))$.`,
      tags: ['Algorithms', 'Recurrences', 'Complexity'],
      repetitions: 3,
      interval: 16,
      easeFactor: 2.60,
      nextReviewDate: addDays(7),
      lastReviewedDate: addDays(-9),
      reviewCount: 3,
      history: []
    },
    {
      id: 'card_algo_8',
      deckId: 'deck_algorithms',
      question: 'What is the time complexity of Topological Sort and when is it applicable?',
      answer: `• **Applicability:** Only Directed Acyclic Graphs (DAGs). If a cycle exists, topological ordering is impossible.\n• **Algorithms:** Kahn's Algorithm (in-degree BFS) or DFS with post-order reversal.\n• **Time Complexity:** $\\mathcal{O}(V + E)$.\n• **Space Complexity:** $\\mathcal{O}(V)$ for visited array and recursion/queue.`,
      tags: ['Algorithms', 'Graphs', 'Topological Sort'],
      repetitions: 1,
      interval: 3,
      easeFactor: 2.50,
      nextReviewDate: addDays(2),
      lastReviewedDate: addDays(-1),
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_algo_9',
      deckId: 'deck_algorithms',
      question: 'Explain the difference between BFS and DFS traversal order and memory footprints.',
      answer: `• **BFS (Breadth-First Search):**\n  - Explores neighbor nodes level by level using a FIFO Queue.\n  - Finds shortest path in unweighted graphs.\n  - Memory: $\\mathcal{O}(w)$ where $w$ is maximum width of tree/graph.\n• **DFS (Depth-First Search):**\n  - Explores as deep as possible along each branch using LIFO Stack / Recursion.\n  - Memory: $\\mathcal{O}(h)$ where $h$ is maximum height / depth of recursion.`,
      tags: ['Algorithms', 'Graphs', 'Traversal'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: addDays(5),
      lastReviewedDate: addDays(-1),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_algo_10',
      deckId: 'deck_algorithms',
      question: 'How does Binary Search on Answer / Monotonic Predicate work?',
      answer: `• Applicable when a feasibility function $P(x)$ is **monotonic** (e.g. ` + '`false, false, ..., true, true`' + `).\n• We binary search the domain of possible answers $[low, high]$ rather than an array index.\n• At each step, evaluate $P(mid)$. If true, try to minimize (or maximize) further.\n• **Time Complexity:** $\\mathcal{O}(\\log(\\text{search space}) \\times \\text{cost of } P(x))$.`,
      tags: ['Algorithms', 'Binary Search', 'Technique'],
      repetitions: 1,
      interval: 4,
      easeFactor: 2.50,
      nextReviewDate: addDays(3),
      lastReviewedDate: addDays(-1),
      reviewCount: 1,
      history: []
    },

    // ---------------------------------------------------------
    // DATA STRUCTURES DECK (10 CARDS)
    // ---------------------------------------------------------
    {
      id: 'card_ds_1',
      deckId: 'deck_data_structures',
      question: 'How do Hash Maps resolve collisions: Chaining vs. Open Addressing?',
      answer: `• **Separate Chaining:** Each bucket points to a linked list (or balanced red-black tree when size exceeds 8 in Java HashMap). Allows load factor $\\alpha > 1$.\n• **Open Addressing:** All entries reside directly in the table. On collision, probe alternative slots (Linear probing, Quadratic probing, or Double hashing). Requires $\\alpha < 1$.\n• **Lookup Complexity:** $\\mathcal{O}(1)$ average, $\\mathcal{O}(n)$ worst-case.`,
      tags: ['Data Structures', 'Hash Maps', 'Collisions'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: addDays(-6),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_ds_2',
      deckId: 'deck_data_structures',
      question: 'What is the time complexity to build a Binary Heap from an unordered array of $n$ elements?',
      answer: `• **Time Complexity:** $\\mathcal{O}(n)$, NOT $\\mathcal{O}(n \\log n)$!\n• **Reasoning:** Bottom-up \`heapify\` is called on non-leaf nodes. The sum of node heights is $\\sum_{h=0}^{\\log n} \\frac{n}{2^{h+1}} \\times h = n \\sum \\frac{h}{2^{h+1}} \\le \\mathcal{O}(n)$.\n• **Insert & Extract-Min:** $\\mathcal{O}(\\log n)$ each.`,
      tags: ['Data Structures', 'Heaps', 'Complexity'],
      repetitions: 1,
      interval: 1,
      easeFactor: 2.40,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_ds_3',
      deckId: 'deck_data_structures',
      question: 'What is a Trie (Prefix Tree) and what are its operation complexities?',
      answer: `• Tree data structure used to store associative arrays where keys are usually strings.\n• Nodes share common prefixes.\n• **Search / Insert / Delete:** $\\mathcal{O}(L)$ time where $L$ is the key length, completely independent of the number of keys $N$!\n• **Space:** $\\mathcal{O}(\\Sigma \\times N \\times L)$ where $\\Sigma$ is alphabet size.`,
      tags: ['Data Structures', 'Trie', 'Strings'],
      repetitions: 3,
      interval: 15,
      easeFactor: 2.60,
      nextReviewDate: addDays(6),
      lastReviewedDate: addDays(-9),
      reviewCount: 3,
      history: []
    },
    {
      id: 'card_ds_4',
      deckId: 'deck_data_structures',
      question: 'How does Disjoint Set Union (DSU / Union-Find) achieve near $\\mathcal{O}(1)$ amortized time?',
      answer: `Through two optimizations:\n1. **Path Compression:** During \`find(x)\`, make every node on the path point directly to the root.\n2. **Union by Rank / Size:** Always attach the smaller tree under the root of the deeper tree.\n• **Amortized Time Complexity:** $\\mathcal{O}(\\alpha(n))$ where $\\alpha$ is the Inverse Ackermann function (practically $\\le 4$ for all realistic inputs).`,
      tags: ['Data Structures', 'Disjoint Set', 'Union Find'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.55,
      nextReviewDate: addDays(3),
      lastReviewedDate: addDays(-3),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_ds_5',
      deckId: 'deck_data_structures',
      question: 'Explain the difference between Array and Singly Linked List memory layout and cache locality.',
      answer: `• **Array:** Contiguous memory block. Excellent CPU cache locality (spatial locality allows pre-fetching consecutive elements into cache lines).\n• **Linked List:** Nodes scattered across heap memory connected via pointers. Poor cache locality, high cache misses, pointer memory overhead ($8$ bytes per pointer on 64-bit).`,
      tags: ['Data Structures', 'Memory', 'Cache'],
      repetitions: 4,
      interval: 28,
      easeFactor: 2.70,
      nextReviewDate: addDays(12),
      lastReviewedDate: addDays(-16),
      reviewCount: 4,
      history: []
    },
    {
      id: 'card_ds_6',
      deckId: 'deck_data_structures',
      question: 'What is a Bloom Filter and what are its guarantees regarding false positives and negatives?',
      answer: `• Space-efficient probabilistic data structure based on bit array and $k$ independent hash functions.\n• **False Positives:** Possible (might say an element IS in the set when it is not).\n• **False Negatives:** IMPOSSIBLE (if it says an element is not in the set, it is 100% definitely not in the set).\n• **Deletion:** Not supported in standard Bloom Filters (requires Counting Bloom Filter).`,
      tags: ['Data Structures', 'Probabilistic', 'Hashing'],
      repetitions: 1,
      interval: 2,
      easeFactor: 2.50,
      nextReviewDate: addDays(1),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_ds_7',
      deckId: 'deck_data_structures',
      question: 'What is an LRU (Least Recently Used) Cache and how is it implemented in $\\mathcal{O}(1)$ time?',
      answer: `• Combination of a **Hash Map** and a **Doubly Linked List**:\n  - Hash Map stores \`key -> Node\` reference for $\\mathcal{O}(1)$ lookup.\n  - Doubly Linked List maintains access recency order (most recent at head, least recent at tail).\n• **Get(key):** Lookup node in map, detach from current position, move to head: $\\mathcal{O}(1)$.\n• **Put(key, val):** Update or insert new node at head; if capacity exceeded, evict tail node and remove from map: $\\mathcal{O}(1)$.`,
      tags: ['Data Structures', 'Cache', 'LRU'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.60,
      nextReviewDate: addDays(2),
      lastReviewedDate: addDays(-4),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_ds_8',
      deckId: 'deck_data_structures',
      question: 'What is a Segment Tree and when is it preferred over a Binary Indexed Tree (Fenwick)?',
      answer: `• Binary tree used for storing intervals or segments, allowing query and update in $\\mathcal{O}(\\log n)$.\n• **Segment Tree:** Supports general range operations (Range Minimum Query, Range GCD, non-invertible operators) with lazy propagation for range updates.\n• **Fenwick Tree:** Uses less memory ($\\\\mathcal{O}(n)$ vs $\\\\mathcal{O}(4n)$) and simpler code, but primarily supports prefix invertible operations (sum, XOR).`,
      tags: ['Data Structures', 'Segment Tree', 'Range Queries'],
      repetitions: 1,
      interval: 3,
      easeFactor: 2.50,
      nextReviewDate: addDays(2),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_ds_9',
      deckId: 'deck_data_structures',
      question: 'What is an AVL Tree and what are the 4 rotation cases for re-balancing?',
      answer: `• A strictly height-balanced BST where balance factor $|height(left) - height(right)| \\le 1$.\n• **Rotations:**\n  1. **Left-Left (LL):** Single Right Rotation.\n  2. **Right-Right (RR):** Single Left Rotation.\n  3. **Left-Right (LR):** Left rotate left child, then Right rotate node.\n  4. **Right-Left (RL):** Right rotate right child, then Left rotate node.`,
      tags: ['Data Structures', 'Trees', 'AVL'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: addDays(4),
      lastReviewedDate: addDays(-2),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_ds_10',
      deckId: 'deck_data_structures',
      question: 'What is a Monotonic Stack and what type of problem does it solve in $\\mathcal{O}(n)$?',
      answer: `• A stack whose elements are always strictly monotonically increasing or decreasing.\n• **Solves:** Next Greater Element, Next Smaller Element, Largest Rectangle in Histogram, Daily Temperatures.\n• Each index is pushed once and popped at most once $\\implies \\mathcal{O}(n)$ total amortized time.`,
      tags: ['Data Structures', 'Monotonic Stack', 'Patterns'],
      repetitions: 1,
      interval: 2,
      easeFactor: 2.50,
      nextReviewDate: addDays(1),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },

    // ---------------------------------------------------------
    // SYSTEM DESIGN & OS DECK (10 CARDS)
    // ---------------------------------------------------------
    {
      id: 'card_sys_1',
      deckId: 'deck_system_design',
      question: 'What does the CAP Theorem state in distributed systems?',
      answer: `In any asynchronous network prone to partitions, a distributed data store can guarantee at most **two out of three** properties:\n• **Consistency (C):** Every read receives the most recent write or an error.\n• **Availability (A):** Every non-failing node returns a response (without guarantee that it contains the most recent write).\n• **Partition Tolerance (P):** System continues to operate despite arbitrary packet drops or network delay.\n• **Practical Reality:** Network partitions are unavoidable, so systems must choose between **CP** (e.g. HBase, Spanner) and **AP** (e.g. Cassandra, DynamoDB).`,
      tags: ['System Design', 'Distributed Systems', 'CAP'],
      repetitions: 3,
      interval: 16,
      easeFactor: 2.65,
      nextReviewDate: addDays(5),
      lastReviewedDate: addDays(-11),
      reviewCount: 3,
      history: []
    },
    {
      id: 'card_sys_2',
      deckId: 'deck_system_design',
      question: 'How does Consistent Hashing prevent widespread cache eviction during node resizing?',
      answer: `• Maps both server nodes and keys onto a circular $2^{32}-1$ hash ring.\n• A key is assigned to the first server encountered clockwise from its hash value.\n• **When adding or removing a node:** Only $\\mathcal{O}(K / N)$ keys need to be remapped on average, compared to conventional modulo hashing which remaps almost $100\\%$ of keys.\n• **Virtual Nodes (VNodes):** Multiple replicas per physical server prevent hot spots and ensure uniform load distribution.`,
      tags: ['System Design', 'Hashing', 'Distributed Systems'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: addDays(3),
      lastReviewedDate: addDays(-3),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_sys_3',
      deckId: 'deck_system_design',
      question: 'What are the 4 Coffman conditions required for a Deadlock to occur?',
      answer: `1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode.\n2. **Hold and Wait:** A process is holding at least one resource and requesting additional resources held by others.\n3. **No Preemption:** Resources cannot be forcibly confiscated; they are released only voluntarily.\n4. **Circular Wait:** A closed chain of processes exists such that each process holds at least one resource needed by the next.\n• Breaking **any one** condition eliminates deadlock risk.`,
      tags: ['Operating Systems', 'Concurrency', 'Deadlocks'],
      repetitions: 1,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_sys_4',
      deckId: 'deck_system_design',
      question: 'Compare Mutex vs. Counting Semaphore in operating systems.',
      answer: `• **Mutex (Mutual Exclusion):** Locking mechanism owned by the single thread that locked it. Only the owner thread can unlock it. Used for exclusive access to a critical section.\n• **Semaphore:** Signaling mechanism with an integer counter. Can be incremented (\`signal\` / \`V\`) or decremented (\`wait\` / \`P\`) by ANY thread. Used to control access to a pool of $N$ identical resources.`,
      tags: ['Operating Systems', 'Concurrency', 'Synchronization'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: addDays(4),
      lastReviewedDate: addDays(-2),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_sys_5',
      deckId: 'deck_system_design',
      question: 'What happens during an OS Context Switch?',
      answer: `1. CPU switches from user mode to kernel mode via interrupt or system call.\n2. Saves current process state (program counter, CPU registers, stack pointer) into its Process Control Block (PCB).\n3. Updates PCB state (e.g. running -> ready/waiting).\n4. Scheduler chooses next process from ready queue.\n5. Restores register context and virtual memory page tables of new process (TLB cache is flushed if processes belong to different address spaces).\n6. CPU resumes execution in new process context.`,
      tags: ['Operating Systems', 'Processes', 'Kernel'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.55,
      nextReviewDate: addDays(2),
      lastReviewedDate: addDays(-4),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_sys_6',
      deckId: 'deck_system_design',
      question: 'What is Virtual Memory and what is a Translation Lookaside Buffer (TLB)?',
      answer: `• **Virtual Memory:** Memory management capability providing each process with an isolated contiguous virtual address space, mapped to physical RAM via page tables.\n• **TLB:** Hardware cache inside the CPU MMU that caches recent virtual-to-physical address translations.\n• **TLB Hit:** Address translated in 1 clock cycle.\n• **TLB Miss:** CPU must walk hierarchical multi-level page table in physical memory (slow).`,
      tags: ['Operating Systems', 'Memory', 'Hardware'],
      repetitions: 1,
      interval: 3,
      easeFactor: 2.50,
      nextReviewDate: addDays(2),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_sys_7',
      deckId: 'deck_system_design',
      question: 'Compare Caching Strategies: Cache-Aside vs. Write-Through vs. Write-Behind.',
      answer: `• **Cache-Aside (Lazy Loading):** Application queries cache first. On miss, queries DB and populates cache. Writes go directly to DB, invalidating cache.\n• **Write-Through:** Application writes to cache, and cache synchronously writes to DB before acknowledging. Strong consistency, higher write latency.\n• **Write-Behind (Write-Back):** Application writes to cache, which acknowledges immediately and asynchronously flushes writes to DB in batches. Very high write throughput, risk of data loss on crash.`,
      tags: ['System Design', 'Caching', 'Architecture'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.60,
      nextReviewDate: addDays(4),
      lastReviewedDate: addDays(-2),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_sys_8',
      deckId: 'deck_system_design',
      question: 'What is Database Sharding vs. Read Replicas?',
      answer: `• **Read Replicas:** Primary DB handles writes; multiple follower replicas stream replication logs to handle read-heavy traffic. Bound by primary write capacity.\n• **Sharding (Horizontal Partitioning):** Divides a large database into smaller, independent databases across multiple servers based on a shard key (e.g. hash of \`user_id\`). Scales both read AND write throughput linearly, but makes cross-shard joins and transactions complex.`,
      tags: ['System Design', 'Databases', 'Scalability'],
      repetitions: 3,
      interval: 16,
      easeFactor: 2.65,
      nextReviewDate: addDays(8),
      lastReviewedDate: addDays(-8),
      reviewCount: 3,
      history: []
    },
    {
      id: 'card_sys_9',
      deckId: 'deck_system_design',
      question: 'What is the role of a Reverse Proxy vs. a Forward Proxy?',
      answer: `• **Forward Proxy:** Sits in front of client devices. Hides client identity, enforces corporate firewalls, and caches outbound requests (e.g. internal university network).\n• **Reverse Proxy:** Sits in front of backend web servers. Hides server IP, terminates SSL/TLS, balances load, provides DDoS mitigation, and caches static assets (e.g. NGINX, Cloudflare).`,
      tags: ['System Design', 'Networking', 'Security'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.50,
      nextReviewDate: addDays(3),
      lastReviewedDate: addDays(-3),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_sys_10',
      deckId: 'deck_system_design',
      question: 'Explain the difference between Optimistic vs. Pessimistic Locking.',
      answer: `• **Pessimistic Locking:** Assumes conflicts will happen. Locks the record on read (\`SELECT ... FOR UPDATE\`). Other transactions wait until lock is released. High integrity, lower concurrency.\n• **Optimistic Locking:** Assumes conflicts are rare. Does not lock on read. Uses a version number or timestamp column. On update: \`WHERE id = ? AND version = ?\`. If version changed, transaction rolls back and retries. Higher concurrency.`,
      tags: ['System Design', 'Databases', 'Transactions'],
      repetitions: 1,
      interval: 2,
      easeFactor: 2.50,
      nextReviewDate: addDays(1),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },

    // ---------------------------------------------------------
    // GRE HIGH-FREQUENCY VOCAB DECK (10 CARDS)
    // ---------------------------------------------------------
    {
      id: 'card_gre_1',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Aberration"?',
      answer: `• **Part of Speech:** Noun\n• **Definition:** A departure from what is normal, usual, or expected, typically an unwelcome one.\n• **Synonyms:** Anomaly, divergence, deviation, peculiarity.\n• **Example:** *The sudden spike in server response times was an aberration caused by a scheduled background data migration.*`,
      tags: ['GRE Vocab', 'Nouns', 'High-Frequency'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.60,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: addDays(-6),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_gre_2',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Ephemeral"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Lasting for a very short time; fleeting or transient.\n• **Synonyms:** Evanescent, fleeting, momentary, short-lived.\n• **Example:** *Fame in the social media era is notoriously ephemeral, whereas foundational scientific breakthroughs endure for centuries.*`,
      tags: ['GRE Vocab', 'Adjectives', 'High-Frequency'],
      repetitions: 1,
      interval: 1,
      easeFactor: 2.50,
      nextReviewDate: todayStr, // Due today!
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_gre_3',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Taciturn"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Reserved or uncommunicative in speech; saying little.\n• **Synonyms:** Reticent, laconic, untalkative, quiet.\n• **Antonyms:** Loquacious, garrulous, verbose.\n• **Example:** *The lead engineer was famously taciturn in sprint meetings, speaking only when a fundamental architecture flaw was overlooked.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 1,
      interval: 2,
      easeFactor: 2.50,
      nextReviewDate: addDays(1),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_gre_4',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Ubiquitous"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Present, appearing, or found everywhere simultaneously.\n• **Synonyms:** Omnipresent, pervasive, universal.\n• **Example:** *Smartphones and high-speed cellular networks have become ubiquitous even in remote agrarian villages.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 3,
      interval: 16,
      easeFactor: 2.70,
      nextReviewDate: addDays(7),
      lastReviewedDate: addDays(-9),
      reviewCount: 3,
      history: []
    },
    {
      id: 'card_gre_5',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Anachronistic"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Belonging or appropriate to a period other than that in which it exists, especially conspicuously old-fashioned.\n• **Synonyms:** Outmoded, archaic, obsolete, chronological error.\n• **Example:** *Relying on manual spreadsheets for real-time inventory management felt hopelessly anachronistic in a modern cloud datacenter.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.55,
      nextReviewDate: addDays(3),
      lastReviewedDate: addDays(-3),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_gre_6',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Equivocate"?',
      answer: `• **Part of Speech:** Verb\n• **Definition:** Use ambiguous language so as to conceal the truth or avoid committing oneself.\n• **Synonyms:** Prevaricate, hedge, vacillate, beat around the bush.\n• **Example:** *When pressed about when the delayed feature would ship, the product manager continued to equivocate without committing to a date.*`,
      tags: ['GRE Vocab', 'Verbs'],
      repetitions: 1,
      interval: 3,
      easeFactor: 2.45,
      nextReviewDate: addDays(2),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_gre_7',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Mellifluous"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** (Of a voice or words) sweet or musical; pleasant to hear.\n• **Synonyms:** Dulcet, euphonious, honeyed, harmonic.\n• **Example:** *Her mellifluous delivery captivated the symposium audience, making dense statistical mechanics enjoyable to follow.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.60,
      nextReviewDate: addDays(4),
      lastReviewedDate: addDays(-2),
      reviewCount: 2,
      history: []
    },
    {
      id: 'card_gre_8',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Perspicacious"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Having a ready insight into and understanding of things; perceptive.\n• **Synonyms:** Discerning, astute, shrewd, acute.\n• **Example:** *The perspicacious code reviewer spotted a subtle race condition that had evaded automated unit testing.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 1,
      interval: 2,
      easeFactor: 2.50,
      nextReviewDate: addDays(1),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_gre_9',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Pugnacious"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Eager or quick to argue, quarrel, or fight.\n• **Synonyms:** Combative, belligerent, contentious, truculent.\n• **Example:** *His pugnacious demeanor during code reviews alienated junior engineers who were eager for constructive guidance.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 1,
      interval: 4,
      easeFactor: 2.50,
      nextReviewDate: addDays(3),
      lastReviewedDate: yesterdayStr,
      reviewCount: 1,
      history: []
    },
    {
      id: 'card_gre_10',
      deckId: 'deck_gre_vocab',
      question: 'What is the definition and usage of "Salubrious"?',
      answer: `• **Part of Speech:** Adjective\n• **Definition:** Health-giving; healthy or pleasant.\n• **Synonyms:** Wholesome, beneficial, invigorating, salutary.\n• **Example:** *Regular walking intervals and ergonomic seating provide salubrious benefits for software developers spending long hours at terminals.*`,
      tags: ['GRE Vocab', 'Adjectives'],
      repetitions: 2,
      interval: 6,
      easeFactor: 2.65,
      nextReviewDate: addDays(5),
      lastReviewedDate: addDays(-1),
      reviewCount: 2,
      history: []
    }
  ];

  // User initial profile
  // Note: Streak starts at 6 days (last study date yesterday).
  // Once the user completes cards today, streak becomes 7 days, unlocking the 7-day badge!
  const user = {
    id: 'user_alex_chen',
    name: 'Alex Chen (You)',
    avatar: '👨‍💻',
    university: 'MIT CS Cohort',
    streak: 6,
    lastStudyDate: yesterdayStr,
    totalReviews: 138,
    retentionPoints: 2450, // Starts at 2450 (Rank #3, close behind Maya Patel at 2520)
    badges: [
      { id: 'first_spark', name: 'First Spark', icon: '⚡', description: 'Completed your first SM-2 review session', unlockedAt: '2026-11-14' },
      { id: 'three_day_streak', name: '3-Day Fire', icon: '🔥', description: 'Maintained a 3-day daily review streak', unlockedAt: '2026-11-16' }
    ]
  };

  // Mock Campus Cohort Leaderboard
  const leaderboard = [
    {
      id: 'user_sofia',
      name: 'Sofia Rodriguez',
      avatar: '👩‍🔬',
      university: 'MIT EECS',
      streak: 14,
      totalReviews: 182,
      retentionPoints: 2890,
      badge: '🏆 Top Scholar'
    },
    {
      id: 'user_maya',
      name: 'Maya Patel',
      avatar: '👩‍💻',
      university: 'UC Berkeley',
      streak: 6,
      totalReviews: 145,
      retentionPoints: 2520, // Alex Chen will pass 2520 during today's session!
      badge: '🥈 Silver Master'
    },
    {
      id: 'user_alex_chen',
      name: 'Alex Chen (You)',
      avatar: '👨‍💻',
      university: 'MIT CS Cohort',
      streak: 6,
      totalReviews: 138,
      retentionPoints: 2450,
      badge: '🥉 Bronze Scholar'
    },
    {
      id: 'user_david',
      name: 'David Kim',
      avatar: '👨‍🎓',
      university: 'Stanford Univ',
      streak: 5,
      totalReviews: 126,
      retentionPoints: 2340,
      badge: '⭐ Consistent'
    },
    {
      id: 'user_priya',
      name: 'Priya Sharma',
      avatar: '👩‍🏫',
      university: 'Carnegie Mellon',
      streak: 8,
      totalReviews: 114,
      retentionPoints: 2190,
      badge: '🔥 On Fire'
    },
    {
      id: 'user_liam',
      name: 'Liam O’Connor',
      avatar: '🧑‍💻',
      university: 'Georgia Tech',
      streak: 4,
      totalReviews: 98,
      retentionPoints: 1980,
      badge: '🚀 Rising'
    },
    {
      id: 'user_wei',
      name: 'Zhang Wei',
      avatar: '🧑‍🎓',
      university: 'Tsinghua Univ',
      streak: 7,
      totalReviews: 92,
      retentionPoints: 1850,
      badge: '📘 Diligent'
    },
    {
      id: 'user_elena',
      name: 'Elena Rostova',
      avatar: '👩‍💻',
      university: 'ETH Zürich',
      streak: 3,
      totalReviews: 84,
      retentionPoints: 1720,
      badge: '⚡ Sprinter'
    }
  ];

  return { decks, cards, user, leaderboard };
}
