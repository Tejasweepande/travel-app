/**
 * TravelPins — Personal Travel Log & Curated Recommendations
 * Frontend Controller & Storage Layer
 */

// Local Storage Key (v1 with new product branding)
const STORAGE_KEY = 'travelpins_places_v1';

// Category Definitions & Aesthetics (Matching reference mockup style)
const CATEGORIES = {
  food: { label: 'Food place', emoji: '🍽️', color: '#e76249', bgLight: '#fef1ee', textDark: '#c24128' },
  homestay: { label: 'Homestay', emoji: '🏡', color: '#1b7c72', bgLight: '#e8f8f5', textDark: '#0e5c63' },
  hotel: { label: 'Hotel', emoji: '🏨', color: '#4a72ec', bgLight: '#eef2ff', textDark: '#284ec4' },
  culture: { label: 'Culture', emoji: '🏛️', color: '#7c3aed', bgLight: '#f5f3ff', textDark: '#6d28d9' },
  gem: { label: 'Hidden gem', emoji: '💎', color: '#d97706', bgLight: '#fef3c7', textDark: '#b45309' },
  transport: { label: 'Transportation', emoji: '🚆', color: '#0284c7', bgLight: '#f0f9ff', textDark: '#0369a1' }
};

// Ratings Definitions & 5-Star mappings
const RATINGS = {
  must_visit: { label: 'Highly recommended', badgeClass: 'bg-emerald-50 text-teal-800 border-teal-200', icon: '★', stars: 5 },
  loved: { label: 'Loved it', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200', icon: '★', stars: 4 },
  solid: { label: 'Solid choice', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200', icon: '★', stars: 3 },
  decent: { label: 'Decent', badgeClass: 'bg-stone-50 text-stone-600 border-stone-200', icon: '★', stars: 2 }
};

const STAR_DESCRIPTIONS = {
  1: '1 star — Fair / okay',
  2: '2 stars — Decent',
  3: '3 stars — Solid & good value',
  4: '4 stars — Loved it',
  5: '5 stars — Highly recommended'
};

const STAR_RATING_KEYS = {
  1: 'decent',
  2: 'decent',
  3: 'solid',
  4: 'loved',
  5: 'must_visit'
};

function getPlaceStars(place) {
  if (place.visited === false) {
    return null;
  }
  if (typeof place.stars === 'number' && place.stars >= 1 && place.stars <= 5) {
    return place.stars;
  }
  if (place.rating === 'must_visit') return 5;
  if (place.rating === 'loved') return 4;
  if (place.rating === 'solid') return 3;
  if (place.rating === 'decent') return 2;
  return 5;
}

function formatVisitDate(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = months[month - 1] || parts[1];
    return `${m} ${day}, ${year}`;
  }
  return dateStr;
}

// Category normalization helper
function normalizeCategory(cat) {
  if (cat === 'restaurant' || cat === 'cafe' || cat === 'bar') return 'food';
  if (cat === 'sight') return 'culture';
  return CATEGORIES[cat] ? cat : 'food';
}

// Default high-quality seed places covering all cities & categories
const SEED_PLACES = [
  // --- GOKARNA (Karnataka, India) ---
  {
    id: 'gokarna-hope-villa',
    name: 'Hope Villa',
    city: 'Gokarna',
    country: 'India',
    category: 'homestay',
    visited: true,
    rating: 'must_visit',
    stars: 5,
    visitDate: '2024-10-15',
    address: 'North of main beach',
    lat: 14.5553,
    lng: 74.3133,
    mapUrl: 'https://maps.app.goo.gl/aXATB8iLexA5yGek7',
    photoUrl: 'https://lh3.googleusercontent.com/grass-cs/AABkmLe2xjKPNjCqqWpf7XCNji8R2fVSkAC8uyOpqKNxHGr2qRQNBkjB1re6lEAxKm81gqEaYcEh3MkppjKDIZQymL2I3owTNICepQAwKmDLpjVF9TBuXzBoM38UGGlmsCW3XD7qrOVf=w800-h600-k-no',
    notes: 'Stayed here! Great host Harish (contact: 9663026237). Clean, comfortable, and peaceful location on Om Beach road.',
    createdAt: 1729000000000
  },
  {
    id: 'gokarna-om-coast-stay',
    name: 'Om Coast Stay',
    city: 'Gokarna',
    country: 'India',
    category: 'homestay',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5552,
    lng: 74.3134,
    mapUrl: 'https://maps.app.goo.gl/sh2WvCwVAP5RMfNX8',
    photoUrl: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfOLXKhz3rk51AN8rI1kM68jhj1fIAJbOT5U8_08ddWsHwNW2XSAJ6lQMATkpEVrXxbZtXBVQrji7-9UkSQy08DasPncWQnLUmtXHyjZJha3KfFyillP5JcZMZpO_DNwDzUa90Pp7EMl1NX=w800-h600-k-no',
    notes: 'Saw on the way, located right in front of Hope Villa. Contact: 7829729017 / 6364671407. Great spot for easy beach access.',
    createdAt: 1729000100000
  },
  {
    id: 'gokarna-sunnys-serenity',
    name: "Sunny's Serenity",
    city: 'Gokarna',
    country: 'India',
    category: 'homestay',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5312,
    lng: 74.3168,
    mapUrl: 'https://maps.google.com/?q=Sunnys+Serenity+Gokarna',
    photoUrl: '',
    notes: 'Saw on the way while exploring Gokarna. Peaceful property surrounded by lush greenery near Kudle Beach road.',
    createdAt: 1729000200000
  },
  {
    id: 'gokarna-eco-stay',
    name: 'Eco Stay',
    city: 'Gokarna',
    country: 'India',
    category: 'homestay',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5235,
    lng: 74.3210,
    mapUrl: 'https://maps.google.com/?q=Eco+Stay+Gokarna',
    photoUrl: '',
    notes: 'Saw on the way while walking the trail in Gokarna. Rustic, eco-friendly nature retreat surrounded by greenery.',
    createdAt: 1729000300000
  },
  {
    id: 'gokarna-hotel-godavari',
    name: 'Hotel Godavari',
    city: 'Gokarna',
    country: 'India',
    category: 'hotel',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5493,
    lng: 74.3251,
    mapUrl: 'https://maps.app.goo.gl/KSDNwcHAWSDGvGuz6',
    photoUrl: 'https://lh3.googleusercontent.com/grass-cs/AABkmLeTS3Pj_ktViIywu2bmUSjpfrCRdIqMosnY-U4a5zyzF9tTLFlWEq2BRF4HpuvR494KwmdvEYjeHOQ8Scx_8EQEiyrZp8LByjMCNSGKMrRIS7gDVkWrQHp2Wfb1lKXZ9gqt0G5XtOdS0K3t=w800-h600-k-no',
    notes: 'Saw on the way in Gokarna town. Traditional accommodation and dining option near the main market hub.',
    createdAt: 1729000400000
  },
  {
    id: 'gokarna-sunset-cafe-stay',
    name: 'Sunset Cafe & Stay',
    city: 'Gokarna',
    country: 'India',
    category: 'food',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5558,
    lng: 74.3097,
    mapUrl: 'https://maps.app.goo.gl/VkKyQYtBmqseUymBA',
    photoUrl: 'https://lh3.googleusercontent.com/gps-proxy/ALd4DhEDmYJjYI67KoP4RZ0QmflJiUaEwqXWod6z-n_s4wpho7OH5T-LUySIwzAjUnOo2_38x3U89ojQovvuSHA5ZxkgOfMEQ1QQQIlxfOgNMz6LmOBkN5rjW-QQ8RkD-1bN95Jv7Q44hgEEqHbiPZ2HCLhMlxnz7UiZs_IgoEutl6Bd8alfB9b0CYZmSw=w800-h600-k-no',
    notes: 'Saw on the way along the cliffside beach trail. Stunning vantage point directly overlooking the Arabian Sea for sunset.',
    createdAt: 1729000500000
  },
  {
    id: 'gokarna-ciesta-beach-stay',
    name: 'Ciesta Beach Stay',
    city: 'Gokarna',
    country: 'India',
    category: 'homestay',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5380,
    lng: 74.3150,
    mapUrl: 'https://maps.google.com/?q=Ciesta+Beach+Stay+Gokarna',
    photoUrl: '',
    notes: 'Saw on the way right near the beach shore. Beachside shacks and cottages right by the sea breeze.',
    createdAt: 1729000600000
  },
  {
    id: 'gokarna-street-cafe-stay',
    name: 'Street Cafe & Stay (Bengali Uncle)',
    city: 'Gokarna',
    country: 'India',
    category: 'food',
    visited: false,
    rating: '',
    stars: null,
    visitDate: '',
    address: 'North of main beach',
    lat: 14.5571,
    lng: 74.3137,
    mapUrl: 'https://maps.app.goo.gl/8vRWSsUsjhQNn1LV7',
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SFPkwo4SJunpNsSOco--iUcySMuTRVWhnLc5OzgBus6-r0EXXEmE8RpQiSiC4ecZZBwjrF6j5FGgQlSyQjWz7UWtfWKY0JeK8oZmrdr3hz_b0P43_-V8JJvsflKUyIsURuEyD1tCz6RA_r=w800-h600-k-no',
    notes: 'Saw on the way. Run by a friendly Bengali uncle (contact: 8618495458). Cozy cafe vibe with stay options.',
    createdAt: 1729000700000
  }
];
// App State
const urlParams = new URLSearchParams(window.location.search);
const isGuestView = urlParams.get('view') === 'guest' || 
                    urlParams.get('mode') === 'view' || 
                    urlParams.get('shared') === 'true' || 
                    urlParams.get('readonly') === 'true';

const state = {
  places: [],
  selectedCity: 'all',
  selectedCategory: 'all',
  mustVisitsOnly: false,
  onlyVisited: false,
  searchQuery: '',
  sortBy: 'recent',
  viewMode: (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'grid' : 'split', // 'split', 'grid', 'map'
  isReadOnly: isGuestView,
  justAddedPlaceId: null
};

// Global Map Instance & Markers
let map = null;
let mapMarkers = [];
let markerClusterGroup = null;

// ========================================================
// INITIALIZATION
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile iOS active state immediate response
  document.addEventListener('touchstart', () => {}, { passive: true });

  // Apply view-only mode UI restrictions
  if (state.isReadOnly) {
    const addBtn = document.getElementById('openAddPlaceModalBtn');
    if (addBtn) addBtn.style.display = 'none';

    const viewerBadge = document.getElementById('viewerBadge');
    if (viewerBadge) {
      viewerBadge.classList.remove('hidden');
      viewerBadge.style.display = 'inline-flex';
    }

    const emptyAddBtn = document.getElementById('emptyAddPlaceBtn');
    if (emptyAddBtn) emptyAddBtn.style.display = 'none';
  }

  loadPlaces();
  initMap();
  setupEventListeners();
  initPullToRefresh();
  if (window.innerWidth <= 768 && window.updateLayoutMode) {
    window.updateLayoutMode('grid');
  }
  renderApp();
  initStickyHeaderFilterDocking();
  lucide.createIcons();
});

// Load places from localStorage or default to seed data
function loadPlaces() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    // Backward compatibility migration from legacy key
    if (!raw) {
      const legacyRaw = localStorage.getItem('mustvisit_places_v2');
      if (legacyRaw) {
        raw = legacyRaw;
        try {
          localStorage.setItem(STORAGE_KEY, legacyRaw);
        } catch (e) {}
      }
    }
    if (raw) {
      let parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out all sample / demo places that are not in the Gokarna user list
        const demoPrefixes = ['tokyo-', 'rome-', 'paris-', 'ny-', 'bali-'];
        parsed = parsed.filter(p => !demoPrefixes.some(prefix => p.id && p.id.startsWith(prefix)));

        // Ensure all 8 Gokarna places from SEED_PLACES are present and up to date
        SEED_PLACES.forEach(seed => {
          const existing = parsed.find(p => p.id === seed.id);
          if (existing) {
            existing.address = seed.address;
            if (seed.photoUrl) {
              existing.photoUrl = seed.photoUrl;
            }
            if (seed.mapUrl) {
              existing.mapUrl = seed.mapUrl;
            }
            if (seed.lat && seed.lng) {
              existing.lat = seed.lat;
              existing.lng = seed.lng;
            }
          } else {
            parsed.push(seed);
          }
        });

        state.places = parsed;
        savePlacesToStorage();
      } else {
        state.places = [...SEED_PLACES];
        savePlacesToStorage();
      }
    } else {
      state.places = [...SEED_PLACES];
      savePlacesToStorage();
    }

    // Strip legacy price field, ensure neighbourhood, and sync real photos
    state.places.forEach(p => {
      delete p.price;
      p.address = 'North of main beach';
      const seed = SEED_PLACES.find(s => s.id === p.id);
      if (seed && seed.photoUrl) {
        p.photoUrl = seed.photoUrl;
        p.mapUrl = seed.mapUrl;
        p.lat = seed.lat;
        p.lng = seed.lng;
      }
    });
    savePlacesToStorage();
  } catch (err) {
    console.error('Failed to parse local storage, loading seed data:', err);
    state.places = [...SEED_PLACES];
  }
}

function savePlacesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.places));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// ========================================================
// ========================================================
// LEAFLET MAP INTEGRATION (Google Maps)
// ========================================================
function initMap() {
  const mapContainer = document.getElementById('travelMap');
  if (!mapContainer) return;

  map = L.map('travelMap', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([14.555, 74.313], 14);

  // Google Maps standard road and terrain tile layer
  L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  }).addTo(map);

  // In split view: Never allow popups to open on the map
  map.on('popupopen', () => {
    if (state.viewMode === 'split') {
      map.closePopup();
    } else {
      if (window.lucide) lucide.createIcons();
    }
  });

  // Clicking empty map background clears active card highlights
  map.on('click', (e) => {
    if (e.originalEvent && !e.originalEvent.target.closest('.airbnb-pin-wrapper')) {
      document.querySelectorAll('.place-card.card-selected-active').forEach(c => {
        c.classList.remove('card-map-highlighted', 'card-selected-active');
      });
      document.querySelectorAll('.airbnb-pin-wrapper.active').forEach(p => p.classList.remove('active'));
    }
  });

  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

function updateMapMarkers(filteredPlaces) {
  if (!map) return;

  if (markerClusterGroup) {
    try {
      markerClusterGroup.clearLayers();
      map.removeLayer(markerClusterGroup);
    } catch (err) {}
    markerClusterGroup = null;
  }
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];

  const validPlaces = filteredPlaces.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng));

  const countEl = document.getElementById('mapMarkerCount');
  if (countEl) {
    countEl.textContent = `(${validPlaces.length} pin${validPlaces.length === 1 ? '' : 's'})`;
  }

  if (validPlaces.length === 0) return;

  const bounds = [];

  // 5. Pins group and split on the map: Leaflet MarkerCluster integration
  const hasClusterPlugin = typeof L.markerClusterGroup === 'function';
  if (hasClusterPlugin) {
    markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 40,
      animate: true,
      animateAddingMarkers: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        const sizeClass = count > 10 ? 'cluster-bubble-large' : '';
        return L.divIcon({
          html: `<div class="cluster-bubble ${sizeClass}" title="${count} spots">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      }
    });
  }

  validPlaces.forEach(place => {
    const normCat = normalizeCategory(place.category);
    const cat = CATEGORIES[normCat] || CATEGORIES.food;
    const isVisited = place.visited !== false;
    const stars = getPlaceStars(place);

    const isJustAdded = state.justAddedPlaceId === place.id;

    // Airbnb-style Interactive Marker Pin (with 60fps spring pin drop & water ripple)
    const pinHtml = `
      <div class="airbnb-pin-wrapper ${isJustAdded ? 'pin-dropping' : ''}" data-id="${place.id}" title="${escapeHtml(place.name)}">
        ${isJustAdded ? `<div class="pin-drop-ripple" style="--ripple-color: ${cat.color};"></div>` : ''}
        <div class="airbnb-pin-pill">
          <span class="airbnb-pin-emoji">${cat.emoji}</span>
          <span class="airbnb-pin-title">${escapeHtml(place.name)}</span>
          ${isVisited && stars ? `<span class="airbnb-pin-stars"><span style="color:#f59e0b">★</span>${stars}</span>` : ''}
        </div>
        <div class="airbnb-pin-pointer"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: pinHtml,
      className: 'custom-airbnb-pin',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -38]
    });

    const marker = L.marker([place.lat, place.lng], { icon: customIcon });
    if (markerClusterGroup) {
      markerClusterGroup.addLayer(marker);
    } else {
      marker.addTo(map);
    }

    const hasPhoto = !!(place.photoUrl && place.photoUrl.trim());
    const photo = hasPhoto ? place.photoUrl.trim() : '';

    // Card Popup (Mirrors main card UI)
    const popupContent = `
      <div class="place-card map-popup-place-card">
        <!-- Card Image & Overlay Badges -->
        <div class="card-image-box ${!hasPhoto ? 'card-image-box-empty' : ''}" 
             style="${!hasPhoto ? `background: linear-gradient(135deg, ${cat.bgLight} 0%, #f8fafc 100%); display: flex; align-items: center; justify-content: center; position: relative;` : ''}">
          ${hasPhoto ? `
            <img 
              src="${escapeHtml(photo)}" 
              alt="${escapeHtml(place.name)}" 
              loading="lazy"
              onerror="this.style.display='none'; this.parentElement.classList.add('card-image-box-empty');"
            >
            <div class="card-image-overlay"></div>
          ` : `
            <div class="card-empty-photo-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; pointer-events: none;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 12px rgba(11, 40, 44, 0.06); border: 1px solid ${cat.color}25;">
                ${cat.emoji}
              </div>
              <span style="font-size: 0.72rem; font-weight: 500; color: var(--stone-400);">No photo added yet</span>
            </div>
          `}

          <!-- Type of spot -->
          <div class="card-badge-top-left" style="background-color: ${cat.bgLight}; color: ${cat.textDark}; border: 1px solid ${cat.color}35;">
            <span>${cat.emoji}</span>
            <span>${cat.label}</span>
          </div>

          <!-- Rating / Status -->
          ${isVisited && stars ? `
            <div class="card-badge-top-right map-popup-star-badge" style="background-color: #ffffff; color: var(--stone-900); border: 1px solid var(--stone-200); box-shadow: 0 2px 6px rgba(11, 40, 44, 0.08);">
              <span style="color: #f59e0b; font-weight: 700;">★</span>
              <span style="font-weight: 700;">${stars}</span>
            </div>
          ` : ''}
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <!-- Place name & Status/Date tag -->
            <div class="card-title-row">
              <h3 class="card-title">${escapeHtml(place.name)}</h3>
              ${isVisited ? (place.visitDate ? `
                <span class="card-status-chip chip-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 11px; height: 11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="3" y1="10" y2="10"/></svg>
                  <span>${escapeHtml(formatVisitDate(place.visitDate))}</span>
                </span>
              ` : '') : `
                <span class="card-status-chip chip-saw-on-way" 
                      onclick="window.editPlace('${place.id}');"
                      title="Saw on the way — click to edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 11px; height: 11px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Saw on the way</span>
                </span>
              `}
            </div>

            <!-- Location (Address, City, Country) -->
            <div class="card-location-row">
              <div class="card-location-text">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; color: var(--brand-600); flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="card-location-label" title="${escapeHtml((place.address ? place.address + ', ' : '') + place.city + ', ' + place.country)}">
                  ${place.address ? `${escapeHtml(place.address)}, ` : ''}${escapeHtml(place.city)}${place.country ? `, ${escapeHtml(place.country)}` : ''}
                </span>
              </div>
            </div>

            <!-- Note & personal memory -->
            ${place.notes ? `
              <p class="card-notes">
                "${escapeHtml(place.notes)}"
              </p>
            ` : ''}
          </div>

          <!-- Action Bar: Google maps link & Actions -->
          <div class="card-footer">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              ${place.mapUrl ? `
                <a 
                  href="${escapeHtml(place.mapUrl)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="card-footer-btn"
                  style="background-color: var(--brand-100); color: var(--brand-700); text-decoration: none;"
                  title="Open Google maps link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 13px; height: 13px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Google maps</span>
                </a>
              ` : ''}
            </div>

            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <button 
                onclick="window.shareSinglePlace('${place.id}')" 
                class="card-action-btn"
                title="Share this spot"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: var(--brand-600);"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>

              ${!state.isReadOnly ? `
                <button 
                  type="button" 
                  onclick="window.editPlace('${place.id}')" 
                  class="card-action-btn"
                  title="Edit place"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: var(--stone-600);"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    // Remove Leaflet's auto-open on click handler so popup doesn't open automatically
    marker.off('click', marker._openPopup, marker);

    // Two-way interaction: hovering pin highlights card, clicking scrolls & highlights card
    marker.on('mouseover', () => {
      const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${place.id}"]`);
      if (pinEl) pinEl.classList.add('highlighted');
      const cardEl = document.querySelector(`.place-card[data-id="${place.id}"]`);
      if (cardEl) cardEl.classList.add('card-map-highlighted');
    });

    marker.on('mouseout', () => {
      const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${place.id}"]`);
      if (pinEl) pinEl.classList.remove('highlighted');
      const cardEl = document.querySelector(`.place-card[data-id="${place.id}"]`);
      if (cardEl && !cardEl.classList.contains('card-selected-active')) {
        cardEl.classList.remove('card-map-highlighted');
      }
    });

    marker.on('click', () => {
      if (state.viewMode === 'map') {
        // Map-only view: show popup on the map
        marker.openPopup();
      } else {
        // Split view: NEVER show any new card on the map. ONLY highlight the card on side!
        if (map) map.closePopup();

        // Clear existing highlights on other cards and pins
        document.querySelectorAll('.place-card.card-map-highlighted').forEach(c => {
          c.classList.remove('card-map-highlighted', 'card-selected-active');
          if (c._highlightTimer) clearTimeout(c._highlightTimer);
        });
        document.querySelectorAll('.airbnb-pin-wrapper.active').forEach(p => p.classList.remove('active'));

        // Highlight this pin chip on map
        const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${place.id}"]`);
        if (pinEl) pinEl.classList.add('active');

        // Scroll to and highlight card on the side
        const cardEl = document.querySelector(`.place-card[data-id="${place.id}"]`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cardEl.classList.add('card-map-highlighted', 'card-selected-active');
          cardEl._highlightTimer = setTimeout(() => {
            cardEl.classList.remove('card-map-highlighted', 'card-selected-active');
            if (pinEl) pinEl.classList.remove('active');
          }, 3500);
        }
      }
    });

    mapMarkers.push(marker);
    bounds.push([place.lat, place.lng]);
  });

  if (markerClusterGroup) {
    map.addLayer(markerClusterGroup);
  }

  if (state.justAddedPlaceId) {
    const justAddedPlace = validPlaces.find(p => p.id === state.justAddedPlaceId);
    if (justAddedPlace && map) {
      map.setView([justAddedPlace.lat, justAddedPlace.lng], Math.max(map.getZoom(), 15), { animate: true });
    }

    // Light haptic tap on mobile when the pin bounces on landing (~320ms)
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([15]); // Subtle, crisp haptic tap
        } catch (e) {}
      }
    }, 320);

    // Clean up animation classes after drop & ripple finish
    const targetPlaceId = state.justAddedPlaceId;
    setTimeout(() => {
      const dropEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${targetPlaceId}"]`);
      if (dropEl) {
        dropEl.classList.remove('pin-dropping');
        const ripple = dropEl.querySelector('.pin-drop-ripple');
        if (ripple) ripple.remove();
      }
      if (state.justAddedPlaceId === targetPlaceId) {
        state.justAddedPlaceId = null;
      }
    }, 1200);
  } else if (bounds.length > 0) {
    if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    } else {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }
}

function fitMapToMarkers() {
  if (!map || mapMarkers.length === 0) return;
  const group = new L.featureGroup(mapMarkers);
  map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 16 });
}

