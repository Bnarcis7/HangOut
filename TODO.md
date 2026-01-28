# HangOut - Complete Feature Implementation TODO

## ✅ PHASE 1: FOUNDATION (COMPLETED)
- [x] Next.js 16 setup with TypeScript & Tailwind
- [x] Prisma 7 + SQLite database
- [x] NextAuth.js v5 authentication (Credentials + Google OAuth)
- [x] Strong password validation
- [x] Landing page
- [x] Sign in/up pages
- [x] Logo integration
- [x] Dashboard (modern 2026 SaaS design)
- [x] Room creation modal
- [x] Room detail pages with type-specific configurations
- [x] Mobile responsive design

## ✅ PHASE 2: NOMINATION & VOTING SYSTEM (COMPLETED!)
- [x] **2.1 Add Nomination Modal**
  - [x] Dynamic form based on room type
  - [x] Restaurant: Name, address, cuisine, price range
  - [x] Home Takeout: Restaurant/cuisine, delivery platform
  - [x] Drinks: Drink type, recipe/ingredients
  - [x] Games: Game name, player count, duration
  - [x] Movies: Movie title, genre, runtime
  - [x] Custom: Title and description
  - [x] API endpoint: POST /api/nominations/create

- [x] **2.2 Voting System**
  - [x] Upvote/downvote buttons on nominations
  - [x] Vote tracking (one vote per user per nomination)
  - [x] API endpoints: POST /api/nominations/[id]/vote, DELETE /api/nominations/[id]/vote
  - [x] Vote count display
  - [x] Auto-update room status to VOTING when nominations exist
  - [x] Real-time vote count updates (client-side)

- [ ] **2.3 Nomination Management** (NEXT)
  - [ ] Edit nomination (creator only)
  - [ ] Delete nomination (creator only)
  - [ ] Nomination sorting (by votes, by date)
  - [ ] Display metadata (cuisine, price, etc.) in cards

## ✅ PHASE 2.5: USER PROFILE (COMPLETED!)
- [x] Profile page (/profile)
- [x] Avatar upload functionality
- [x] Image storage (public/uploads/avatars)
- [x] Profile picture display
- [x] Name/nickname editing
- [x] Profile link in dashboard header
- [x] Avatar initials fallback

## ✅ PHASE 3: SMART RESTAURANT NOMINATIONS (COMPLETED)
**Alternative Solution: No Google Maps API needed!**

- [x] **3.1 Enhanced Nomination Form**
  - [x] Added optional Website field
  - [x] Added optional Phone field
  - [x] Save all data in metadata JSON

- [x] **3.2 Smart Action Buttons**
  - [x] "Search Menu" → Opens Google search for menu
  - [x] "View on Maps" → Opens Google Maps with address
  - [x] "Website" → Direct link to restaurant site
  - [x] "Call" → Click-to-call phone link

- [x] **3.3 Nomination Card Component**
  - [x] Display all restaurant metadata (address, cuisine, price)
  - [x] Show action buttons based on available data
  - [x] Responsive design for mobile/desktop
  - [x] Support all room types (Restaurant, Takeout, Drinks, Games, Movies)

**See SMART_NOMINATIONS.md for full details**

---

## 🍔 PHASE 4: RESTAURANT MENU INTEGRATION (OPTIONAL - SKIP)
*Smart menu search button provides better UX than embedded menus*
  - [ ] Show prices, descriptions, photos
  - [ ] Allow users to browse while planning

- [ ] **4.3 Order Tracking**
  - [ ] Users select menu items they'll order
  - [ ] Save selections to database
  - [ ] Display "What I'm ordering" section

## 💰 PHASE 5: BILL SPLITTER
- [ ] **5.1 Order Entry**
  - [ ] Modal for entering orders after hangout
  - [ ] Each user inputs: item name, price, quantity
  - [ ] Support for shared items (split between multiple users)

- [ ] **5.2 Calculation**
  - [ ] Calculate subtotal per person
  - [ ] Add tax (user-configurable %)
  - [ ] Add tip (percentage or fixed amount)
  - [ ] Calculate total per person

- [ ] **5.3 Display**
  - [ ] Breakdown table showing:
    - Each person's items
    - Individual subtotals
    - Tax/tip split
    - Final amount owed
  - [ ] Export to CSV/PDF
  - [ ] Payment request links (Venmo, PayPal, etc.)

## 🎬 PHASE 6: IMDB/TMDB INTEGRATION (MOVIE NOMINATIONS)
- [ ] **6.1 Setup**
  - [ ] Get TMDB API key (free, better than IMDB)
  - [ ] Add API key to .env
  - [ ] Install fetch library if needed

- [ ] **6.2 Movie Search**
  - [ ] Search bar in nomination modal
  - [ ] Display movie suggestions with posters
  - [ ] Select movie from search results

