import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export interface ItineraryItem {
  id: string;
  title: string;
  dayIndex: number;
  time?: string;      // Start time e.g. "10:00"
  endTime?: string;   // End time e.g. "11:30"
  duration?: string;  // Duration e.g. "1h 30m"
  notes?: string;
  location?: {
    name: string;
    formattedAddress: string;
    lat: number;
    lng: number;
  };
}

export interface ProposalComment {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  createdAt: string;
}

export interface RestaurantProposal {
  id: string;
  name: string;
  cuisine?: string;
  locationName?: string;
  lat?: number;
  lng?: number;
  date?: string;
  time?: string;
  notes?: string;
  votes: Record<string, boolean>; // userId -> true
  suggestedBy: string;
  suggestedByUid?: string;
  comments?: ProposalComment[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  days: string[];
  startDate?: string;
  endDate?: string;
  members: string[]; // uids
  invitedEmails: string[];
  ownerId: string;
  ownerName: string;
  itinerary: ItineraryItem[];
  restaurants: RestaurantProposal[];
}

export interface ChatMessage {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  createdAt: any;
  editedAt?: any;
}

export interface LivePresence {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  updatedAt: any;
}

export interface RegisteredUser {
  uid: string;
  displayName: string;
  email: string;
  color: string;
}

// Curated colors for user avatars & live cursors
export const PASTEL_COLORS = [
  '#8E9E86', // Sage Green
  '#C89B7B', // Terracotta
  '#8797A4', // Slate Blue
  '#C8B195', // Ochre
  '#A0828A', // Dusty Rose
];

export const DAY_COLORS = [
  '#8E9E86',
  '#C89B7B',
  '#8797A4',
  '#C8B195',
  '#A0828A',
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to format chat message timestamp nicely
export const formatMessageTime = (createdAt: any) => {
  if (!createdAt) return 'Just now';
  let date: Date;
  if (typeof createdAt?.toDate === 'function') {
    date = createdAt.toDate();
  } else if (createdAt?.seconds) {
    date = new Date(createdAt.seconds * 1000);
  } else if (createdAt instanceof Date) {
    date = createdAt;
  } else {
    date = new Date(createdAt);
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' • ' + date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

// Helper to format 24-hour military time string ("14:30") to 12-hour AM/PM format ("2:30 PM")
export const formatTime12Hour = (timeStr?: string) => {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  if (isNaN(hours)) return timeStr;
  const minutes = parts[1] || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatTimeRange = (time?: string, endTime?: string) => {
  if (!time && !endTime) return 'Flexible';
  if (time && endTime) {
    return `${formatTime12Hour(time)} - ${formatTime12Hour(endTime)}`;
  }
  return formatTime12Hour(time || endTime);
};