// ========================================================
// FILTERING & SORTING LOGIC
// ========================================================
function getFilteredPlaces() {
  return state.places.filter(place => {
    // Level 1: City filter
    if (state.selectedCity !== 'all' && place.city.toLowerCase() !== state.selectedCity.toLowerCase()) {
      return false;
    }

    // Level 2: Types of spots (Category filter)
    if (state.selectedCategory !== 'all') {
      const placeCat = normalizeCategory(place.category);
      if (placeCat !== state.selectedCategory) {
        return false;
      }
    }

    // Highly Recommended only toggle
    if (state.mustVisitsOnly && place.rating !== 'must_visit') {
      return false;
    }

    // Only Visited toggle
    if (state.onlyVisited && place.visited === false) {
      return false;
    }

    // Text search filter
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchCity = place.city.toLowerCase().includes(q);
      const matchCountry = place.country.toLowerCase().includes(q);
      const matchAddress = (place.address || '').toLowerCase().includes(q);
      const matchNotes = (place.notes || '').toLowerCase().includes(q);

      if (!matchName && !matchCity && !matchCountry && !matchAddress && !matchNotes) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'recent') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    if (state.sortBy === 'rating') {
      return getPlaceStars(b) - getPlaceStars(a);
    }
    if (state.sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (state.sortBy === 'city') {
      return a.city.localeCompare(b.city);
    }
    return 0;
  });
}

function getCityCounts() {
  const counts = {};
  state.places.forEach(p => {
    const c = p.city;
    counts[c] = (counts[c] || 0) + 1;
  });
  return counts;
}

function getCategoryCounts() {
  const counts = { all: state.places.length };
  Object.keys(CATEGORIES).forEach(k => counts[k] = 0);
  state.places.forEach(p => {
    const norm = normalizeCategory(p.category);
    if (counts[norm] !== undefined) {
      counts[norm]++;
    }
  });
  return counts;
}

// ========================================================
// RENDERING
// ========================================================
function renderApp() {
  const filtered = getFilteredPlaces();

  renderStats();
  renderCityDropdown();
  renderCategoryCounts();
  renderCards(filtered);
  updateMapMarkers(filtered);
  updateFilterDescription(filtered.length);

  lucide.createIcons();
}

function renderStats() {
  const uniqueCities = new Set(state.places.map(p => p.city.toLowerCase())).size;
  const visitedCount = state.places.filter(p => p.visited !== false).length;

  const citiesEl = document.getElementById('statCitiesCount');
  if (citiesEl) citiesEl.textContent = uniqueCities;

  const visitedEl = document.getElementById('statVisitedCount');
  if (visitedEl) visitedEl.textContent = visitedCount;

  const placesEl = document.getElementById('statPlacesCount');
  if (placesEl) placesEl.textContent = state.places.length;
}

// Render Level 1: City Dropdown
function renderCityDropdown() {
  const select = document.getElementById('citySelect');
  if (!select) return;

  const cityCounts = getCityCounts();
  const sortedCities = Object.keys(cityCounts).sort();

  let html = `<option value="all">All cities (${state.places.length} spots)</option>`;
  sortedCities.forEach(city => {
    const isSelected = state.selectedCity.toLowerCase() === city.toLowerCase();
    html += `<option value="${escapeHtml(city)}" ${isSelected ? 'selected' : ''}>${escapeHtml(city)} (${cityCounts[city]} spots)</option>`;
  });

  select.innerHTML = html;
  select.value = state.selectedCity;
}

