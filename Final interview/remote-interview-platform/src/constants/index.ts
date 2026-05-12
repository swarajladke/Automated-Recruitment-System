import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    color: "purple-500",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
  },
];

export const CODING_QUESTIONS: CodeQuestion[] = [
  {
    id: "median-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description:
      "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Implement O(log(m+n)) solution
  
}`,
      python: `def find_median_sorted_arrays(nums1, nums2):
    # Implement O(log(m+n)) solution
    pass`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Implement O(log(m+n)) solution
        
    }
}`,
    },
    testCases: [
      { nums1: [1, 3], nums2: [2], expected: 2.0 },
      { nums1: [1, 2], nums2: [3, 4], expected: 2.5 },
      { nums1: [0, 0], nums2: [0, 0], expected: 0.0 },
      { nums1: [], nums2: [1], expected: 1.0 },
      { nums1: [2], nums2: [], expected: 2.0 }
    ]
  },
  {
    id: "trapping-rain",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Implement trapping water logic
  
}`,
      python: `def trap(height):
    # Implement trapping water logic
    pass`,
      java: `class Solution {
    public int trap(int[] height) {
        // Implement trapping water logic
        
    }
}`,
    },
    testCases: [
      { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], expected: 6 },
      { height: [4, 2, 0, 3, 2, 5], expected: 9 },
      { height: [1, 0, 1], expected: 1 },
      { height: [3, 0, 2, 0, 4], expected: 7 },
      { height: [0, 0, 0], expected: 0 }
    ]
  },
];

export const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
  { id: "python", name: "Python", icon: "/python.png" },
  { id: "java", name: "Java", icon: "/java.png" },
] as const;

export interface CodeQuestion {
  id: string;
  title: string;
  role?: string;
  difficulty?: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
  };
  testCases?: any[];
  constraints?: string[];
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number];
