# 🚀 REMAINING FEATURES TO IMPLEMENT

## 🎯 Phase 3: Google Maps Integration (NEXT UP!)

### 3.1 Setup
- [ ] Get Google Maps API key from Google Cloud Console
- [ ] Add to `.env`: `NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here`
- [ ] Install `@googlemaps/react-wrapper` or use native script loader
- [ ] Enable APIs: Places API, Maps JavaScript API, Geocoding API

### 3.2 Restaurant Nomination Autocomplete
- [ ] Replace address input with Google Places Autocomplete
- [ ] Show restaurant suggestions as user types
- [ ] Auto-fill fields when restaurant selected:
  - Name
  - Full address
  - Rating (1-5 stars)
  - Price level ($-$$$$)
  - place_id (save to metadata)
  - photos URLs (first 3)
  - phone number
  - website URL
  - opening hours

### 3.3 Map Display in Room
- [ ] Add map component to room detail page
- [ ] Center on all nominated restaurants
- [ ] Custom markers for each nomination
- [ ] Clickable markers show nomination details
- [ ] "Directions" button links to Google Maps

### 3.4 Enhanced Nomination Cards
- [ ] Display restaurant photo (from Places API)
- [ ] Show star rating with visual stars ⭐⭐⭐⭐⭐
- [ ] Display address with pin icon
- [ ] Show price level as $$$ symbols
- [ ] Link to restaurant website
- [ ] Phone number (click to call on mobile)

---

## 🎬 Phase 4: TMDB Movie Integration

### 4.1 Setup
- [ ] Get TMDB API key from https://www.themoviedb.org/settings/api
- [ ] Add to `.env`: `TMDB_API_KEY=your_key_here`
- [ ] Install or use fetch for API calls

### 4.2 Movie Search
- [ ] Replace movie title input with search component
- [ ] Debounced search (500ms delay)
- [ ] Display results with posters
- [ ] Show: title, year, rating
- [ ] Select movie from results

### 4.3 Movie Details Display
- [ ] Fetch full details when movie selected
- [ ] Save to metadata:
  - tmdb_id
  - imdb_id
  - title
  - overview (plot)
  - poster_path (full URL)
  - backdrop_path
  - vote_average (rating)
  - genres (array)
  - runtime (minutes)
  - release_date
  - trailer_key (YouTube)
- [ ] Display in nomination card:
  - Poster image (230x345px)
  - Rating badge (⭐ 8.5/10)
  - Genre tags (Action, Sci-Fi, etc.)
  - Runtime (2h 28m format)
  - Short plot (first 200 chars)
  - Link to TMDB page
  - Link to IMDB page
- [ ] Optional: Embed YouTube trailer

---

## 📧 Phase 5: Email Invitation System

### 5.1 Email Service Setup
- [ ] Choose provider: Resend (recommended), SendGrid, or Nodemailer
- [ ] Install package: `npm install resend` or `sendgrid`
- [ ] Get API key and add to `.env`
- [ ] Create email templates folder

### 5.2 Email Templates
- [ ] Design HTML email template:
  - HangOut logo
  - Room name and description
  - Room type icon
  - Personalized greeting
  - Join button (links to invite page)
  - Footer with unsubscribe
- [ ] Plain text fallback

### 5.3 Send Invitations
- [ ] Create invitation modal in room page
- [ ] Input: email addresses (comma-separated or multi-input)
- [ ] API endpoint: `POST /api/rooms/[id]/invite`
- [ ] Validate emails
- [ ] Send emails with invite link
- [ ] Track invitation status (sent, opened, joined)

### 5.4 Join via Invite Link
- [ ] Create page: `/invite/[code]`
- [ ] Look up room by inviteCode
- [ ] Show room preview (name, type, description, member count)
- [ ] If not logged in: redirect to sign in/up with return URL
- [ ] If logged in: "Join Room" button
- [ ] Add user as PARTICIPANT member
- [ ] Redirect to room page

---

## 💰 Phase 6: Bill Splitter

### 6.1 Order Entry UI
- [ ] "Split Bill" button in room (only for RESTAURANT & HOME_TAKEOUT types)
- [ ] Change room status to COMPLETED
- [ ] Modal for entering orders
- [ ] Each member sees their section
- [ ] Add item: name, price, quantity
- [ ] Mark items as "shared" (split cost)

### 6.2 Calculation Engine
- [ ] Calculate subtotal per person
- [ ] Tax input (percentage or fixed)
- [ ] Tip input (percentage or fixed)
- [ ] Pro-rate tax/tip based on subtotal ratio
- [ ] Display running total as items added

### 6.3 Summary Display
- [ ] Breakdown table:
  - Column per person
  - Row per item
  - Subtotal row
  - Tax row (pro-rated)
  - Tip row (pro-rated)
  - **TOTAL** row (bold)
- [ ] Export to CSV
- [ ] Optional: Generate PDF receipt

### 6.4 Payment Requests (Optional)
- [ ] Generate payment links:
  - Venmo: `venmo://paycharge?recipients=username&amount=25.50`
  - PayPal: `paypal.me/username/25.50`
  - Cash App: `cash.app/$username/25.50`
- [ ] QR codes for payment apps

---

## 🎲 Phase 7: BoardGameGeek Integration

### 7.1 Setup
- [ ] Research BGG XML API documentation
- [ ] Create API wrapper functions
- [ ] Handle XML parsing (xml2js package)