// Render Level 2: Spot Types Counts
function renderCategoryCounts() {
  const catCounts = getCategoryCounts();
  document.getElementById('catCount-all').textContent = catCounts.all;
  Object.keys(CATEGORIES).forEach(cat => {
    const el = document.getElementById(`catCount-${cat}`);
    if (el) el.textContent = catCounts[cat] || 0;
  });

  document.querySelectorAll('#categoryFilters .category-pill').forEach(btn => {
    const c = btn.getAttribute('data-category');
    if (c === state.selectedCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateFilterDescription(count) {
  document.getElementById('displayedCount').textContent = count;
  let desc = '';
  if (state.selectedCity !== 'all') {
    desc += ` in ${state.selectedCity}`;
  }
  if (state.selectedCategory !== 'all') {
    desc += ` • ${CATEGORIES[state.selectedCategory]?.label || state.selectedCategory}`;
  }
  if (state.mustVisitsOnly) {
    desc += ` • Highly Recommended Only`;
  }
  if (state.onlyVisited) {
    desc += ` • Visited only`;
  }
  if (state.searchQuery.trim()) {
    desc += ` matching "${escapeHtml(state.searchQuery)}"`;
  }
  document.getElementById('activeFilterDesc').textContent = desc;
}

function renderCards(places) {
  const grid = document.getElementById('placesGrid');
  const emptyState = document.getElementById('emptyState');
  if (!grid) return;

  // 1. Capture First positions of existing cards for 60fps FLIP animation
  const existingCards = Array.from(grid.querySelectorAll('.place-card'));
  const firstPositions = new Map();
  existingCards.forEach(card => {
    const id = card.getAttribute('data-id');
    if (id) {
      firstPositions.set(id, card.getBoundingClientRect());
    }
  });

  if (places.length === 0) {
    grid.innerHTML = '';
    emptyState?.classList.remove('hidden');
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  emptyState?.classList.add('hidden');
  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = '';
  const newCards = [];

  places.forEach(place => {
    const normCat = normalizeCategory(place.category);
    const cat = CATEGORIES[normCat] || CATEGORIES.food;
    const ratingInfo = RATINGS[place.rating] || RATINGS.must_visit;
    const hasPhoto = !!(place.photoUrl && place.photoUrl.trim());
    const photo = hasPhoto ? place.photoUrl.trim() : '';

    const isVisited = place.visited !== false;
    const stars = getPlaceStars(place);

    const badgeTopRight = isVisited ? `
      <div class="card-badge-top-right" style="background-color: #ffffff; color: var(--stone-900); border: 1px solid var(--stone-200); box-shadow: 0 2px 6px rgba(11, 40, 44, 0.08);">
        <span style="color: #f59e0b; font-weight: 700;">★</span>
        <span style="font-weight: 700;">${stars || 5}</span>
      </div>
    ` : '';

    const card = document.createElement('div');
    card.className = 'place-card';
    card.setAttribute('data-id', place.id);

    // Two-way sync: Hovering card highlights map pin
    card.addEventListener('mouseenter', () => {
      const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${place.id}"]`);
      if (pinEl) {
        pinEl.classList.add('highlighted');
        const markerIcon = pinEl.closest('.leaflet-marker-icon');
        if (markerIcon) markerIcon.style.zIndex = '99999';
      }
    });

    card.addEventListener('mouseleave', () => {
      const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${place.id}"]`);
      if (pinEl) {
        pinEl.classList.remove('highlighted');
        const markerIcon = pinEl.closest('.leaflet-marker-icon');
        if (markerIcon) markerIcon.style.zIndex = '';
      }
    });

    card.innerHTML = `
      <!-- Card Image & Overlay Badges: Photo, Type of spot, Rating -->
      <div class="card-image-box ${!hasPhoto ? 'card-image-box-empty' : ''}" 
           onclick="window.centerOnMap(${place.lat}, ${place.lng}, '${place.id}')" 
           style="cursor: pointer; ${!hasPhoto ? `background: linear-gradient(135deg, ${cat.bgLight} 0%, #f8fafc 100%); display: flex; align-items: center; justify-content: center; position: relative;` : ''}" 
           title="${hasPhoto ? 'Show on map' : 'Show on map • Click edit to add photo'}">
        ${hasPhoto ? `
          <img 
            src="${escapeHtml(photo)}" 
            alt="${escapeHtml(place.name)}" 
            loading="lazy"
            onerror="this.style.display='none'; this.parentElement.classList.add('card-image-box-empty');"
          >
          <div class="card-image-overlay"></div>
        ` : `
          <div class="card-empty-photo-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; pointer-events: none;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 12px rgba(11, 40, 44, 0.06); border: 1px solid ${cat.color}25;">
              ${cat.emoji}
            </div>
            <span style="font-size: 0.72rem; font-weight: 500; color: var(--stone-400);">No photo added yet</span>
          </div>
        `}

        <!-- Type of spot -->
        <div class="card-badge-top-left" style="background-color: ${cat.bgLight}; color: ${cat.textDark}; border: 1px solid ${cat.color}35;">
          <span>${cat.emoji}</span>
          <span>${cat.label}</span>
        </div>

        <!-- Rating / Status -->
        ${badgeTopRight}
      </div>

      <!-- Card Details Body -->
      <div class="card-body">
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <!-- Place name & Status/Date tag -->
          <div class="card-title-row">
            <h3 class="card-title">
              ${escapeHtml(place.name)}
            </h3>
            ${isVisited ? (place.visitDate ? `
              <span class="card-status-chip chip-date">
                <i data-lucide="calendar"></i>
                <span>${escapeHtml(formatVisitDate(place.visitDate))}</span>
              </span>
            ` : '') : `
              <span class="card-status-chip chip-saw-on-way" 
                    onclick="event.stopPropagation(); window.editPlace('${place.id}');"
                    title="Saw on the way — click to edit">
                <i data-lucide="eye"></i>
                <span>Saw on the way</span>
              </span>
            `}
          </div>

          <!-- Location (Address, City, Country) -->
          <div class="card-location-row">
            <div class="card-location-text">
              <i data-lucide="map-pin" class="card-location-icon"></i>
              <span class="card-location-label" title="${escapeHtml((place.address ? place.address + ', ' : '') + place.city + ', ' + place.country)}">
                ${place.address ? `${escapeHtml(place.address)}, ` : ''}${escapeHtml(place.city)}, ${escapeHtml(place.country)}
              </span>
            </div>
          </div>

          <!-- Note & personal memory -->
          ${place.notes ? `
            <p class="card-notes">
              "${escapeHtml(place.notes)}"
            </p>
          ` : ''}
        </div>

        <!-- Action Bar: Google maps link & Card Actions -->
        <div class="card-footer">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${place.mapUrl ? `
              <a 
                href="${escapeHtml(place.mapUrl)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="card-footer-btn"
                style="background-color: var(--brand-100); color: var(--brand-700); text-decoration: none;"
                title="Open Google maps link"
              >
                <i data-lucide="map-pin" style="width: 13px; height: 13px;"></i>
                <span>Google maps</span>
              </a>
            ` : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <!-- Share spot -->
            <button 
              onclick="window.shareSinglePlace('${place.id}')" 
              class="card-action-btn"
              title="Share this spot"
            >
              <i data-lucide="send" style="width: 14px; height: 14px; color: var(--brand-600);"></i>
            </button>

            ${!state.isReadOnly ? `
              <!-- 3-Dot More Menu (Edit & Delete) -->
              <div class="card-menu-wrapper">
                <button 
                  type="button" 
                  onclick="window.toggleCardMenu('${place.id}', event)" 
                  class="card-action-btn"
                  title="More options"
                  aria-haspopup="true"
                  id="menuBtn-${place.id}"
                >
                  <i data-lucide="more-vertical" style="width: 15px; height: 15px; color: var(--stone-600);"></i>
                </button>

                <div id="cardMenu-${place.id}" class="card-menu-dropdown hidden">
                  <button 
                    type="button" 
                    class="card-menu-item"
                    onclick="window.editPlace('${place.id}'); window.closeAllCardMenus();"
                  >
                    <i data-lucide="pencil" style="width: 14px; height: 14px; color: var(--stone-600);"></i>
                    <span>Edit place</span>
                  </button>
                  <button 
                    type="button" 
                    class="card-menu-item"
                    onclick="window.quickChangePhoto('${place.id}'); window.closeAllCardMenus();"
                  >
                    <i data-lucide="camera" style="width: 14px; height: 14px; color: var(--brand-600);"></i>
                    <span>Change / upload photo</span>
                  </button>
                  ${!isVisited ? `
                    <button 
                      type="button" 
                      class="card-menu-item"
                      style="color: var(--brand-700); font-weight: 600;"
                      onclick="window.editPlaceWithVisited('${place.id}', true); window.closeAllCardMenus();"
                    >
                      <i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: var(--brand-600);"></i>
                      <span>Mark as visited & rate</span>
                    </button>
                  ` : `
                    <button 
                      type="button" 
                      class="card-menu-item"
                      onclick="window.quickToggleSawOnWay('${place.id}'); window.closeAllCardMenus();"
                    >
                      <i data-lucide="eye" style="width: 14px; height: 14px; color: #d97706;"></i>
                      <span>Mark as saw on way</span>
                    </button>
                  `}
                  <button 
                    type="button" 
                    class="card-menu-item text-danger"
                    onclick="window.deletePlace('${place.id}'); window.closeAllCardMenus();"
                  >
                    <i data-lucide="trash-2" style="width: 14px; height: 14px; color: #ef4444;"></i>
                    <span>Delete place</span>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

      </div>
    `;

    newCards.push(card);
    grid.appendChild(card);
  });

  // 2. Play FLIP animation: Invert & Play
  if (firstPositions.size > 0) {
    newCards.forEach(card => {
      const id = card.getAttribute('data-id');
      const firstRect = firstPositions.get(id);
      if (firstRect) {
        const lastRect = card.getBoundingClientRect();
        const deltaX = firstRect.left - lastRect.left;
        const deltaY = firstRect.top - lastRect.top;

        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
          // Invert: position at old coords instantly
          card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          card.style.transition = 'none';

          // Play: animate smoothly to new slot
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add('flip-animating');
              card.style.transform = '';
              setTimeout(() => {
                card.classList.remove('flip-animating');
              }, 320);
            });
          });
        }
      } else {
        // Entering card fades & scales in smoothly
        card.classList.add('card-enter');
        setTimeout(() => card.classList.remove('card-enter'), 320);
      }
    });
  }
}

function getPlaceholderPhoto(category) {
  return '';
}

// ========================================================
// GLOBAL ACTIONS & EVENT HANDLERS
// ========================================================
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.classList.toggle('hidden', state.searchQuery === '');
    renderApp();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    renderApp();
  });

  // Level 1: City Dropdown Selector
  const citySelect = document.getElementById('citySelect');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      state.selectedCity = e.target.value;
      renderApp();
    });
  }

  // Level 2: Category filter buttons
  document.querySelectorAll('#categoryFilters .category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCategory = btn.getAttribute('data-category');
      renderApp();
    });
  });

  // Highly Recommended filter toggle (if present)
  const favBtn = document.getElementById('filterFavoritesBtn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      state.mustVisitsOnly = !state.mustVisitsOnly;
      favBtn.classList.toggle('bg-amber-100', state.mustVisitsOnly);
      favBtn.classList.toggle('border-amber-400', state.mustVisitsOnly);
      favBtn.classList.toggle('text-amber-900', state.mustVisitsOnly);
      renderApp();
    });
  }

  // Listing Controls: Only Visited toggle filter
  const onlyVisitedToggle = document.getElementById('onlyVisitedToggle');
  if (onlyVisitedToggle) {
    onlyVisitedToggle.addEventListener('change', (e) => {
      state.onlyVisited = e.target.checked;
      const wrapper = onlyVisitedToggle.closest('.toggle-switch-wrapper');
      if (wrapper) wrapper.classList.toggle('active', state.onlyVisited);
      renderApp();
    });
  }

  // Listing Level 2: Sort dropdown
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderApp();
  });

  // Fit bounds button on map header
  const fitBtn = document.getElementById('fitMapBoundsBtn');
  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      fitMapToMarkers();
    });
  }

  // Listing Level 1: Layout View Mode Toggles
  const viewSplitBtn = document.getElementById('viewSplitBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewMapBtn = document.getElementById('viewMapBtn');
  const contentLayout = document.getElementById('contentLayout');

  function updateLayoutMode(mode) {
    // In mobile view (<= 768px), remove split view; default to grid if split requested
    if (window.innerWidth <= 768 && mode === 'split') {
      mode = 'grid';
    }

    state.viewMode = mode;
    [viewSplitBtn, viewGridBtn, viewMapBtn].forEach(b => b && b.classList.remove('active'));

    contentLayout.classList.remove('layout-split', 'layout-grid-only', 'layout-map-only');

    if (mode === 'split') {
      if (viewSplitBtn) viewSplitBtn.classList.add('active');
      contentLayout.classList.add('layout-split');
    } else if (mode === 'grid') {
      if (viewGridBtn) viewGridBtn.classList.add('active');
      contentLayout.classList.add('layout-grid-only');
    } else if (mode === 'map') {
      if (viewMapBtn) viewMapBtn.classList.add('active');
      contentLayout.classList.add('layout-map-only');
    }

    if (map) {
      setTimeout(() => map.invalidateSize(), 200);
    }
  }
  window.updateLayoutMode = updateLayoutMode;

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && state.viewMode === 'split') {
      updateLayoutMode('grid');
    }
  });

  if (viewSplitBtn) viewSplitBtn.addEventListener('click', () => updateLayoutMode('split'));
  if (viewGridBtn) viewGridBtn.addEventListener('click', () => updateLayoutMode('grid'));
  if (viewMapBtn) viewMapBtn.addEventListener('click', () => updateLayoutMode('map'));

  // Place Modal Buttons
  document.getElementById('openAddPlaceModalBtn').addEventListener('click', () => openPlaceModal());
  document.getElementById('emptyAddPlaceBtn').addEventListener('click', () => openPlaceModal());
  document.getElementById('closePlaceModalBtn').addEventListener('click', () => closePlaceModal());
  const cancelPlaceBtn = document.getElementById('cancelPlaceModalBtn');
  if (cancelPlaceBtn) cancelPlaceBtn.addEventListener('click', () => closePlaceModal());

  // Visit Status Checkbox
  const visitedCheckbox = document.getElementById('formVisitedCheckbox');
  if (visitedCheckbox) {
    visitedCheckbox.addEventListener('change', (e) => {
      setVisitStatus(e.target.checked);
    });
  }

  // Form submit
  document.getElementById('placeForm').addEventListener('submit', handlePlaceFormSubmit);

  // Star Rating Widget Listeners
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const star = parseInt(btn.dataset.star, 10);
      setStarRating(star, false);
    });
    btn.addEventListener('mouseenter', () => {
      const star = parseInt(btn.dataset.star, 10);
      setStarRating(star, true);
    });
  });

  const starRow = document.getElementById('starButtonsRow');
  if (starRow) {
    let isPointerDragging = false;

    starRow.addEventListener('pointerdown', (e) => {
      isPointerDragging = true;
      try { starRow.setPointerCapture?.(e.pointerId); } catch(err) {}
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.star-btn');
      if (target) {
        setStarRating(parseInt(target.dataset.star, 10), false);
      }
    });

    starRow.addEventListener('pointermove', (e) => {
      if (!isPointerDragging) return;
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.star-btn');
      if (target) {
        setStarRating(parseInt(target.dataset.star, 10), false);
      }
    });

    const stopStarDrag = (e) => {
      if (isPointerDragging) {
        isPointerDragging = false;
        try { starRow.releasePointerCapture?.(e.pointerId); } catch(err) {}
      }
    };

    starRow.addEventListener('pointerup', stopStarDrag);
    starRow.addEventListener('pointercancel', stopStarDrag);

    starRow.addEventListener('mouseleave', () => {
      if (isPointerDragging) return;
      const current = parseInt(document.getElementById('formRatingStars').value || '0', 10);
      document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('hovered'));
      setStarRating(current || null, false);
    });
  }

  // Google Maps URL Autofill Listener
  const mapUrlInput = document.getElementById('formMapUrl');
  if (mapUrlInput) {
    mapUrlInput.addEventListener('input', handleMapUrlAutofill);
    mapUrlInput.addEventListener('paste', () => setTimeout(handleMapUrlAutofill, 80));
  }

  ['formName', 'formCity', 'formAddress', 'formCountry'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        this.dataset.autofilled = 'false';
      });
    }
  });

  // Photo Upload & Preview Listeners (with Native Mobile Camera & Gallery support)
  async function handlePhotoFileSelection(file, isCamera = false) {
    if (!file) return;
    try {
      const dataUrl = await compressAndResizeImage(file);
      setPhotoPreview(dataUrl, 'manual');
      const urlInp = document.getElementById('formPhotoUrlInput');
      if (urlInp) urlInp.value = '';
      if (navigator.vibrate) {
        try { navigator.vibrate([20]); } catch (e) {}
      }
      showToast(isCamera ? '📸 Photo captured with camera!' : '🖼️ Photo selected from gallery!');
    } catch (err) {
      console.error('Failed to process image:', err);
      showToast('Could not load image. Please try another photo.');
    }
  }

  const photoFileInput = document.getElementById('formPhotoFile');
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handlePhotoFileSelection(file, false);
    });
  }

  const formCameraFile = document.getElementById('formCameraFile');
  if (formCameraFile) {
    formCameraFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handlePhotoFileSelection(file, true);
    });
  }

  const formGalleryFile = document.getElementById('formGalleryFile');
  if (formGalleryFile) {
    formGalleryFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handlePhotoFileSelection(file, false);
    });
  }

  // Mobile-only direct triggers in modal
  const mobileCameraBtn = document.getElementById('mobileCameraBtn');
  if (mobileCameraBtn) {
    mobileCameraBtn.addEventListener('click', () => {
      if (formCameraFile) {
        formCameraFile.value = '';
        formCameraFile.click();
      }
    });
  }

  const mobileGalleryBtn = document.getElementById('mobileGalleryBtn');
  if (mobileGalleryBtn) {
    mobileGalleryBtn.addEventListener('click', () => {
      if (formGalleryFile) {
        formGalleryFile.value = '';
        formGalleryFile.click();
      }
    });
  }

  const prompt = document.getElementById('photoUploadPrompt');
  if (prompt) {
    prompt.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        window.openMobilePhotoSheet('modal');
      } else if (photoFileInput) {
        photoFileInput.click();
      }
    });
    prompt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.innerWidth <= 768) {
          window.openMobilePhotoSheet('modal');
        } else if (photoFileInput) {
          photoFileInput.click();
        }
      }
    });
  }

  function triggerModalPhotoChange() {
    if (window.innerWidth <= 768) {
      window.openMobilePhotoSheet('modal');
    } else if (photoFileInput) {
      photoFileInput.value = '';
      photoFileInput.click();
    }
  }

  const changeBtn = document.getElementById('changePhotoBtn');
  if (changeBtn) {
    changeBtn.addEventListener('click', triggerModalPhotoChange);
  }

  const replaceWithMobileBtn = document.getElementById('replaceWithMobileBtn');
  if (replaceWithMobileBtn) {
    replaceWithMobileBtn.addEventListener('click', triggerModalPhotoChange);
  }

  const replaceManualPhotoBtn = document.getElementById('replaceManualPhotoBtn');
  if (replaceManualPhotoBtn) {
    replaceManualPhotoBtn.addEventListener('click', triggerModalPhotoChange);
  }

  const removeBtn = document.getElementById('removePhotoBtn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      setPhotoPreview(null);
      const urlInp = document.getElementById('formPhotoUrlInput');
      if (urlInp) urlInp.value = '';
      if (photoFileInput) photoFileInput.value = '';
      if (formCameraFile) formCameraFile.value = '';
      if (formGalleryFile) formGalleryFile.value = '';
    });
  }

  // Quick Photo Inputs (for direct card 3-dot menu or quick change)
  async function handleQuickPhotoSelection(file, isCamera = false) {
    if (!file || !state.targetPhotoPlaceId) return;
    try {
      const dataUrl = await compressAndResizeImage(file);
      const place = state.places.find(p => p.id === state.targetPhotoPlaceId);
      if (place) {
        place.photoUrl = dataUrl;
        place.photoSource = 'manual';
        savePlacesToStorage();
        renderApp();
        if (navigator.vibrate) {
          try { navigator.vibrate([20]); } catch (e) {}
        }
        showToast(isCamera ? `📸 Photo captured for "${place.name}"!` : `🖼️ Photo updated for "${place.name}"!`);
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      showToast('Could not load image. Please try another photo.');
    } finally {
      state.targetPhotoPlaceId = null;
    }
  }

  const quickPhotoInput = document.getElementById('quickPhotoInput');
  if (quickPhotoInput) {
    quickPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleQuickPhotoSelection(file, false);
      quickPhotoInput.value = '';
    });
  }

  const quickCameraInput = document.getElementById('quickCameraInput');
  if (quickCameraInput) {
    quickCameraInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleQuickPhotoSelection(file, true);
      quickCameraInput.value = '';
    });
  }

  const quickGalleryInput = document.getElementById('quickGalleryInput');
  if (quickGalleryInput) {
    quickGalleryInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleQuickPhotoSelection(file, false);
      quickGalleryInput.value = '';
    });
  }

  // Mobile Photo Action Sheet Button Listeners
  const sheetCamBtn = document.getElementById('mobileSheetCameraBtn');
  if (sheetCamBtn) {
    sheetCamBtn.addEventListener('click', () => {
      const target = window.mobilePhotoSheetTarget;
      window.closeMobilePhotoSheet();
      if (target === 'modal') {
        const camInput = document.getElementById('formCameraFile');
        if (camInput) { camInput.value = ''; camInput.click(); }
      } else if (target) {
        state.targetPhotoPlaceId = target;
        const quickCam = document.getElementById('quickCameraInput');
        if (quickCam) { quickCam.value = ''; quickCam.click(); }
      }
    });
  }

  const sheetGalBtn = document.getElementById('mobileSheetGalleryBtn');
  if (sheetGalBtn) {
    sheetGalBtn.addEventListener('click', () => {
      const target = window.mobilePhotoSheetTarget;
      window.closeMobilePhotoSheet();
      if (target === 'modal') {
        const galInput = document.getElementById('formGalleryFile');
        if (galInput) { galInput.value = ''; galInput.click(); }
      } else if (target) {
        state.targetPhotoPlaceId = target;
        const quickGal = document.getElementById('quickGalleryInput');
        if (quickGal) { quickGal.value = ''; quickGal.click(); }
      }
    });
  }

  const sheetCancelBtn = document.getElementById('mobileSheetCancelBtn');
  if (sheetCancelBtn) {
    sheetCancelBtn.addEventListener('click', () => {
      window.closeMobilePhotoSheet();
    });
  }

  const sheetBackdrop = document.getElementById('mobilePhotoActionSheet');
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', (e) => {
      if (e.target === sheetBackdrop) {
        window.closeMobilePhotoSheet();
      }
    });
  }

  const toggleUrlBtn = document.getElementById('toggleUrlPhotoBtn');
  const urlWrapper = document.getElementById('urlPhotoInputWrapper');
  const urlInp = document.getElementById('formPhotoUrlInput');
  if (toggleUrlBtn && urlWrapper) {
    toggleUrlBtn.addEventListener('click', () => {
      urlWrapper.classList.toggle('hidden');
      if (!urlWrapper.classList.contains('hidden') && urlInp) {
        urlInp.focus();
      }
    });
  }
  if (urlInp) {
    urlInp.addEventListener('input', () => {
      const val = urlInp.value.trim();
      if (val) {
        setPhotoPreview(val, 'manual');
      }
    });
  }

  // Share Guide Buttons
  document.getElementById('shareGuideBtn').addEventListener('click', () => openShareModal());
  document.getElementById('closeShareModalBtn').addEventListener('click', () => closeShareModal());
  document.getElementById('copyShareTextBtn').addEventListener('click', handleCopyShareText);
  const copyWebBtn = document.getElementById('copyWebLinkBtn');
  if (copyWebBtn) copyWebBtn.addEventListener('click', handleCopyWebLink);
  document.getElementById('openWhatsAppBtn').addEventListener('click', handleOpenWhatsApp);
  document.getElementById('printGuideBtn').addEventListener('click', () => window.print());
  document.getElementById('shareScopeSelect').addEventListener('change', updateSharePreview);

  // Close modals on clicking backdrop outside dialog
  [document.getElementById('placeModal'), document.getElementById('shareModal')].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'placeModal') closePlaceModal();
        if (modal.id === 'shareModal') closeShareModal();
      }
    });
  });

  // Close card 3-dot dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.card-menu-wrapper')) {
      window.closeAllCardMenus();
    }
  });

  // Close modals and dropdowns on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const placeModal = document.getElementById('placeModal');
      const shareModal = document.getElementById('shareModal');
      if (placeModal && !placeModal.classList.contains('hidden')) {
        closePlaceModal();
      } else if (shareModal && !shareModal.classList.contains('hidden')) {
        closeShareModal();
      } else {
        window.closeAllCardMenus();
      }
    }
  });
}

