import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  auth, 
  db, 
  googleProvider 
} from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { COLLECTIONS } from './lib/paths';
import { Compass } from 'lucide-react';
import L from 'leaflet';

import type {
  ItineraryItem,
  Trip,
  ChatMessage,
  LivePresence,
  RegisteredUser
} from './types';
import {
  PASTEL_COLORS,
  DAY_COLORS,
  formatTime12Hour,
  formatTimeRange
} from './types';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import TripPlanner from './components/TripPlanner';
import SpotCard from './components/SpotCard';
import ItineraryList from './components/ItineraryList';
import MapContainer from './components/MapContainer';
import ReviewSection from './components/ReviewSection';
import InviteModal from './components/InviteModal';
import ExportSummaryModal from './components/ExportSummaryModal';
import DatePickerModal from './components/DatePickerModal';
import EditTripModal from './components/EditTripModal';
import EditActivityModal from './components/EditActivityModal';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSaveDisplayNameDirect = async (newName: string) => {
    if (!newName.trim() || !user) return;
    const clean = newName.trim();
    setDisplayName(clean);
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        displayName: clean,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to auto-save display name:", err);
    }
  };
  const [userColor, setUserColor] = useState('');
  const [isShowingAuthModal, setIsShowingAuthModal] = useState(false);

  // App state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [showCreateTrip, setShowCreateTrip] = useState(false);

  useEffect(() => {
    if (activeTrip && activeTrip.title) {
      document.title = `WayfarerHub | ${activeTrip.title}`;
    } else {
      document.title = "WayfarerHub";
    }
  }, [activeTrip]);
  
  // Registered users for search & invite
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Create trip form state
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDesc, setNewTripDesc] = useState('');
  const [newTripDaysCount, setNewTripDaysCount] = useState(3);
  const [newTripStartDate, setNewTripStartDate] = useState('');
  const [newTripEndDate, setNewTripEndDate] = useState('');

  // Active trip sub-state
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [presenceList, setPresenceList] = useState<LivePresence[]>([]);

  // Map & autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDayIndex, setNewItemDayIndex] = useState(0);
  const [newItemTime, setNewItemTime] = useState('10:00');
  const [newItemEndTime, setNewItemEndTime] = useState('11:30');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Custom Place & Address Lookup state
  const [placeInputMode, setPlaceInputMode] = useState<'search' | 'custom'>('search');
  const [customPlaceName, setCustomPlaceName] = useState('');
  const [customPlaceAddress, setCustomPlaceAddress] = useState('');
  const [customAddressResults, setCustomAddressResults] = useState<any[]>([]);
  const [customAddressLoading, setCustomAddressLoading] = useState(false);
  const [selectedCustomAddress, setSelectedCustomAddress] = useState<any | null>(null);

  // Custom Scandinavian Date Picker state
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end' | null>(null);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = useState<number>(new Date().getMonth());

  // Activity Editing state
  const [editingActivity, setEditingActivity] = useState<ItineraryItem | null>(null);

  // Trip Title/Description Editing state
  const [isEditingTripModalOpen, setIsEditingTripModalOpen] = useState(false);
  const [editTripTitle, setEditTripTitle] = useState('');
  const [editTripDesc, setEditTripDesc] = useState('');

  // Group Chat Editing state
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatText, setEditingChatText] = useState('');

  // Compiled Itinerary markdown modal state
  const [compiledMarkdown, setCompiledMarkdown] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);

  // Tab navigation in Trip Room: itinerary | route | chat
  const [activeTab, setActiveTab] = useState<'itinerary' | 'route' | 'chat'>('itinerary');
  const [highlightedActivityId, setHighlightedActivityId] = useState<string | null>(null);

  // Helper to parse current URL route (/trip/:tripId/:tab)
  const getRouteFromUrl = useCallback(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/trip\/([^\/]+)(?:\/(itinerary|route|chat))?/);
    if (match) {
      return {
        tripId: match[1],
        tab: (match[2] as 'itinerary' | 'route' | 'chat') || 'itinerary'
      };
    }
    return { tripId: null, tab: 'itinerary' as const };
  }, []);

  // Declarative navigation helpers that synchronize active trip/tab state with window URL
  const navigateToTrip = useCallback((trip: Trip | null, tab: 'itinerary' | 'route' | 'chat' = 'itinerary') => {
    setActiveTrip(trip);
    setActiveTab(tab);
    if (trip) {
      const targetPath = `/trip/${trip.id}/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tripId: trip.id, tab }, '', targetPath);
      }
    } else {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState(null, '', '/');
      }
    }
  }, []);

  const navigateToTab = useCallback((tab: 'itinerary' | 'route' | 'chat') => {
    setActiveTab(tab);
    if (activeTrip) {
      const targetPath = `/trip/${activeTrip.id}/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tripId: activeTrip.id, tab }, '', targetPath);
      }
    }
  }, [activeTrip]);

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const lastPresenceUpdate = useRef<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const addressSearchTimeoutRef = useRef<any>(null);

  // Sync state from URL only on initial trip list load and browser back/forward buttons (popstate)
  useEffect(() => {
    const handleUrlSync = () => {
      const { tripId, tab } = getRouteFromUrl();
      if (tripId && trips.length > 0) {
        const foundTrip = trips.find(t => t.id === tripId);
        if (foundTrip) {
          setActiveTrip(foundTrip);
          setActiveTab(tab);
        } else {
          setActiveTrip(null);
          if (window.location.pathname !== '/') {
            window.history.replaceState(null, '', '/');
          }
        }
      } else if (!tripId && activeTrip) {
        setActiveTrip(null);
      }
    };

    handleUrlSync();

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [trips, getRouteFromUrl, activeTrip]);

  // Clear highlighted activity pulse after 3 seconds
  useEffect(() => {
    if (highlightedActivityId) {
      const timer = setTimeout(() => setHighlightedActivityId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedActivityId]);

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        const userDocRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const profile = userSnap.data();
          setDisplayName(profile.displayName || 'Traveler');
          setUserColor(profile.color || PASTEL_COLORS[0]);
        } else {
          // Initialize default profile
          const initialColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
          const initialName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Traveler';
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: initialName,
            color: initialColor,
            createdAt: serverTimestamp()
          });
          setDisplayName(initialName);
          setUserColor(initialColor);
        }
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Real-time listener for Registered Users to enable Account-based Friend Search
  useEffect(() => {
    if (!user) {
      setRegisteredUsers([]);
      return;
    }
    const unsub = onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      const list: RegisteredUser[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ uid: docSnap.id, ...docSnap.data() } as RegisteredUser);
      });
      setRegisteredUsers(list);
    });
    return () => unsub();
  }, [user]);

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setIsShowingAuthModal(false);
    } catch (err: any) {
      const code = err.code || '';
      let msg = err.message || 'Authentication failed';
      if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
        msg = 'User not found. Please sign up.';
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid email or password. Please try again or register a new account.';
      } else if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
        msg = 'Please enter a valid email address.';
      } else if (code === 'auth/weak-password' || msg.includes('weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
      setIsShowingAuthModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed');
    }
  };

  const handleSignOut = async () => {
    if (user && activeTrip) {
      try {
        await deleteDoc(doc(db, COLLECTIONS.PRESENCE, user.uid));
      } catch (e) {}
    }
    navigateToTrip(null);
    signOut(auth);
  };

  // Listen to Trips List for User
  useEffect(() => {
    if (!user) {
      setTrips([]);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.TRIPS),
      where('members', 'array-contains', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Trip[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Trip);
      });
      setTrips(list);
      
      if (activeTrip) {
        const updatedActive = list.find(t => t.id === activeTrip.id);
        if (updatedActive) setActiveTrip(updatedActive);
      }
    });

    return () => unsub();
  }, [user, activeTrip?.id]);

  // Listen to messages for Active Trip
  useEffect(() => {
    if (!activeTrip) {
      setChats([]);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('tripId', '==', activeTrip.id)
    );

    const unsub = onSnapshot(
      q, 
      (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        // Sort client-side safely by createdAt timestamp
        list.sort((a, b) => {
          const getMillis = (val: any) => {
            if (!val) return Date.now();
            if (val.toMillis) return val.toMillis();
            if (val.seconds) return val.seconds * 1000;
            if (typeof val === 'number') return val;
            return Date.now();
          };
          return getMillis(a.createdAt) - getMillis(b.createdAt);
        });
        setChats(list);
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 50);
      },
      (error) => {
        console.warn("Chats snapshot listener error:", error);
      }
    );

    return () => unsub();
  }, [activeTrip?.id]);

  // Listen to Presence in active room
  useEffect(() => {
    if (!activeTrip || !user) {
      setPresenceList([]);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.PRESENCE),
      where('tripId', '==', activeTrip.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: LivePresence[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.id !== user.uid) {
          list.push({ id: docSnap.id, ...docSnap.data() } as LivePresence);
        }
      });
      setPresenceList(list);
    });

    return () => unsub();
  }, [activeTrip?.id, user]);

  // Handle Leaflet Map Initialization and Route Polyline drawing
  useEffect(() => {
    let timerId: any = null;
    if (activeTab === 'route' && mapContainerRef.current) {
      timerId = setTimeout(() => {
        if (!mapContainerRef.current) return;

        if (leafletMap.current) {
          leafletMap.current.remove();
          leafletMap.current = null;
          markersLayer.current = null;
        }

        leafletMap.current = L.map(mapContainerRef.current, {
          center: [59.3293, 18.0686],
          zoom: 12,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CartoDB',
          className: 'scandi-map-tiles'
        }).addTo(leafletMap.current);

        L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);
        markersLayer.current = L.layerGroup().addTo(leafletMap.current);

        // Render markers & polylines
        if (markersLayer.current && activeTrip?.itinerary) {
          markersLayer.current.clearLayers();
          const bounds: L.LatLngExpression[] = [];

          // Sort items by day and time for polyline order
          const sortedItinerary = [...activeTrip.itinerary].sort((a, b) => {
            if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
            return (a.time || '23:59').localeCompare(b.time || '23:59');
          });

          const routePolylineCoords: L.LatLngExpression[] = [];

          sortedItinerary.forEach((item) => {
            if (item.location && item.location.lat && item.location.lng) {
              const pos: L.LatLngExpression = [item.location.lat, item.location.lng];
              bounds.push(pos);
              routePolylineCoords.push(pos);
            }
          });

          // Group activities by exact location key (lat,lng)
          const locationGroups = new Map<string, Array<{ item: ItineraryItem; origIdx: number }>>();

          sortedItinerary.forEach((item, idx) => {
            if (item.location && item.location.lat && item.location.lng) {
              const locKey = `${item.location.lat.toFixed(5)},${item.location.lng.toFixed(5)}`;
              if (!locationGroups.has(locKey)) {
                locationGroups.set(locKey, []);
              }
              locationGroups.get(locKey)!.push({ item, origIdx: idx });
            }
          });

          // Render one marker per location group at the EXACT coordinate
          locationGroups.forEach((group) => {
            const firstItem = group[0].item;
            if (firstItem.location && firstItem.location.lat && firstItem.location.lng) {
              const pos: L.LatLngExpression = [firstItem.location.lat, firstItem.location.lng];
              const isMultiAtLoc = group.length > 1;
              const mainColor = DAY_COLORS[firstItem.dayIndex % DAY_COLORS.length];

              const markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="scandi-map-marker" style="background-color: ${mainColor}">${group[0].origIdx + 1}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });

              // Construct popup with in-focus activity switcher if multiple activities exist
              let popupHtml = `<div style="font-family: 'Inter', sans-serif; padding: 4px; width: 230px;">`;

              if (isMultiAtLoc) {
                popupHtml += `
                  <div style="font-size: 11px; font-weight: 700; color: var(--primary-text); margin-bottom: 6px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="display: flex; align-items: center; gap: 4px;">📍 ${firstItem.location.name}</span>
                    <span style="font-size: 9px; background: var(--accent-sage-light); color: var(--primary-text); padding: 1px 6px; border-radius: 8px;">${group.length} activities</span>
                  </div>
                  <!-- Switcher tabs for activities at this location -->
                  <div style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px dashed var(--border-color);">
                `;
                group.forEach(({ origIdx }, subIdx) => {
                  popupHtml += `
                    <button 
                      class="popup-act-tab ${subIdx === 0 ? 'active-tab' : ''}" 
                      data-sub-index="${subIdx}"
                      style="padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 10px; border: 1px solid var(--border-color); background: ${subIdx === 0 ? 'var(--primary-text)' : 'var(--bg-color)'}; color: ${subIdx === 0 ? 'var(--bg-color)' : 'var(--secondary-text)'}; cursor: pointer; white-space: nowrap;"
                    >
                      #${origIdx + 1}
                    </button>
                  `;
                });
                popupHtml += `</div>`;
              }

              // Activity Cards
              group.forEach(({ item: gItem, origIdx: gIdx }, subIdx) => {
                const gColor = DAY_COLORS[gItem.dayIndex % DAY_COLORS.length];
                popupHtml += `
                  <div class="popup-act-card" data-sub-index="${subIdx}" style="display: ${subIdx === 0 ? 'block' : 'none'};">
                    <span style="font-size: 10px; font-weight: 700; color: ${gColor}; text-transform: uppercase;">#${gIdx + 1} • Day ${gItem.dayIndex + 1} • ${gItem.time ? formatTime12Hour(gItem.time) : 'Flexible'}</span>
                    <h4 style="font-family: 'Playfair Display', serif; font-size: 14px; margin-top: 2px; margin-bottom: 4px; color: var(--primary-text);">${gItem.title}</h4>
                    ${gItem.location ? `<div style="font-size: 11px; color: var(--secondary-text); margin-bottom: 4px;">📍 ${gItem.location.name}</div>` : ''}
                    ${gItem.notes ? `<div style="font-size: 10px; color: var(--secondary-text); background: var(--bg-color); padding: 4px 6px; border-radius: 6px;">${gItem.notes}</div>` : ''}
                  </div>
                `;
              });

              popupHtml += `</div>`;

              const marker = L.marker(pos, { icon: markerIcon }).bindPopup(popupHtml);
              markersLayer.current?.addLayer(marker);
            }
          });

          // Handle click events on popup switcher tabs
          if (leafletMap.current) {
            leafletMap.current.off('popupopen');
            leafletMap.current.on('popupopen', (e) => {
              const container = e.popup.getElement();
              if (container) {
                // Tab switcher logic for multi-activity popup
                const tabs = container.querySelectorAll('.popup-act-tab');
                const cards = container.querySelectorAll('.popup-act-card');
                tabs.forEach((tabBtn) => {
                  tabBtn.addEventListener('click', (evt) => {
                    const targetSubIdx = (evt.currentTarget as HTMLElement).getAttribute('data-sub-index');
                    tabs.forEach((t) => {
                      (t as HTMLElement).style.backgroundColor = 'var(--bg-color)';
                      (t as HTMLElement).style.color = 'var(--secondary-text)';
                    });
                    (evt.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-text)';
                    (evt.currentTarget as HTMLElement).style.color = 'var(--bg-color)';

                    cards.forEach((c) => {
                      if ((c as HTMLElement).getAttribute('data-sub-index') === targetSubIdx) {
                        (c as HTMLElement).style.display = 'block';
                      } else {
                        (c as HTMLElement).style.display = 'none';
                      }
                    });
                  });
                });
              }
            });
          }

          // Draw route connection line if multiple coordinates exist
          if (routePolylineCoords.length > 1) {
            const polyline = L.polyline(routePolylineCoords, {
              color: 'var(--accent-sage)',
              weight: 3,
              opacity: 0.8,
              dashArray: '6, 6'
            });
            markersLayer.current.addLayer(polyline);
          }

          if (bounds.length > 0 && leafletMap.current) {
            leafletMap.current.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
          }
        }
        leafletMap.current?.invalidateSize();
      }, 100);
    } else {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersLayer.current = null;
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersLayer.current = null;
      }
    };
  }, [activeTrip?.id, activeTab, activeTrip?.itinerary]);

  // Track cursor movement for live collaboration presence
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!user || !activeTrip || !roomContainerRef.current) return;
    
    const now = Date.now();
    if (now - lastPresenceUpdate.current > 150) {
      lastPresenceUpdate.current = now;
      const rect = roomContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setDoc(doc(db, COLLECTIONS.PRESENCE, user.uid), {
        tripId: activeTrip.id,
        userId: user.uid,
        userName: displayName,
        userColor: userColor || PASTEL_COLORS[0],
        x,
        y,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }
  };

  // Chat message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeTrip) return;

    try {
      await addDoc(collection(db, COLLECTIONS.CHATS), {
        tripId: activeTrip.id,
        userId: user.uid,
        userName: displayName,
        userColor: userColor || PASTEL_COLORS[0],
        text: newMessage.trim(),
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Create trip handler
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim() || !user) return;

    try {
      let daysArray: string[] = [];
      if (newTripStartDate && newTripEndDate) {
        const start = new Date(newTripStartDate);
        const end = new Date(newTripEndDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
          const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          daysArray = Array.from({ length: diffDays }, (_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return `Day ${i + 1} (${dateStr})`;
          });
        }
      }
      if (daysArray.length === 0) {
        daysArray = Array.from({ length: newTripDaysCount }, (_, i) => `Day ${i + 1}`);
      }

      const tripData: any = {
        title: newTripTitle.trim(),
        description: newTripDesc.trim(),
        days: daysArray,
        members: [user.uid],
        invitedEmails: user.email ? [user.email.toLowerCase()] : [],
        ownerId: user.uid,
        ownerName: displayName,
        itinerary: [],
        restaurants: [],
        createdAt: serverTimestamp()
      };
      if (newTripStartDate) tripData.startDate = newTripStartDate;
      if (newTripEndDate) tripData.endDate = newTripEndDate;

      const docRef = await addDoc(collection(db, COLLECTIONS.TRIPS), tripData);
      navigateToTrip({ id: docRef.id, ...tripData } as Trip);
      setNewTripTitle('');
      setNewTripDesc('');
      setNewTripStartDate('');
      setNewTripEndDate('');
      setShowCreateTrip(false);
      setSuccessMsg('Journey created successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create trip');
    }
  };

  // Invite member by searching existing registered user accounts
  const handleInviteFriend = async (friendUid: string, friendEmail: string) => {
    if (!activeTrip || !user) return;
    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      await updateDoc(tripRef, {
        members: arrayUnion(friendUid),
        invitedEmails: friendEmail ? arrayUnion(friendEmail.toLowerCase()) : arrayUnion(friendUid)
      });
      setSuccessMsg(`Friend invited! Access granted to this private trip.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to invite friend');
    }
  };

  // Remove member from trip (Creator only)
  const handleRemoveMember = async (memberUid: string) => {
    if (!activeTrip || !user || activeTrip.ownerId !== user.uid) return;
    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      await updateDoc(tripRef, {
        members: arrayRemove(memberUid)
      });
      setSuccessMsg(`Member removed.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove member');
    }
  };

  // Update trip start and end dates
  const handleUpdateTripDates = async (startDate: string, endDate: string) => {
    if (!activeTrip) return;
    try {
      let newDays = [...activeTrip.days];
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
          const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          newDays = Array.from({ length: diffDays }, (_, i) => {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return `Day ${i + 1} (${dateStr})`;
          });
        }
      }
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      const updates: any = { startDate, endDate, days: newDays };
      await updateDoc(tripRef, updates);
      setActiveTrip({ ...activeTrip, startDate, endDate, days: newDays });
      setSuccessMsg('Trip dates updated!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err: any) {
      console.error("Failed to update trip dates:", err);
      setErrorMsg("Failed to update trip dates");
    }
  };

  // Location search handler using direct client geocoding & curated destination database
  const handleSearchLocations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResults([]);
    setSelectedSpot(null);

    const query = searchQuery.trim().toLowerCase();

    try {
      const CURATED: Record<string, any[]> = {
        stockholm: [
          { name: "Gamla Stan", category: "Sightseeing", lat: 59.3257, lng: 18.0719, rating: 4.8, description: "Historical colorful old town with cobbled streets.", formattedAddress: "Gamla Stan, Stockholm" },
          { name: "Fotografiska", category: "Museum", lat: 59.3179, lng: 18.0863, rating: 4.6, description: "Contemporary photography museum and cafe.", formattedAddress: "Fotografiska, Stockholm" },
          { name: "Rosendals Trädgård", category: "Cafe", lat: 59.3281, lng: 18.1186, rating: 4.7, description: "Beautiful organic orchard and greenhouse cafe.", formattedAddress: "Rosendals Trädgård, Stockholm" },
          { name: "Djurgården", category: "Park", lat: 59.3269, lng: 18.1251, rating: 4.9, description: "Tranquil green island perfect for afternoon walks.", formattedAddress: "Djurgården, Stockholm" }
        ],
        copenhagen: [
          { name: "Nyhavn", category: "Sightseeing", lat: 55.6799, lng: 12.5898, rating: 4.7, description: "Iconic 17th-century waterfront and townhouses.", formattedAddress: "Nyhavn, Copenhagen" },
          { name: "Tivoli Gardens", category: "Park", lat: 55.6737, lng: 12.5683, rating: 4.8, description: "Historic amusement park with fairy-tale lights.", formattedAddress: "Tivoli Gardens, Copenhagen" }
        ],
        reykjavik: [
          { name: "Hallgrímskirkja", category: "Sightseeing", lat: 64.1417, lng: -21.9266, rating: 4.7, description: "Basalt-column inspired Lutheran church.", formattedAddress: "Hallgrímskirkja, Reykjavik" },
          { name: "Blue Lagoon", category: "Sightseeing", lat: 63.8792, lng: -22.4451, rating: 4.8, description: "Geothermal spa in a lava field.", formattedAddress: "Blue Lagoon, Iceland" }
        ],
        oslo: [
          { name: "Vigeland Sculpture Park", category: "Park", lat: 59.9272, lng: 10.7024, rating: 4.8, description: "World's largest single-artist sculpture park.", formattedAddress: "Vigeland Park, Oslo" },
          { name: "MUNCH Museum", category: "Museum", lat: 59.9062, lng: 10.7554, rating: 4.5, description: "Stunning waterfront museum dedicated to Edvard Munch.", formattedAddress: "MUNCH, Oslo" }
        ]
      };

      for (const key of Object.keys(CURATED)) {
        if (query.includes(key) || key.includes(query)) {
          setSearchResults(CURATED[key]);
          setSearchLoading(false);
          return;
        }
      }

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        const results = data.map((item: any) => ({
          name: item.display_name.split(',')[0],
          category: item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Spot",
          formattedAddress: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          rating: 4.5,
          description: `Coordinates: ${item.lat}, ${item.lon}`
        }));
        setSearchResults(results);
      } else {
        throw new Error("Nominatim fetch failed");
      }
    } catch (err: any) {
      setSearchResults([
        {
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} Cafe`,
          category: "Cafe",
          formattedAddress: `${query.charAt(0).toUpperCase() + query.slice(1)} Central`,
          lat: 59.3293 + (Math.random() - 0.5) * 0.05,
          lng: 18.0686 + (Math.random() - 0.5) * 0.05,
          rating: 4.7,
          description: "Minimalist Scandinavian design serving coffee & pour-over."
        },
        {
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} Museum & Gallery`,
          category: "Museum",
          formattedAddress: `${query.charAt(0).toUpperCase() + query.slice(1)} Cultural District`,
          lat: 59.3293 + (Math.random() - 0.5) * 0.05,
          lng: 18.0686 + (Math.random() - 0.5) * 0.05,
          rating: 4.6,
          description: "Exhibition showcasing modern regional art and architecture."
        }
      ]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Address lookup handler for Custom Place mode with 500ms debounce
  const handleSearchCustomAddress = (queryStr: string) => {
    setCustomPlaceAddress(queryStr);
    setSelectedCustomAddress(null);

    if (addressSearchTimeoutRef.current) {
      clearTimeout(addressSearchTimeoutRef.current);
    }

    if (!queryStr.trim() || queryStr.trim().length < 3) {
      setCustomAddressResults([]);
      setCustomAddressLoading(false);
      return;
    }

    setCustomAddressLoading(true);
    addressSearchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr.trim())}&limit=5`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomAddressResults(data.map((item: any) => ({
            name: item.display_name.split(',')[0],
            formattedAddress: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          })));
        } else {
          setCustomAddressResults([]);
        }
      } catch (err) {
        setCustomAddressResults([]);
      } finally {
        setCustomAddressLoading(false);
      }
    }, 500);
  };

  // Add item to itinerary (Search Place or Custom Place)
  const handleAddItemToItinerary = async () => {
    if (!activeTrip) return;

    let spotName = '';
    let spotAddress = '';
    let lat = 0;
    let lng = 0;
    let itemTitle = newItemTitle.trim();

    if (placeInputMode === 'search') {
      if (!selectedSpot) {
        setErrorMsg('Please select a place from search results');
        return;
      }
      if (!itemTitle) itemTitle = selectedSpot.name;
      spotName = selectedSpot.name;
      spotAddress = selectedSpot.formattedAddress;
      lat = selectedSpot.lat;
      lng = selectedSpot.lng;
    } else {
      if (!customPlaceName.trim()) {
        setErrorMsg('Please enter a custom place name');
        return;
      }
      spotName = customPlaceName.trim();
      spotAddress = selectedCustomAddress?.formattedAddress || customPlaceAddress.trim() || customPlaceName.trim();
      if (!itemTitle) itemTitle = spotName;
      lat = selectedCustomAddress?.lat || 0;
      lng = selectedCustomAddress?.lng || 0;
    }

    const newItem: ItineraryItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: itemTitle,
      dayIndex: newItemDayIndex,
      time: newItemTime || '10:00',
      endTime: newItemEndTime || '11:30',
      location: {
        name: spotName,
        formattedAddress: spotAddress,
        lat,
        lng
      }
    };

    if (newItemNotes.trim()) {
      newItem.notes = newItemNotes.trim();
    }

    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      const updatedItinerary = [...(activeTrip.itinerary || []), newItem];
      await updateDoc(tripRef, {
        itinerary: updatedItinerary
      });
      setActiveTrip({ ...activeTrip, itinerary: updatedItinerary });

      setSearchQuery('');
      setSearchResults([]);
      setSelectedSpot(null);
      setCustomPlaceName('');
      setCustomPlaceAddress('');
      setCustomAddressResults([]);
      setSelectedCustomAddress(null);
      setNewItemTitle('');
      setNewItemNotes('');
      setSuccessMsg('Activity added to itinerary!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to add activity');
    }
  };

  // Compile itinerary summary client-side
  const handleCompileItinerary = async () => {
    if (!activeTrip) return;
    setCompiling(true);
    try {
      let md = `# 🧭 ${activeTrip.title}\n`;
      if (activeTrip.description) md += `*${activeTrip.description}*\n\n`;
      md += `**Trip Dates:** ${activeTrip.startDate || 'TBD'} to ${activeTrip.endDate || 'TBD'} (${activeTrip.days.length} Days)\n`;
      md += `**Organizer:** ${activeTrip.ownerName}\n\n`;
      md += `---\n\n## 📅 Trip Itinerary\n\n`;

      activeTrip.days.forEach((dayLabel, idx) => {
        let dateStr = '';
        if (activeTrip.startDate) {
          const start = new Date(activeTrip.startDate);
          if (!isNaN(start.getTime())) {
            const d = new Date(start);
            d.setDate(d.getDate() + idx);
            dateStr = ` (${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })})`;
          }
        }
        md += `### ${dayLabel}${dateStr}\n`;
        const dayItems = (activeTrip.itinerary || [])
          .filter(item => item.dayIndex === idx)
          .sort((a, b) => (a.time || '23:59').localeCompare(b.time || '23:59'));

        if (dayItems.length === 0) {
          md += `*No activities scheduled*\n\n`;
        } else {
          dayItems.forEach(item => {
            const timeRange = formatTimeRange(item.time, item.endTime);
            const locStr = item.location ? ` — 📍 ${item.location.name} (${item.location.formattedAddress})` : '';
            md += `- **${timeRange}** | **${item.title}**${locStr}\n`;
            if (item.notes) md += `  *Notes: ${item.notes}*\n`;
          });
          md += `\n`;
        }
      });

      // Automatically trigger download of markdown summary file
      const filename = `${activeTrip.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_summary.md`;
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setCompiledMarkdown(md);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to export trip summary");
    } finally {
      setCompiling(false);
    }
  };

  // Save edited trip title and description
  const handleSaveTripDetails = async () => {
    if (!activeTrip || !editTripTitle.trim()) return;
    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      await updateDoc(tripRef, {
        title: editTripTitle.trim(),
        description: editTripDesc.trim()
      });
      setActiveTrip({
        ...activeTrip,
        title: editTripTitle.trim(),
        description: editTripDesc.trim()
      });
      setIsEditingTripModalOpen(false);
      setSuccessMsg("Trip details updated!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err: any) {
      console.error("Failed to update trip details", err);
      setErrorMsg("Failed to update trip details");
    }
  };

  // Delete trip (Creator only)
  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    const targetTrip = trips.find(t => t.id === tripId) || (activeTrip?.id === tripId ? activeTrip : null);
    if (!targetTrip || targetTrip.ownerId !== user.uid) return;

    try {
      if (activeTrip?.id === tripId) {
        deleteDoc(doc(db, COLLECTIONS.PRESENCE, user.uid)).catch(() => {});
        setActiveTrip(null);
        setIsEditingTripModalOpen(false);
      }
      await deleteDoc(doc(db, COLLECTIONS.TRIPS, tripId));
      setSuccessMsg("Trip deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error("Failed to delete trip", err);
      setErrorMsg(err.message || "Failed to delete trip");
    }
  };


  // Save edited activity
  const handleSaveEditActivity = async () => {
    if (!activeTrip || !editingActivity || !editingActivity.title.trim()) return;

    try {
      const updatedItinerary = (activeTrip.itinerary || []).map(item =>
        item.id === editingActivity.id ? editingActivity : item
      );
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      await updateDoc(tripRef, { itinerary: updatedItinerary });
      setActiveTrip({ ...activeTrip, itinerary: updatedItinerary });
      setEditingActivity(null);
      setSuccessMsg('Activity updated!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err: any) {
      console.error("Failed to update activity", err);
      setErrorMsg('Failed to update activity');
    }
  };

  // Save edited chat message
  const handleSaveEditMessage = async (msgId: string) => {
    if (!editingChatText.trim() || !user) return;
    try {
      const chatRef = doc(db, COLLECTIONS.CHATS, msgId);
      await updateDoc(chatRef, {
        text: editingChatText.trim(),
        editedAt: serverTimestamp()
      });
      setEditingChatId(null);
      setEditingChatText('');
    } catch (err: any) {
      console.error("Failed to edit chat message", err);
      setErrorMsg("Failed to edit message");
    }
  };

  // Delete chat message
  const handleDeleteMessage = async (msgId: string) => {
    if (!user) return;
    try {
      const chatRef = doc(db, COLLECTIONS.CHATS, msgId);
      await deleteDoc(chatRef);
    } catch (err: any) {
      console.error("Failed to delete chat message", err);
      setErrorMsg("Failed to delete message");
    }
  };

  // Delete activity card
  const handleDeleteActivity = async (itemId: string) => {
    if (!activeTrip) return;
    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      const updatedItinerary = activeTrip.itinerary.filter(item => item.id !== itemId);
      await updateDoc(tripRef, {
        itinerary: updatedItinerary
      });
    } catch (err) {
      console.error("Failed to delete activity", err);
    }
  };

  // Duplicate / copy an activity
  const handleCopyActivity = async (item: ItineraryItem) => {
    if (!activeTrip) return;
    try {
      const duplicatedItem: ItineraryItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        title: `${item.title} (Copy)`,
      };
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      const updatedItinerary = [...(activeTrip.itinerary || []), duplicatedItem];
      await updateDoc(tripRef, {
        itinerary: updatedItinerary
      });
      setActiveTrip({ ...activeTrip, itinerary: updatedItinerary });
      setSuccessMsg('Activity copied!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error("Failed to copy activity", err);
      setErrorMsg("Failed to copy activity");
    }
  };

  // HTML5 Drag and Drop Card Handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e: React.DragEvent, targetDayIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const cardId = e.dataTransfer.getData('text/plain');
    if (!activeTrip || !cardId) return;

    const updatedItinerary = activeTrip.itinerary.map(item => {
      if (item.id === cardId) {
        return { ...item, dayIndex: targetDayIndex };
      }
      return item;
    });

    try {
      const tripRef = doc(db, COLLECTIONS.TRIPS, activeTrip.id);
      await updateDoc(tripRef, {
        itinerary: updatedItinerary
      });
    } catch (err) {
      console.error("Failed to reorder card", err);
    }
  };

  // Filter friends for Account-Based Search & Invite
  const matchingFriends = registeredUsers.filter(u => {
    if (!u.uid || u.uid === user?.uid) return false;
    if (activeTrip?.members?.includes(u.uid)) return false;
    if (!friendSearchQuery.trim()) return false;
    const q = friendSearchQuery.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  // Current trip members list resolved from registeredUsers
  const tripMembersList = registeredUsers.filter(u => activeTrip?.members?.includes(u.uid));

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center' }}>
          <Compass size={40} className="animate-spin" style={{ color: 'var(--accent-sage)', marginBottom: '16px' }} />
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--secondary-text)' }}>Opening Travelogue...</p>
        </div>
      </div>
    );
  }

  // Full-Screen Auth View when unauthenticated
  if (!user) {
    return (
      <AuthModal
        isModal={false}
        isSignUp={isSignUp}
        email={email}
        password={password}
        displayName={displayName}
        errorMsg={errorMsg}
        onToggleSignUp={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onDisplayNameChange={setDisplayName}
        onAuthSubmit={handleAuth}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  // Dashboard View (Trips List)
  if (!activeTrip) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
        <Navbar
          mode="dashboard"
          displayName={displayName}
          userColor={userColor}
          onDisplayNameChange={setDisplayName}
          onSaveDisplayName={handleSaveDisplayNameDirect}
          onSignOut={handleSignOut}
        />

        <TripPlanner
          user={user}
          trips={trips}
          showCreateTrip={showCreateTrip}
          setShowCreateTrip={setShowCreateTrip}
          newTripTitle={newTripTitle}
          setNewTripTitle={setNewTripTitle}
          newTripDesc={newTripDesc}
          setNewTripDesc={setNewTripDesc}
          newTripDaysCount={newTripDaysCount}
          setNewTripDaysCount={setNewTripDaysCount}
          newTripStartDate={newTripStartDate}
          setNewTripStartDate={setNewTripStartDate}
          newTripEndDate={newTripEndDate}
          setNewTripEndDate={setNewTripEndDate}
          handleCreateTrip={handleCreateTrip}
          onNavigateToTrip={(t) => navigateToTrip(t)}
          onDeleteTrip={handleDeleteTrip}
          successMsg={successMsg}
        />

        {isShowingAuthModal && (
          <AuthModal
            isModal={true}
            isSignUp={isSignUp}
            email={email}
            password={password}
            displayName={displayName}
            errorMsg={errorMsg}
            onToggleSignUp={() => setIsSignUp(!isSignUp)}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onDisplayNameChange={setDisplayName}
            onAuthSubmit={handleAuth}
            onGoogleSignIn={handleGoogleSignIn}
            onCloseModal={() => setIsShowingAuthModal(false)}
          />
        )}

        <Footer />
      </div>
    );
  }

  // Active Trip Workspace View
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', overflowX: 'hidden' }}>
      <Navbar
        mode="workspace"
        activeTrip={activeTrip}
        userUid={user.uid}
        displayName={displayName}
        userColor={userColor}
        presenceList={presenceList}
        activeTab={activeTab}
        compiling={compiling}
        onNavigateBack={() => {
          if (user) deleteDoc(doc(db, COLLECTIONS.PRESENCE, user.uid)).catch(() => {});
          navigateToTrip(null);
        }}
        onNavigateTab={navigateToTab}
        onEditTripDetails={() => {
          setEditTripTitle(activeTrip.title);
          setEditTripDesc(activeTrip.description || '');
          setIsEditingTripModalOpen(true);
        }}
        onOpenInviteModal={() => setShowInviteModal(true)}
        onCompileItinerary={handleCompileItinerary}
      />

      {/* Alert Messages Bar */}
      {(successMsg || errorMsg) && (
        <div style={{ maxWidth: '1440px', margin: '12px auto 0', padding: '0 24px', width: '100%' }}>
          {successMsg && (
            <div style={{ backgroundColor: '#EDF5ED', color: '#5A8E5A', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ backgroundColor: '#FDF2F2', color: '#D9534F', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {/* Main room board tracking mouse position for live collaboration cursors */}
      <div 
        ref={roomContainerRef} 
        onMouseMove={handleMouseMove}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 0 24px' }}
      >
        {/* Render Live Presence cursor overlays */}
        {presenceList.map((friend) => (
          <div 
            key={friend.id}
            className="live-cursor"
            style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
          >
            <Compass size={16} style={{ color: friend.userColor, transform: 'rotate(45deg)' }} />
            <div className="live-cursor-label" style={{ backgroundColor: friend.userColor }}>
              {friend.userName}
            </div>
          </div>
        ))}

        {/* TAB 1: ITINERARY CALENDAR TAB */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SpotCard
              activeTrip={activeTrip}
              placeInputMode={placeInputMode}
              setPlaceInputMode={setPlaceInputMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchLoading={searchLoading}
              searchResults={searchResults}
              selectedSpot={selectedSpot}
              setSelectedSpot={setSelectedSpot}
              handleSearchLocations={handleSearchLocations}
              newItemTitle={newItemTitle}
              setNewItemTitle={setNewItemTitle}
              newItemDayIndex={newItemDayIndex}
              setNewItemDayIndex={setNewItemDayIndex}
              newItemTime={newItemTime}
              setNewItemTime={setNewItemTime}
              newItemEndTime={newItemEndTime}
              setNewItemEndTime={setNewItemEndTime}
              newItemNotes={newItemNotes}
              setNewItemNotes={setNewItemNotes}
              handleAddItemToItinerary={handleAddItemToItinerary}
              customPlaceName={customPlaceName}
              setCustomPlaceName={setCustomPlaceName}
              customPlaceAddress={customPlaceAddress}
              setCustomPlaceAddress={setCustomPlaceAddress}
              customAddressResults={customAddressResults}
              setCustomAddressResults={setCustomAddressResults}
              customAddressLoading={customAddressLoading}
              setSelectedCustomAddress={setSelectedCustomAddress}
              handleSearchCustomAddress={handleSearchCustomAddress}
            />

            <ItineraryList
              activeTrip={activeTrip}
              highlightedActivityId={highlightedActivityId}
              onOpenDatePicker={(target) => {
                setDatePickerTarget(target);
                const targetDateStr = target === 'start' ? activeTrip.startDate : activeTrip.endDate;
                if (targetDateStr) {
                  const d = new Date(targetDateStr);
                  if (!isNaN(d.getTime())) {
                    setPickerYear(d.getFullYear());
                    setPickerMonth(d.getMonth());
                  }
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onEditActivity={setEditingActivity}
              onCopyActivity={handleCopyActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          </div>
        )}

        {/* TAB 2: ROUTE MAP TAB */}
        {activeTab === 'route' && (
          <MapContainer activeTrip={activeTrip} mapContainerRef={mapContainerRef} />
        )}

        {/* TAB 3: CHAT TAB */}
        {activeTab === 'chat' && (
          <ReviewSection
            chats={chats}
            user={user}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            editingChatId={editingChatId}
            setEditingChatId={setEditingChatId}
            editingChatText={editingChatText}
            setEditingChatText={setEditingChatText}
            handleSendMessage={handleSendMessage}
            handleSaveEditMessage={handleSaveEditMessage}
            handleDeleteMessage={handleDeleteMessage}
            chatEndRef={chatEndRef}
          />
        )}
      </div>

      <Footer />

      {/* Modals */}
      <InviteModal
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        friendSearchQuery={friendSearchQuery}
        setFriendSearchQuery={setFriendSearchQuery}
        matchingFriends={matchingFriends}
        activeTrip={activeTrip}
        user={user}
        tripMembersList={tripMembersList}
        handleInviteFriend={handleInviteFriend}
        handleRemoveMember={handleRemoveMember}
      />

      <ExportSummaryModal
        compiledMarkdown={compiledMarkdown}
        setCompiledMarkdown={setCompiledMarkdown}
      />

      <DatePickerModal
        datePickerTarget={datePickerTarget}
        setDatePickerTarget={setDatePickerTarget}
        pickerYear={pickerYear}
        setPickerYear={setPickerYear}
        pickerMonth={pickerMonth}
        setPickerMonth={setPickerMonth}
        activeTrip={activeTrip}
        handleUpdateTripDates={handleUpdateTripDates}
      />

      <EditTripModal
        isOpen={isEditingTripModalOpen}
        onClose={() => setIsEditingTripModalOpen(false)}
        editTripTitle={editTripTitle}
        setEditTripTitle={setEditTripTitle}
        editTripDesc={editTripDesc}
        setEditTripDesc={setEditTripDesc}
        handleSaveTripDetails={handleSaveTripDetails}
        onDeleteTrip={handleDeleteTrip}
        activeTrip={activeTrip}
        userUid={user.uid}
      />

      <EditActivityModal
        editingActivity={editingActivity}
        setEditingActivity={setEditingActivity}
        activeTrip={activeTrip}
        handleSaveEditActivity={handleSaveEditActivity}
      />
    </div>
  );
}