### 7.2 Game Search
- [ ] Search endpoint: `https://boardgamegeek.com/xmlapi2/search?query=catan`
- [ ] Parse results
- [ ] Display: name, year published, type

### 7.3 Game Details
- [ ] Fetch details: `https://boardgamegeek.com/xmlapi2/thing?id=13`
- [ ] Save metadata:
  - bgg_id
  - name
  - year_published
  - min_players, max_players
  - playing_time
  - min_age
  - average_rating
  - complexity (weight)
  - description
  - image URL
- [ ] Display in nomination card:
  - Game image
  - Player count badge (2-4 players)
  - Duration badge (60-90 min)
  - Complexity meter (1-5)
  - Rating (⭐ 7.8/10)
  - Link to BGG page

---

## 🔔 Phase 8: Real-Time Updates

### 8.1 Choose Technology
- [ ] Option A: Pusher (easiest, free tier: 100 connections)
- [ ] Option B: Ably (generous free tier)
- [ ] Option C: Native WebSockets (more complex)
- [ ] Recommended: Pusher for MVP

### 8.2 Setup Pusher
- [ ] Create account at pusher.com
- [ ] Get credentials (app_id, key, secret, cluster)
- [ ] Add to `.env`
- [ ] Install: `npm install pusher pusher-js`
- [ ] Create `lib/pusher.ts` server instance
- [ ] Create `lib/pusherClient.ts` client instance

### 8.3 Implement Channels
- [ ] Create channel per room: `room-${roomId}`
- [ ] Events to broadcast:
  - `nomination-added`
  - `nomination-deleted`
  - `vote-added`
  - `vote-removed`
  - `member-joined`
  - `member-left`
  - `status-changed`

### 8.4 Client Subscription
- [ ] Subscribe to room channel in room page
- [ ] Listen for events
- [ ] Update UI optimistically
- [ ] Show toast notifications:
  - "John added a new restaurant nomination"
  - "Sarah voted for Pizza Palace"
  - "Mike joined the room"

---

## ⚙️ Phase 9: Room Management

### 9.1 Room Settings
- [ ] Settings modal/page
- [ ] Edit room name
- [ ] Edit description
- [ ] Change room type (with confirmation)
- [ ] Delete room (creator only, with confirmation)
- [ ] Archive room (moves to ARCHIVED status)

### 9.2 Member Management
- [ ] Members list with actions (creator only):
  - Remove member
  - Promote to co-creator
  - Ban member (prevent re-joining)
- [ ] Leave room button (participants)
- [ ] Confirmation modals

### 9.3 Nomination Management
- [ ] Edit nomination button (creator only)
- [ ] Delete nomination button (creator + room creator)
- [ ] Confirmation modals

---

## 🎨 Phase 10: Polish & Enhancements

### 10.1 Nomination Metadata Display
- [ ] Show metadata in cards:
  - Restaurant: cuisine badge, price range, address snippet
  - Takeout: cuisine badge, delivery platform logo
  - Drinks: drink type badge, ingredients preview
  - Games: player count, duration, complexity
  - Movies: genre tags, runtime, rating

### 10.2 Sorting & Filtering
- [ ] Sort nominations by:
  - Most votes (default)
  - Newest first
  - Oldest first
  - Alphabetical
- [ ] Filter rooms by:
  - Status (Planning, Voting, etc.)
  - Type (Restaurant, Movie, etc.)
- [ ] Search rooms by name

### 10.3 Winner Selection
- [ ] Automatic: highest voted nomination
- [ ] Manual: creator can mark winner
- [ ] Display winner prominently
- [ ] Lock voting after decided

### 10.4 User Experience
- [ ] Loading skeletons
- [ ] Optimistic UI updates
- [ ] Error boundaries
- [ ] Toast notifications (react-hot-toast)
- [ ] Confirmation modals
- [ ] Empty states with helpful CTAs

---

## 📱 Phase 11: PWA & Mobile

### 11.1 Progressive Web App
- [ ] Add manifest.json
- [ ] Service worker for offline support
- [ ] Install prompt
- [ ] Push notifications

### 11.2 Mobile Optimizations
- [ ] Touch gestures (swipe to delete, pull to refresh)
- [ ] Native share API
- [ ] Haptic feedback
- [ ] Bottom sheets instead of modals

---

## 🔒 Phase 12: Security & Performance

### 12.1 Security
- [ ] Rate limiting on API endpoints
- [ ] CSRF protection
- [ ] XSS sanitization
- [ ] File upload virus scanning
- [ ] Secure headers

### 12.2 Performance
- [ ] Image optimization (next/image)
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Database query optimization
- [ ] Caching strategy

---

## 🎯 PRIORITY ROADMAP

**Week 1: Maps & Movies**
1. Google Maps Integration ⭐⭐⭐
2. TMDB Movie Integration ⭐⭐⭐

**Week 2: Invitations & Billing**
3. Email Invitation System ⭐⭐
4. Bill Splitter ⭐⭐

**Week 3: Real-time & Games**
5. Real-time Updates (Pusher) ⭐⭐
6. BoardGameGeek Integration ⭐

**Week 4: Management & Polish**
7. Room/Member Management ⭐⭐
8. Nomination Metadata Display ⭐⭐
9. Sorting & Filtering ⭐

**Week 5+: Advanced**
10. PWA Features
11. Security Hardening
12. Performance Optimization

---

**Ready to continue? Let's implement Google Maps integration first! 🗺️**