- [ ] **6.3 Movie Details**
  - [ ] Fetch: title, poster, rating, genre, runtime, overview
  - [ ] Display in nomination card:
    - Movie poster thumbnail
    - Rating (⭐ 8.5/10)
    - Genre tags
    - Runtime (2h 15m)
    - Short description
    - Link to TMDB/IMDB page
  - [ ] Trailer embed (YouTube)

## 🎲 PHASE 7: BOARD GAME DATABASE
- [ ] **7.1 Board Game API**
  - [ ] Integrate BoardGameGeek XML API
  - [ ] Search board games
  - [ ] Fetch: name, player count, duration, complexity, rating

- [ ] **7.2 Game Nomination**
  - [ ] Search bar in modal
  - [ ] Display game suggestions
  - [ ] Show: player count, playtime, rating
  - [ ] Link to BGG page

- [ ] **7.3 Game Library**
  - [ ] Users can add games to personal collection
  - [ ] Filter nominations by owned games
  - [ ] "I own this" badge on nominations

## 📧 PHASE 8: INVITATION SYSTEM
- [ ] **8.1 Share Link**
  - [ ] Generate shareable link with invite code
  - [ ] Copy to clipboard functionality
  - [ ] QR code generation (optional)

- [ ] **8.2 Email Invitations**
  - [ ] Email service setup (Resend, SendGrid, or Nodemailer)
  - [ ] Email template design
  - [ ] Send invitation emails with:
    - Room name and description
    - Invite link
    - Room type and details
  - [ ] Track invitation status (sent, opened, joined)

- [ ] **8.3 Join via Invite**
  - [ ] Public join page: /invite/[code]
  - [ ] Display room preview
  - [ ] Require sign in/up to join
  - [ ] Auto-add to room after authentication

## 🔔 PHASE 9: REAL-TIME UPDATES
- [ ] **9.1 Setup**
  - [ ] Choose solution: Pusher, Ably, or WebSockets
  - [ ] Install and configure

- [ ] **9.2 Live Updates**
  - [ ] New nominations appear instantly
  - [ ] Vote counts update in real-time
  - [ ] Member joins/leaves notifications
  - [ ] Room status changes

- [ ] **9.3 Notifications**
  - [ ] In-app notification system
  - [ ] Toast messages for events
  - [ ] Browser notifications (optional)

## 🏠 PHASE 10: HOME HANGOUT FEATURES
- [ ] **10.1 Drinks Nominations**
  - [ ] Drink type selector (cocktails, beer, wine, soft drinks)
  - [ ] Recipe field for cocktails
  - [ ] Ingredients list
  - [ ] Link to cocktail recipe sites

- [ ] **10.2 What to Play**
  - [ ] Board games (from Phase 7)
  - [ ] Video games (optional - IGDB API)
  - [ ] Card games database

- [ ] **10.3 Combined View**
  - [ ] Multi-section room view:
    - Takeout options
    - Drinks options
    - Games options
    - Movie options
  - [ ] Separate voting for each category
  - [ ] Final plan summary

## ⚙️ PHASE 11: ROOM MANAGEMENT
- [ ] **11.1 Room Settings**
  - [ ] Edit room name/description
  - [ ] Change room type
  - [ ] Delete room (creator only)
  - [ ] Archive room

- [ ] **11.2 Member Management**
  - [ ] Remove members (creator only)
  - [ ] Promote to co-creator
  - [ ] Member permissions system
  - [ ] Leave room option

- [ ] **11.3 Room Status Flow**
  - [ ] PLANNING → VOTING → DECIDED → COMPLETED → ARCHIVED
  - [ ] Manual status changes
  - [ ] Auto-transition based on events

## 🎨 PHASE 12: ENHANCEMENTS
- [ ] **12.1 User Profile**
  - [ ] Profile page
  - [ ] Avatar upload
  - [ ] Bio/preferences
  - [ ] Hangout history

- [ ] **12.2 Search & Filter**
  - [ ] Search rooms
  - [ ] Filter by status, type
  - [ ] Sort by date, activity

- [ ] **12.3 Analytics**
  - [ ] Room statistics
  - [ ] Popular restaurants/movies
  - [ ] Hangout frequency

- [ ] **12.4 Mobile App**
  - [ ] React Native version (future)
  - [ ] PWA support

---

## 🎯 IMMEDIATE NEXT STEPS:
1. ✅ Build Add Nomination Modal (with dynamic forms for all room types)
2. ✅ Create POST /api/nominations/create endpoint
3. ✅ Implement voting system (upvote/downvote buttons + API)
4. ✅ Google Maps integration for restaurants
5. ✅ TMDB integration for movies
6. ✅ Email invitation system
7. ✅ Bill splitter feature

**Let's start with the nomination modal NOW!**