// ========================================================
// 7. SKELETON LOADING WITH PALE BLUE-WHITE WATER SHIMMER
// ========================================================
function showSkeletonLoading(count = 4) {
  const grid = document.getElementById('placesGrid');
  if (!grid) return;

  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-image skeleton-shimmer"></div>
        <div class="skeleton-body">
          <div class="skeleton-line skeleton-title skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-sub skeleton-shimmer"></div>
          <div class="skeleton-chips-row">
            <div class="skeleton-chip skeleton-shimmer"></div>
            <div class="skeleton-chip skeleton-shimmer" style="width: 50px;"></div>
          </div>
        </div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

// ========================================================
// 4. PULL TO REFRESH WITH FLUID WAVE
// ========================================================
function initPullToRefresh() {
  const cardsPanel = document.getElementById('cardsPanel');
  const container = document.getElementById('pullToRefreshContainer');
  const content = document.getElementById('pullToRefreshContent');
  const path = document.getElementById('pullToRefreshWavePath');
  const indicator = document.getElementById('pullToRefreshIndicator');
  const textEl = document.getElementById('pullToRefreshText');

  if (!cardsPanel || !container || !content || !path || !indicator) return;

  let startY = 0;
  let isPulling = false;
  let currentPull = 0;
  let isRefreshing = false;

  const PULL_THRESHOLD = 52;
  const MAX_PULL = 78;

  function onTouchStart(e) {
    if (isRefreshing) return;
    const scrollPos = cardsPanel.scrollTop || window.scrollY || 0;
    if (scrollPos <= 2) {
      startY = e.touches ? e.touches[0].clientY : e.clientY;
      isPulling = true;
      currentPull = 0;
    }
  }

  function onTouchMove(e) {
    if (!isPulling || isRefreshing) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rawDelta = clientY - startY;

    if (rawDelta > 0) {
      currentPull = Math.min(MAX_PULL, rawDelta * 0.42);
      container.style.height = currentPull + 'px';
      content.style.height = currentPull + 'px';

      const waveHeight = currentPull * 1.5;
      path.setAttribute('d', `M0,0 Q500,${waveHeight} 1000,0 L1000,0 L0,0 Z`);

      indicator.style.opacity = Math.min(1, currentPull / 32);
      if (textEl) {
        textEl.textContent = currentPull >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh';
      }

      if (e.cancelable && rawDelta > 10) {
        e.preventDefault();
      }
    } else {
      currentPull = 0;
      container.style.height = '0px';
      content.style.height = '0px';
    }
  }

  function onTouchEnd() {
    if (!isPulling) return;
    isPulling = false;

    if (currentPull >= PULL_THRESHOLD && !isRefreshing) {
      isRefreshing = true;
      container.classList.add('refreshing');
      container.style.height = '48px';
      content.style.height = '48px';
      path.setAttribute('d', 'M0,0 Q500,42 1000,0 L1000,0 L0,0 Z');
      if (textEl) textEl.textContent = 'Refreshing spots...';

      // Show skeleton shimmer placeholders briefly, then render fresh state
      showSkeletonLoading(4);

      setTimeout(() => {
        renderApp();
        isRefreshing = false;
        container.style.height = '0px';
        content.style.height = '0px';
        indicator.style.opacity = '0';
        setTimeout(() => {
          container.classList.remove('refreshing');
          path.setAttribute('d', 'M0,0 Q500,0 1000,0 L1000,0 L0,0 Z');
        }, 300);
      }, 700);
    } else {
      container.style.height = '0px';
      content.style.height = '0px';
      indicator.style.opacity = '0';
      setTimeout(() => {
        path.setAttribute('d', 'M0,0 Q500,0 1000,0 L1000,0 L0,0 Z');
      }, 200);
    }
  }

  cardsPanel.addEventListener('touchstart', onTouchStart, { passive: true });
  cardsPanel.addEventListener('touchmove', onTouchMove, { passive: false });
  cardsPanel.addEventListener('touchend', onTouchEnd, { passive: true });
  cardsPanel.addEventListener('touchcancel', onTouchEnd, { passive: true });
}

// ========================================================
// STICKY HEADER FILTER DOCKING ON SCROLL
// ========================================================
function initStickyHeaderFilterDocking() {
  const listingBar = document.getElementById('listingControlsBar');
  const listingSlot = document.getElementById('listingControlsSlot');
  const controlsLevels = document.getElementById('listingControlsLevels');
  const headerDockedSlot = document.getElementById('headerDockedControls');
  const header = document.querySelector('header');
  const searchInput = document.getElementById('searchInput');

  if (!listingBar || !listingSlot || !controlsLevels || !headerDockedSlot || !header) return;

  let isDocked = false;
  let ticking = false;

  // Responsive search placeholder: 'Search' when compact/docked, 'Search places, cities...' when wide/longer
  function updateSearchPlaceholder() {
    if (!searchInput) return;
    if (isDocked || (searchInput.offsetWidth > 0 && searchInput.offsetWidth < 220)) {
      searchInput.placeholder = 'Search';
    } else {
      searchInput.placeholder = 'Search places, cities...';
    }
  }

  function updateDockingState() {
    ticking = false;

    // Keep controls in page on mobile viewports (< 768px)
    if (window.innerWidth <= 768) {
      if (isDocked) {
        listingSlot.appendChild(controlsLevels);
        document.body.classList.remove('header-filters-docked');
        header.classList.remove('header-filters-docked');
        isDocked = false;
        updateSearchPlaceholder();
      }
      return;
    }

    const headerHeight = header.offsetHeight || 64;
    // Check against listingSlot (permanent placeholder) or listingBar
    const checkEl = isDocked ? listingSlot : listingBar;
    const rect = checkEl.getBoundingClientRect();

    // Trigger docking with a graceful delay: wait until in-page filter bar has scrolled past header into the cards section
    if (!isDocked && rect.bottom <= headerHeight - 15) {
      isDocked = true;
      document.body.classList.add('header-filters-docked');
      header.classList.add('header-filters-docked');
      if (searchInput) searchInput.placeholder = 'Search';
      controlsLevels.classList.add('docking-in-header');
      headerDockedSlot.appendChild(controlsLevels);
      setTimeout(() => controlsLevels.classList.remove('docking-in-header'), 450);
    } 
    // Trigger undocking when scrolling back down until the original slot is comfortably below the header
    else if (isDocked && rect.top > headerHeight + 15) {
      isDocked = false;
      document.body.classList.remove('header-filters-docked');
      header.classList.remove('header-filters-docked');
      // Transition placeholder back as search bar smoothly expands
      setTimeout(() => {
        if (!isDocked) updateSearchPlaceholder();
      }, 150);
      controlsLevels.classList.add('undocking-in-page');
      listingSlot.appendChild(controlsLevels);
      setTimeout(() => controlsLevels.classList.remove('undocking-in-page'), 450);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateDockingState);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateDockingState();
        updateSearchPlaceholder();
      });
    }
  }, { passive: true });

  // Initial check on load
  updateDockingState();
  updateSearchPlaceholder();
}

// Center map on specific marker
window.centerOnMap = function(lat, lng, placeId) {
  if (!map) return;
  if (window.innerWidth <= 768) {
    if (window.updateLayoutMode) window.updateLayoutMode('map');
  } else if (state.viewMode === 'grid') {
    if (window.updateLayoutMode) window.updateLayoutMode('split');
  }
  map.setView([lat, lng], 16, { animate: true });
  const targetMarker = mapMarkers.find(m => {
    const pos = m.getLatLng();
    return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001;
  });
  if (targetMarker) {
    if (state.viewMode === 'map') {
      targetMarker.openPopup();
    } else {
      if (map) map.closePopup();
      document.querySelectorAll('.airbnb-pin-wrapper.active').forEach(p => p.classList.remove('active'));
      const pinEl = document.querySelector(`.airbnb-pin-wrapper[data-id="${placeId}"]`);
      if (pinEl) {
        pinEl.classList.add('active');
        setTimeout(() => pinEl.classList.remove('active'), 2500);
      }
    }
  }
  document.getElementById('mapPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ========================================================
// GOOGLE MAPS URL PARSER & AUTOFILL
// ========================================================
function parseGoogleMapsUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed.includes('google.com') && !trimmed.includes('goo.gl')) return null;

  let name = null;
  let city = null;
  let neighbourhood = null;
  let country = null;
  let lat = null;
  let lng = null;

  let rawPathQuery = null;

  // 1. Matches /place/Name/@lat,lng or /place/Name/
  const placeMatch = trimmed.match(/\/place\/([^/@?#]+)/);
  if (placeMatch) {
    rawPathQuery = decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
  }

  // 2. Matches /search/Name/@lat,lng or /search/Name/
  if (!rawPathQuery) {
    const searchMatch = trimmed.match(/\/search\/([^/@?#]+)/);
    if (searchMatch) {
      rawPathQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, ' ')).trim();
    }
  }

  // 3. Matches ?q=Name or &q=Name
  if (!rawPathQuery) {
    const qMatch = trimmed.match(/[?&]q=([^&#]+)/);
    if (qMatch) {
      rawPathQuery = decodeURIComponent(qMatch[1].replace(/\+/g, ' ')).trim();
    }
  }

  // 4. Coordinates @lat,lng
  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    lat = parseFloat(coordMatch[1]);
    lng = parseFloat(coordMatch[2]);
  } else {
    const queryCoordMatch = trimmed.match(/[?&](?:ll|q)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryCoordMatch) {
      lat = parseFloat(queryCoordMatch[1]);
      lng = parseFloat(queryCoordMatch[2]);
    }
  }

  if (rawPathQuery) {
    // If rawPathQuery is just coordinates, ignore it as a name
    if (/^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(rawPathQuery)) {
      rawPathQuery = null;
    }
  }

  if (rawPathQuery) {
    const parts = rawPathQuery.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      name = parts[0];
      const rem = parts.slice(1);

      const knownCountries = new Set([
        'India', 'United States', 'USA', 'UK', 'United Kingdom', 'France', 'Italy', 
        'Japan', 'Thailand', 'Spain', 'Germany', 'Indonesia', 'Australia', 'Canada', 
        'Singapore', 'Netherlands', 'Switzerland', 'Portugal', 'Vietnam', 'Sri Lanka'
      ]);
      if (rem.length > 0 && knownCountries.has(rem[rem.length - 1])) {
        country = rem.pop();
      }

      // Check for state / postal code at the end (e.g. "Karnataka 581326", "Maharashtra 400050")
      if (rem.length > 0 && (/\b\d{5,6}\b/.test(rem[rem.length - 1]) || /^[A-Z]{2}\s+\d{5}/.test(rem[rem.length - 1]))) {
        const statePin = rem.pop();
        const pinMatch = statePin.match(/^([A-Za-z\s]+?)\s+\d{5,6}$/);
        const knownStates = new Set(['Karnataka', 'Maharashtra', 'Goa', 'Kerala', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Himachal Pradesh', 'Uttarakhand']);
        if (pinMatch && !knownStates.has(pinMatch[1].trim())) {
          city = pinMatch[1].trim();
        }
      }

      if (!city && rem.length > 0) {
        if (rem.length === 1) {
          city = rem[0];
        } else if (rem.length === 2) {
          neighbourhood = rem[0];
          city = rem[1];
        } else if (rem.length >= 3) {
          neighbourhood = rem[0];
          city = rem[rem.length - 1];
        }
      }
    } else {
      name = rawPathQuery;
      // Space-separated check against known cities in state.places and common destinations
      const existingCities = (typeof state !== 'undefined' && state.places) ? 
        Array.from(new Set(state.places.map(p => p.city).filter(Boolean))) : [];
      const commonCities = [
        'Gokarna', 'Goa', 'Mumbai', 'Bengaluru', 'Bangalore', 'Delhi', 'New Delhi', 
        'Pune', 'Jaipur', 'Udaipur', 'Kochi', 'Pondicherry', 'Hampi', 'Manali', 
        'Rishikesh', 'Varkala', 'Alleppey', 'Mysore', 'Chennai', 'Kolkata', 'Hyderabad', 
        'Tokyo', 'Kyoto', 'Paris', 'Rome', 'Bali', 'London', 'New York'
      ];
      const allCities = Array.from(new Set([...existingCities, ...commonCities]));

      for (const c of allCities) {
        const reg = new RegExp(`(?:\\s+|^)(${c})(?:\\s+India)?$`, 'i');
        const match = name.match(reg);
        if (match) {
          city = c;
          const cleanName = name.slice(0, match.index).trim();
          if (cleanName.length > 1) {
            name = cleanName;
          }
          break;
        }
      }
    }
  }

  return { name, city, neighbourhood, country, lat, lng };
}

async function handleMapUrlAutofill() {
  const mapUrlInput = document.getElementById('formMapUrl');
  const indicator = document.getElementById('mapAutofillIndicator');
  if (!mapUrlInput) return;

  const url = mapUrlInput.value.trim();
  if (!url) {
    if (indicator) indicator.classList.add('hidden');
    return;
  }

  const extracted = parseGoogleMapsUrl(url);
  let filledAny = false;

  if (extracted) {
    if (extracted.name) {
      const nameInput = document.getElementById('formName');
      if (nameInput && (!nameInput.value || nameInput.dataset.autofilled === 'true')) {
        nameInput.value = extracted.name;
        nameInput.dataset.autofilled = 'true';
        filledAny = true;
      }
    }

    if (extracted.city) {
      const cityInput = document.getElementById('formCity');
      if (cityInput && (!cityInput.value || cityInput.dataset.autofilled === 'true')) {
        cityInput.value = extracted.city;
        cityInput.dataset.autofilled = 'true';
        filledAny = true;
      }
    }

    if (extracted.neighbourhood) {
      const addrInput = document.getElementById('formAddress');
      if (addrInput && (!addrInput.value || addrInput.dataset.autofilled === 'true')) {
        addrInput.value = extracted.neighbourhood;
        addrInput.dataset.autofilled = 'true';
        filledAny = true;
      }
    }

    if (extracted.country) {
      const countryInput = document.getElementById('formCountry');
      if (countryInput && (!countryInput.value || countryInput.dataset.autofilled === 'true')) {
        countryInput.value = extracted.country;
        countryInput.dataset.autofilled = 'true';
        filledAny = true;
      }
    }

    if (extracted.lat && extracted.lng) {
      document.getElementById('formLat').value = extracted.lat;
      document.getElementById('formLng').value = extracted.lng;
      filledAny = true;
    }

    if (indicator) indicator.classList.remove('hidden');
    if (filledAny && (extracted.name || extracted.city)) {
      const detectedInfo = extracted.name 
        ? `✨ Auto-detected: "${extracted.name}"${extracted.city ? ` in ${extracted.city}` : ''}`
        : `✨ Auto-detected city: "${extracted.city}"`;
      showToast(detectedInfo);
    }
  } else {
    if (indicator) indicator.classList.add('hidden');
  }

  // 2. Fetch server-side resolution for shortened links & metadata
  const hiddenPhotoInput = document.getElementById('formPhotoUrl');
  const userHasUploadedPhoto = hiddenPhotoInput && hiddenPhotoInput.value && hiddenPhotoInput.dataset.source === 'manual';

  try {
    const res = await fetch(`/api/resolve-maps?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      const currentSource = hiddenPhotoInput ? hiddenPhotoInput.dataset.source : '';
      if (data.photoUrl && !userHasUploadedPhoto && currentSource !== 'manual') {
        setPhotoPreview(data.photoUrl, 'map');
        showToast(`📸 Photo auto-fetched from Google Maps`);
      }
      if (data.name) {
        const nameInput = document.getElementById('formName');
        if (nameInput && (!nameInput.value || nameInput.dataset.autofilled === 'true')) {
          nameInput.value = data.name;
          nameInput.dataset.autofilled = 'true';
        }
      }
      if (data.city) {
        const cityInput = document.getElementById('formCity');
        if (cityInput && (!cityInput.value || cityInput.dataset.autofilled === 'true')) {
          cityInput.value = data.city;
          cityInput.dataset.autofilled = 'true';
        }
      }
      if (data.country) {
        const countryInput = document.getElementById('formCountry');
        if (countryInput && (!countryInput.value || countryInput.dataset.autofilled === 'true')) {
          countryInput.value = data.country;
          countryInput.dataset.autofilled = 'true';
        }
      }
      if (data.lat && data.lng) {
        document.getElementById('formLat').value = data.lat;
        document.getElementById('formLng').value = data.lng;
      }
    }
  } catch (e) {
    // Ignore server error and proceed to geocode fallback
  }

  // 3. Fallback: If City is still empty but coordinates exist, reverse geocode in browser!
  const curCityInput = document.getElementById('formCity');
  if (curCityInput && (!curCityInput.value || curCityInput.dataset.autofilled === 'true')) {
    const latVal = parseFloat(document.getElementById('formLat').value);
    const lngVal = parseFloat(document.getElementById('formLng').value);
    if (!isNaN(latVal) && !isNaN(lngVal) && latVal !== 0) {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latVal}&lon=${lngVal}&zoom=12`, {
          headers: { 'Accept': 'application/json' }
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const detectedCity = geoData.address.town || 
                                 geoData.address.city || 
                                 geoData.address.village || 
                                 geoData.address.municipality || 
                                 geoData.address.suburb || 
                                 geoData.address.county;
            if (detectedCity && (!curCityInput.value || curCityInput.dataset.autofilled === 'true')) {
              curCityInput.value = detectedCity;
              curCityInput.dataset.autofilled = 'true';
              showToast(`📍 Auto-detected city: "${detectedCity}"`);
            }
            const countryInput = document.getElementById('formCountry');
            if (countryInput && geoData.address.country && (!countryInput.value || countryInput.dataset.autofilled === 'true')) {
              countryInput.value = geoData.address.country;
              countryInput.dataset.autofilled = 'true';
            }
          }
        }
      } catch (err) {
        // Silently continue if reverse geocode fails
      }
    }
  }
}

// ========================================================
// CRUD & FORM OPERATIONS
// ========================================================
function setStarRating(num, isHover = false) {
  const stars = document.querySelectorAll('.star-btn');
  const labelEl = document.getElementById('starRatingLabel');
  const starsInput = document.getElementById('formRatingStars');
  const ratingInput = document.getElementById('formRating');

  // If num is null/0/empty, reset stars to unselected
  if (!num) {
    stars.forEach(btn => {
      btn.classList.remove('active', 'hovered', 'wave-filling', 'wave-unfilling');
    });
    if (labelEl) {
      labelEl.textContent = 'Select rating (1 to 5 stars)';
      labelEl.style.color = 'var(--stone-500)';
      labelEl.style.fontWeight = '500';
    }
    if (!isHover) {
      if (starsInput) starsInput.value = '';
      if (ratingInput) ratingInput.value = '';
    }
    return;
  }

  const clamped = Math.max(1, Math.min(5, num));
  const prevRating = parseInt(starsInput?.value || '0', 10);

  if (isHover) {
    stars.forEach(btn => {
      const s = parseInt(btn.dataset.star, 10);
      btn.classList.toggle('hovered', s <= clamped);
    });
  } else {
    // 2. Star rating with a wave:
    // If filling up (clamped > prevRating): wave rolling left to right with ~40ms delay
    if (clamped > prevRating) {
      stars.forEach(btn => {
        const s = parseInt(btn.dataset.star, 10);
        btn.classList.remove('hovered');
        if (s <= clamped) {
          if (s > prevRating) {
            const delay = (s - prevRating - 1) * 40;
            setTimeout(() => {
              btn.classList.add('active', 'wave-filling');
              setTimeout(() => btn.classList.remove('wave-filling'), 300);
            }, delay);
          } else {
            btn.classList.add('active');
          }
        } else {
          btn.classList.remove('active', 'wave-filling', 'wave-unfilling');
        }
      });
    } 
    // If lowering rating (clamped < prevRating): unfill wave from right to left with ~40ms delay
    else if (clamped < prevRating) {
      stars.forEach(btn => {
        const s = parseInt(btn.dataset.star, 10);
        btn.classList.remove('hovered');
        if (s <= clamped) {
          btn.classList.add('active');
          btn.classList.remove('wave-filling', 'wave-unfilling');
        } else {
          if (s <= prevRating) {
            const delay = (prevRating - s) * 40;
            setTimeout(() => {
              btn.classList.remove('active');
              btn.classList.add('wave-unfilling');
              setTimeout(() => btn.classList.remove('wave-unfilling'), 250);
            }, delay);
          } else {
            btn.classList.remove('active', 'wave-filling', 'wave-unfilling');
          }
        }
      });
    } else {
      // Same rating clicked: ensure active states
      stars.forEach(btn => {
        const s = parseInt(btn.dataset.star, 10);
        btn.classList.remove('hovered');
        btn.classList.toggle('active', s <= clamped);
      });
    }

    if (starsInput) starsInput.value = clamped;
    if (ratingInput) ratingInput.value = STAR_RATING_KEYS[clamped] || 'must_visit';
  }

  const targetNum = isHover ? clamped : (parseInt(starsInput?.value || '0', 10) || clamped);
  if (labelEl) {
    if (targetNum > 0) {
      labelEl.textContent = STAR_DESCRIPTIONS[targetNum] || `${targetNum} Stars`;
      labelEl.style.color = 'var(--stone-800)';
      labelEl.style.fontWeight = '700';
    } else {
      labelEl.textContent = 'Select rating (1 to 5 stars)';
      labelEl.style.color = 'var(--stone-500)';
      labelEl.style.fontWeight = '500';
    }
  }
}

function setVisitStatus(isVisited) {
  const hiddenInput = document.getElementById('formIsVisited');
  if (hiddenInput) hiddenInput.value = isVisited ? 'true' : 'false';

  const checkbox = document.getElementById('formVisitedCheckbox');
  if (checkbox && checkbox.checked !== isVisited) {
    checkbox.checked = isVisited;
  }

  const toggleCard = document.getElementById('visitToggleCard');
  const toggleTitle = document.getElementById('visitToggleTitle');
  const toggleBadge = document.getElementById('visitToggleBadge');

  if (toggleCard) toggleCard.classList.toggle('saw-on-way', !isVisited);

  const ratingGroup = document.getElementById('formRatingGroup');
  const visitDateGroup = document.getElementById('formVisitDateGroup');
  const notesLabel = document.getElementById('formNotesLabel');
  const notesInput = document.getElementById('formNotes');

  if (isVisited) {
    if (toggleTitle) toggleTitle.textContent = 'I visited / stayed here';
    if (toggleBadge) {
      toggleBadge.textContent = 'Visited';
      toggleBadge.className = 'visit-toggle-badge badge-visited';
    }
    if (ratingGroup) ratingGroup.classList.remove('hidden');
    if (visitDateGroup) visitDateGroup.classList.remove('hidden');
    if (notesLabel) notesLabel.innerHTML = 'Note & personal memory';
    if (notesInput) notesInput.placeholder = 'Why you loved it, ambience, staff, vibe, booking advice...';
  } else {
    if (toggleTitle) toggleTitle.textContent = 'Saw on the way (not stayed yet)';
    if (toggleBadge) {
      toggleBadge.textContent = 'Saw on the way';
      toggleBadge.className = 'visit-toggle-badge badge-saw-on-way';
    }
    if (ratingGroup) ratingGroup.classList.add('hidden');
    if (visitDateGroup) visitDateGroup.classList.add('hidden');
    if (notesLabel) notesLabel.innerHTML = 'Notes & details (contacts, what you saw)';
    if (notesInput) notesInput.placeholder = 'Contact numbers, landmarks, observations...';
  }
  lucide.createIcons();
}

function compressAndResizeImage(file, maxDimension = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function setPhotoPreview(url, source = 'manual') {
  const prompt = document.getElementById('photoUploadPrompt');
  const previewContainer = document.getElementById('photoPreviewContainer');
  const previewImg = document.getElementById('photoPreviewImg');
  const hiddenInput = document.getElementById('formPhotoUrl');
  const badge = document.getElementById('photoSourceBadge');
  const noticeContainer = document.getElementById('photoNoticeContainer');
  const googleNotice = document.getElementById('googlePhotoReplaceNotice');
  const manualNotice = document.getElementById('manualPhotoNotice');
  const mobileChoice = document.getElementById('mobilePhotoChoice');

  if (url) {
    hiddenInput.value = url;
    hiddenInput.dataset.source = source;
    previewImg.src = url;
    prompt?.classList.add('hidden');
    if (mobileChoice) mobileChoice.classList.add('hidden');
    previewContainer?.classList.remove('hidden');

    if (badge) {
      if (source === 'map') {
        badge.classList.remove('hidden');
        badge.textContent = 'From Google Maps';
      } else {
        badge.classList.add('hidden');
      }
    }

    if (noticeContainer) noticeContainer.classList.remove('hidden');
    if (googleNotice) googleNotice.classList.toggle('hidden', source !== 'map');
    if (manualNotice) manualNotice.classList.toggle('hidden', source === 'map');
  } else {
    hiddenInput.value = '';
    hiddenInput.dataset.source = '';
    previewImg.src = '';
    prompt?.classList.remove('hidden');
    if (mobileChoice) mobileChoice.classList.remove('hidden');
    previewContainer?.classList.add('hidden');
    if (badge) badge.classList.add('hidden');
    if (noticeContainer) noticeContainer.classList.add('hidden');
    if (googleNotice) googleNotice.classList.add('hidden');
    if (manualNotice) manualNotice.classList.add('hidden');
    const fileInput = document.getElementById('formPhotoFile');
    const camInput = document.getElementById('formCameraFile');
    const galInput = document.getElementById('formGalleryFile');
    if (fileInput) fileInput.value = '';
    if (camInput) camInput.value = '';
    if (galInput) galInput.value = '';
  }
  lucide.createIcons();
}

// ========================================================
// MODAL BACKGROUND LOCK & ACCESSIBILITY MANAGEMENT
// ========================================================
function onModalOpen() {
  document.body.classList.add('modal-open');
  const bgElements = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
  bgElements.forEach(el => {
    if (el) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

function onModalClose() {
  const anyOpen = document.querySelectorAll('.modal-backdrop:not(.hidden)').length > 0;
  if (!anyOpen) {
    document.body.classList.remove('modal-open');
    const bgElements = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
    bgElements.forEach(el => {
      if (el) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }
}

function openPlaceModal(place = null) {
  if (state.isReadOnly) {
    showToast('Editing is disabled in view-only mode.');
    return;
  }
  const modal = document.getElementById('placeModal');
  const form = document.getElementById('placeForm');
  const heading = document.getElementById('modalHeading');
  const todayStr = new Date().toISOString().split('T')[0];

  form.reset();
  const indicator = document.getElementById('mapAutofillIndicator');
  if (indicator) indicator.classList.add('hidden');

  const isVisited = place ? (place.visited !== false) : true;
  setVisitStatus(isVisited);

  if (place) {
    heading.textContent = 'Edit place';
    document.getElementById('placeId').value = place.id;
    document.getElementById('formMapUrl').value = place.mapUrl || '';
    document.getElementById('formName').value = place.name || '';
    document.getElementById('formCity').value = place.city || '';
    document.getElementById('formCountry').value = place.country || 'India';
    document.getElementById('formCategory').value = normalizeCategory(place.category);
    document.getElementById('formAddress').value = place.address || '';

    // Star Rating
    let starVal = getPlaceStars(place);
    setStarRating(starVal, false);

    // Visited on: if valid YYYY-MM-DD, set it; else default to today's date
    if (place.visitDate && /^\d{4}-\d{2}-\d{2}$/.test(place.visitDate)) {
      document.getElementById('formVisitDate').value = place.visitDate;
    } else {
      document.getElementById('formVisitDate').value = todayStr;
    }

    document.getElementById('formLat').value = place.lat || '';
    document.getElementById('formLng').value = place.lng || '';
    document.getElementById('formNotes').value = place.notes || '';
    
    // Photo
    setPhotoPreview(place.photoUrl || null, place.photoSource || 'manual');
    if (document.getElementById('formPhotoUrlInput')) {
      document.getElementById('formPhotoUrlInput').value = place.photoUrl || '';
    }
  } else {
    heading.textContent = 'Add new place';
    document.getElementById('placeId').value = '';
    document.getElementById('formMapUrl').value = '';
    document.getElementById('formName').value = '';
    document.getElementById('formName').dataset.autofilled = 'false';
    document.getElementById('formCity').dataset.autofilled = 'false';
    document.getElementById('formAddress').dataset.autofilled = 'false';
    document.getElementById('formCountry').dataset.autofilled = 'false';
    document.getElementById('formLat').value = '';
    document.getElementById('formLng').value = '';
    
    // Default country: India
    document.getElementById('formCountry').value = 'India';

    if (state.selectedCity !== 'all') {
      document.getElementById('formCity').value = state.selectedCity;
      const existing = state.places.find(p => p.city.toLowerCase() === state.selectedCity.toLowerCase());
      if (existing && existing.country) {
        document.getElementById('formCountry').value = existing.country;
      }
    } else {
      document.getElementById('formCity').value = '';
    }

    if (state.selectedCategory !== 'all') {
      document.getElementById('formCategory').value = state.selectedCategory;
    } else {
      document.getElementById('formCategory').value = 'food';
    }

    // Rating: EMPTY BY DEFAULT!
    setStarRating(null, false);

    // Auto-select today's date
    document.getElementById('formVisitDate').value = todayStr;

    document.getElementById('formNotes').value = '';

    // Reset photo
    setPhotoPreview(null);
    if (document.getElementById('formPhotoUrlInput')) {
      document.getElementById('formPhotoUrlInput').value = '';
    }
  }

  lucide.createIcons();
  modal.classList.remove('hidden');
  const formBody = document.querySelector('#placeModal .modal-form-body');
  if (formBody) formBody.scrollTop = 0;
  onModalOpen();

  // Set focus to the first entry: Google Maps Link!
  setTimeout(() => {
    const mapInput = document.getElementById('formMapUrl');
    if (mapInput) mapInput.focus();
  }, 100);
}

function closePlaceModal() {
  document.getElementById('placeModal').classList.add('hidden');
  onModalClose();
}

function handlePlaceFormSubmit(e) {
  e.preventDefault();

  try {
    const isVisited = document.getElementById('formIsVisited').value === 'true';
    const id = document.getElementById('placeId').value || ('place-' + Date.now());
    let mapUrl = document.getElementById('formMapUrl').value.trim();
    const name = document.getElementById('formName').value.trim();
    const city = document.getElementById('formCity').value.trim();
    const country = document.getElementById('formCountry').value.trim() || 'India';
    const address = document.getElementById('formAddress').value.trim();
    const category = document.getElementById('formCategory').value;
    const stars = isVisited ? parseInt(document.getElementById('formRatingStars').value || '0', 10) : null;
    const visitDate = isVisited ? document.getElementById('formVisitDate').value.trim() : '';
    const notes = document.getElementById('formNotes') ? document.getElementById('formNotes').value.trim() : '';
    const photoInputEl = document.getElementById('formPhotoUrl');
    const photoUrl = photoInputEl ? photoInputEl.value.trim() : '';
    const photoSource = (photoInputEl && photoInputEl.dataset.source) ? photoInputEl.dataset.source : 'manual';
    let lat = parseFloat(document.getElementById('formLat').value);
    let lng = parseFloat(document.getElementById('formLng').value);

    // Validate mandatory fields
    if (!name) {
      showToast('Please enter the place name');
      document.getElementById('formName').focus();
      return;
    }
    if (!city) {
      showToast('Please enter the city');
      document.getElementById('formCity').focus();
      return;
    }
    if (!country) {
      showToast('Please enter the country');
      document.getElementById('formCountry').focus();
      return;
    }

    if (isVisited) {
      if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
        showToast('Please select a rating (1 to 5 stars)');
        const starWidget = document.getElementById('starRatingWidget');
        if (starWidget) {
          starWidget.style.borderColor = '#ef4444';
          starWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => starWidget.style.borderColor = '', 2000);
        }
        return;
      }
      if (!visitDate) {
        showToast('Please select the date visited');
        document.getElementById('formVisitDate').focus();
        return;
      }
    }

    const rating = isVisited ? (STAR_RATING_KEYS[stars] || 'must_visit') : '';

    if (isNaN(lat) || isNaN(lng) || lat === 0) {
      const existingWithCoords = state.places.find(p => p.city.toLowerCase() === city.toLowerCase() && typeof p.lat === 'number');
      if (existingWithCoords) {
        lat = existingWithCoords.lat + (Math.random() - 0.5) * 0.02;
        lng = existingWithCoords.lng + (Math.random() - 0.5) * 0.02;
      } else {
        lat = 0;
        lng = 0;
      }
    }

    const existingIndex = state.places.findIndex(p => p.id === id);
    const placeData = {
      id,
      name,
      city,
      country,
      category,
      visited: isVisited,
      rating,
      stars,
      visitDate,
      address,
      lat,
      lng,
      mapUrl,
      photoUrl,
      photoSource,
      notes,
      createdAt: existingIndex >= 0 ? state.places[existingIndex].createdAt : Date.now()
    };

    if (existingIndex >= 0) {
      state.places[existingIndex] = placeData;
      showToast(`Updated "${name}"`);
    } else {
      state.places.unshift(placeData);
      state.justAddedPlaceId = placeData.id;
      if (window.innerWidth <= 768) {
        if (window.updateLayoutMode) window.updateLayoutMode('map');
      } else if (state.viewMode === 'grid') {
        if (window.updateLayoutMode) window.updateLayoutMode('split');
      }
      showToast('Saved new place');
    }

    savePlacesToStorage();
    closePlaceModal();
    renderApp();
  } catch (err) {
    console.error('Error saving place in handlePlaceFormSubmit:', err);
    showToast('Failed to save: ' + (err.message || 'unknown error'));
  }
}

// Preview / trigger pin drop animation anytime
window.triggerPinDrop = function(placeId) {
  const targetId = placeId || (state.places[0] && state.places[0].id);
  if (!targetId) return;
  const place = state.places.find(p => p.id === targetId);
  if (!place) return;
  state.justAddedPlaceId = targetId;
  if (window.innerWidth <= 768) {
    if (window.updateLayoutMode) window.updateLayoutMode('map');
  } else if (state.viewMode === 'grid') {
    if (window.updateLayoutMode) window.updateLayoutMode('split');
  }
  renderApp();
};

window.editPlace = function(id) {
  const place = state.places.find(p => p.id === id);
  if (place) {
    openPlaceModal(place);
  }
};

window.editPlaceWithVisited = function(id, isVisited) {
  const place = state.places.find(p => p.id === id);
  if (place) {
    openPlaceModal(place);
    setVisitStatus(isVisited);
    if (isVisited) {
      setTimeout(() => {
        const starBtn = document.querySelector('.star-btn[data-star="5"]');
        if (starBtn) starBtn.focus();
      }, 150);
    }
  }
};

window.quickToggleSawOnWay = function(id) {
  const place = state.places.find(p => p.id === id);
  if (!place) return;
  place.visited = false;
  savePlacesToStorage();
  renderApp();
  showToast(`Marked "${place.name}" as saw on the way`);
};

window.mobilePhotoSheetTarget = null;

window.openMobilePhotoSheet = function(target) {
  window.mobilePhotoSheetTarget = target;
  const sheet = document.getElementById('mobilePhotoActionSheet');
  const titleEl = document.getElementById('mobileSheetTitle');
  if (sheet) {
    if (titleEl) {
      if (target === 'modal') {
        titleEl.textContent = 'Add Place Photo';
      } else {
        const place = state.places.find(p => p.id === target);
        titleEl.textContent = place ? `Photo: ${place.name}` : 'Change Photo';
      }
    }
    sheet.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
    requestAnimationFrame(() => {
      sheet.classList.add('active');
    });
  }
};

window.closeMobilePhotoSheet = function() {
  const sheet = document.getElementById('mobilePhotoActionSheet');
  if (sheet) {
    sheet.classList.remove('active');
    setTimeout(() => {
      sheet.classList.add('hidden');
      window.mobilePhotoSheetTarget = null;
    }, 250);
  } else {
    window.mobilePhotoSheetTarget = null;
  }
};

window.quickChangePhoto = function(placeId) {
  const place = state.places.find(p => p.id === placeId);
  if (!place) return;
  if (window.innerWidth <= 768) {
    window.openMobilePhotoSheet(placeId);
  } else {
    state.targetPhotoPlaceId = placeId;
    const input = document.getElementById('quickPhotoInput');
    if (input) {
      input.value = '';
      input.click();
    }
  }
};

window.deletePlace = function(id) {
  const place = state.places.find(p => p.id === id);
  if (!place) return;

  if (confirm(`Are you sure you want to remove "${place.name}" from your collection?`)) {
    state.places = state.places.filter(p => p.id !== id);
    savePlacesToStorage();
    renderApp();
    showToast(`Removed "${place.name}"`);
  }
};

window.toggleCardMenu = function(placeId, event) {
  if (event) {
    event.stopPropagation();
  }
  const menu = document.getElementById(`cardMenu-${placeId}`);
  if (!menu) return;

  const isHidden = menu.classList.contains('hidden');
  window.closeAllCardMenus();
  if (isHidden) {
    menu.classList.remove('hidden');
    lucide.createIcons();
  }
};

window.closeAllCardMenus = function() {
  document.querySelectorAll('.card-menu-dropdown').forEach(m => m.classList.add('hidden'));
};

// ========================================================
// SHARING ENGINE (WhatsApp / Message generator)
// ========================================================
function openShareModal() {
  const modal = document.getElementById('shareModal');
  const scopeSelect = document.getElementById('shareScopeSelect');

  const cityCounts = getCityCounts();
  const sortedCities = Object.keys(cityCounts).sort();

  scopeSelect.innerHTML = '';

  if (state.selectedCity !== 'all') {
    const currentCityOpt = document.createElement('option');
    currentCityOpt.value = `city:${state.selectedCity}`;
    currentCityOpt.textContent = `📍 Only ${state.selectedCity} (${cityCounts[state.selectedCity] || 0} places)`;
    scopeSelect.appendChild(currentCityOpt);
  }

  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = `🌍 All Cities (${state.places.length} places)`;
  scopeSelect.appendChild(allOpt);

  sortedCities.forEach(city => {
    if (city !== state.selectedCity) {
      const opt = document.createElement('option');
      opt.value = `city:${city}`;
      opt.textContent = `📍 ${city} (${cityCounts[city]} places)`;
      scopeSelect.appendChild(opt);
    }
  });

  const webInput = document.getElementById('shareWebUrlInput');
  if (webInput) {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('view', 'guest');
    webInput.value = url.toString();
  }

  updateSharePreview();
  modal.classList.remove('hidden');
  onModalOpen();
}

function closeShareModal() {
  document.getElementById('shareModal').classList.add('hidden');
  onModalClose();
}

function generateShareText() {
  const scope = document.getElementById('shareScopeSelect').value;
  let targetPlaces = [];
  let headerTitle = '';

  if (scope.startsWith('city:')) {
    const cityName = scope.replace('city:', '');
    targetPlaces = state.places.filter(p => p.city.toLowerCase() === cityName.toLowerCase());
    headerTitle = `✈️ My Travel Guide & Top Recommendations: ${cityName.toUpperCase()}`;
  } else {
    targetPlaces = [...state.places];
    headerTitle = `✈️ My Curated Travel Guide (TravelPins)`;
  }

  if (targetPlaces.length === 0) {
    return 'No places found in this guide.';
  }

  const byCategory = {};
  targetPlaces.forEach(p => {
    const norm = normalizeCategory(p.category);
    if (!byCategory[norm]) byCategory[norm] = [];
    byCategory[norm].push(p);
  });

  let text = `${headerTitle}\n`;
  text += `Here are my favorite spots, things to order, and places to stay!\n`;
  text += `═════════════════════════════════\n\n`;

  const categoryOrder = ['food', 'homestay', 'hotel', 'culture', 'gem', 'transport'];

  categoryOrder.forEach(catKey => {
    const placesInCat = byCategory[catKey];
    if (!placesInCat || placesInCat.length === 0) return;

    const catMeta = CATEGORIES[catKey] || { label: catKey, emoji: '📍' };
    text += `${catMeta.emoji} ${catMeta.label.toUpperCase()}\n`;
    text += `─────────────────────────────────\n`;

    placesInCat.forEach((p, idx) => {
      const isVisited = p.visited !== false;
      const ratingMeta = RATINGS[p.rating] || RATINGS.must_visit;
      const statusLabel = isVisited ? `[${ratingMeta.label}]` : `[Saw on the way]`;
      text += `${idx + 1}. ${p.name} — ${statusLabel}\n`;
      if (p.address || p.city) {
        text += `   📍 ${p.address || p.city}\n`;
      }
      if (p.notes) {
        text += `   📝 Note: ${p.notes}\n`;
      }
      if (p.mapUrl) {
        text += `   🔗 Maps: ${p.mapUrl}\n`;
      }
      text += `\n`;
    });
  });

  text += `Created with TravelPins — Safe travels! 🎒✨`;
  return text;
}

function updateSharePreview() {
  const preview = document.getElementById('shareTextPreview');
  preview.value = generateShareText();
}

function handleCopyShareText() {
  const text = document.getElementById('shareTextPreview').value;
  navigator.clipboard.writeText(text).then(() => {
    const label = document.getElementById('copyBtnLabel');
    label.textContent = 'Copied to clipboard!';
    showToast('Guide copied! Ready to paste into WhatsApp, iMessage, or email.');
    setTimeout(() => {
      label.textContent = 'Copy message';
    }, 2500);
  }).catch(() => {
    showToast('Failed to copy. Please select and copy manually.');
  });
}

function handleCopyWebLink() {
  const input = document.getElementById('shareWebUrlInput');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const label = document.getElementById('copyWebLinkBtnLabel');
    if (label) label.textContent = 'Copied!';
    showToast('Link copied! Friends viewing this link cannot edit or delete spots.');
    setTimeout(() => {
      if (label) label.textContent = 'Copy link';
    }, 2500);
  }).catch(() => {
    showToast('Failed to copy. Please copy manually.');
  });
}

function handleOpenWhatsApp() {
  const text = document.getElementById('shareTextPreview').value;
  const encoded = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
}

window.shareSinglePlace = function(id) {
  const place = state.places.find(p => p.id === id);
  if (!place) return;

  const normCat = normalizeCategory(place.category);
  const catMeta = CATEGORIES[normCat] || { label: place.category, emoji: '📍' };
  const isVisited = place.visited !== false;
  const ratingMeta = RATINGS[place.rating] || RATINGS.must_visit;
  const statusLabel = isVisited ? `[${ratingMeta.label}]` : `[Saw on the way]`;

  let msg = `Hey! Here is a spot in ${place.city}:\n\n`;
  msg += `${catMeta.emoji} *${place.name}* ${statusLabel}\n`;
  if (place.address) msg += `📍 ${place.address}, ${place.city}\n`;
  if (place.notes) msg += `📝 ${place.notes}\n`;
  if (place.mapUrl) msg += `🔗 Maps: ${place.mapUrl}\n`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
};

// ========================================================
// UTILITIES
// ========================================================
let toastTimeout = null;
let toastExitTimeout = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  // Clear existing timers: only one toast shows at a time
  if (toastTimeout) clearTimeout(toastTimeout);
  if (toastExitTimeout) clearTimeout(toastExitTimeout);

  toastMsg.textContent = msg;
  toast.classList.remove('hidden', 'toast-exiting');
  toast.classList.add('show');

  // Stays for about 2 seconds, then slides down slightly and fades out (~250ms)
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('toast-exiting');
    toastExitTimeout = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('toast-exiting');
    }, 280);
  }, 2000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ========================================================
// AUTOMATIC LIVE RELOAD CLIENT
// ========================================================
(function initLiveReload() {
  if (!window.location.protocol.startsWith('http')) return;

  let initialMtime = null;
  setInterval(async () => {
    try {
      const res = await fetch('/api/live-reload?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.mtime === 'number') {
          if (initialMtime === null) {
            initialMtime = data.mtime;
          } else if (data.mtime > initialMtime) {
            console.log('[TravelPins] File modification detected. Auto-reloading page...');
            window.location.reload();
          }
        }
      }
    } catch (e) {
      // Ignore network errors during reload
    }
  }, 1000);
})();
