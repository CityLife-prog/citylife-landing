# CityLyfe Admin Portal & Frontend Verification Checklist

**Instructions**: Test each item below and tell me "check #X" to mark it as verified once you confirm it works.

## CRITICAL FIXES (Must Test First)

### ❌ 1. Stop Duplicate Services Creation
**What to test**: Run migrations and verify no duplicate "Website Audit & Updates" services are created
**How to test**:
1. Check current services count in admin portal Services tab
2. Navigate to `/api/migrate` and run migration
3. Refresh Services tab - count should remain the same
4. ✅ **FIXED**: Modified migration 005 to use `WHERE NOT EXISTS` check

### ❌ 2. Quote Request Redirect
**What to test**: After submitting a quote, you should be redirected to `/request-received` page
**How to test**:
1. Go to homepage footer "Get a Free Quote" form
2. Fill out form and submit
3. Should redirect to `/request-received` thank you page (not stay on homepage)
4. ✅ **FIXED**: Created `/request-received` page and updated Footer.tsx redirect

### ❌ 3. Total Spent Field in Edit Project Form
**What to test**: Edit Project modal should show "Total Spent" field
**How to test**:
1. Admin Portal → Projects tab
2. Click Edit button on any project
3. Verify "Total Spent ($)" field appears after "Budget ($)" field
4. Enter a value, save, and verify it persists
5. ✅ **FIXED**: Added Total Spent field to ProjectEditForm (dashboard.tsx:1981-1991)

---

## ADMIN PORTAL - PROJECTS TAB

### ❌ 4. View More Button Visibility
**What to test**: "View More" button should be the FIRST action button in Projects tab
**How to test**:
1. Admin Portal → Projects tab
2. Look at Actions column (rightmost column)
3. First button should say "View More" (blue text)
4. ✅ **IMPLEMENTED**: View More button at dashboard.tsx:1088-1106

### ❌ 5. View More Expansion Shows All Project Data
**What to test**: Clicking "View More" should expand and show: Description, Category, Technologies, Key Results, Live URL
**How to test**:
1. Click "View More" on any project
2. Row should expand below showing all project details
3. Technologies should display as blue pills
4. Key Results should display as bullet list
5. Button should change to "View Less"
6. ✅ **IMPLEMENTED**: Expandable section at dashboard.tsx:1163-1213

### ❌ 6. Search Functionality
**What to test**: Search box above Projects table filters projects by name or client
**How to test**:
1. Enter project name in "Search" field
2. Table should filter to show only matching projects
3. Clear search - all projects should return
4. ✅ **IMPLEMENTED**: Search at dashboard.tsx:967-973, filter logic at lines 1033-1040

### ❌ 7. Status Filter
**What to test**: "Filter by Status" dropdown filters projects
**How to test**:
1. Select "Completed" from dropdown
2. Should show only completed projects
3. Select "All Statuses" - should show all projects
4. ✅ **IMPLEMENTED**: Filter dropdown at dashboard.tsx:977-991, logic at lines 1028-1031

### ❌ 8. Sort Functionality
**What to test**: "Sort By" dropdown changes project order
**How to test**:
1. Sort by "Project Name" - alphabetical order
2. Sort by "Budget" - highest to lowest
3. Sort by "Last Updated" - most recent first
4. ✅ **IMPLEMENTED**: Sort dropdown at dashboard.tsx:994-1007, logic at lines 1042-1057

### ❌ 9. Quick Action Buttons
**What to test**: All action buttons work correctly
**How to test**:
1. **View Details** (eye icon) - Opens project details modal
2. **Favorite** (star icon) - Currently adds review (placeholder)
3. **Upload Files** (upload icon) - Shows "coming soon" alert
4. **Edit** (pencil icon) - Opens edit project form
5. **Delete** (trash icon) - Shows confirmation, then deletes
6. ✅ **IMPLEMENTED**: Action buttons at dashboard.tsx:1104-1160

### ❌ 10. Total Spent Column in Projects Table
**What to test**: "Total Spent" column shows in Projects table
**How to test**:
1. Projects table should have 7 columns: Project, Client, Status, Budget, Total Spent, Progress, Actions
2. Total Spent should display as `$X,XXX`
3. ✅ **IMPLEMENTED**: Column at dashboard.tsx:1020, display at line 1076

---

## ADMIN PORTAL - SERVICES TAB

### ❌ 11. Services Tab Access
**What to test**: Services tab should be accessible in admin navigation
**How to test**:
1. Admin Portal → Top navigation
2. Click "Services" tab
3. Should load `/admin/services` page without errors
4. ✅ **FIXED**: Services tab syntax error fixed, added to navigation

### ❌ 12. Services Form Text Visibility
**What to test**: Text in Services edit form should be visible (dark text on white background)
**How to test**:
1. Click Edit on any service
2. All form fields should have dark gray text on white background
3. Typing should show dark text, not white on white
4. ✅ **FIXED**: Applied inline styles to all form inputs (services.tsx)

---

## ADMIN PORTAL - AUTHENTICATION

### ❌ 13. Login Form Enter Key
**What to test**: Pressing Enter after password should submit login form
**How to test**:
1. Go to `/login`
2. Enter email and password
3. Press Enter key (don't click button)
4. Should submit form and log in
5. **STATUS**: NOT YET IMPLEMENTED

### ❌ 14. Forgot Password Functionality
**What to test**: "Forgot your password?" link should work end-to-end
**How to test**:
1. Click "Forgot your password?" on login page
2. Enter email
3. Should receive password reset email (check Nodemailer config)
4. Email should contain reset link
5. **STATUS**: NOT YET IMPLEMENTED

---

## ADMIN PORTAL - OVERVIEW TAB

### ❌ 15. New Notifications on Overview
**What to test**: New quote requests should appear as notifications on Overview tab
**How to test**:
1. Submit a quote request from homepage
2. Go to Admin Portal → Overview
3. Should see notification for new quote request
4. **STATUS**: NEEDS VERIFICATION (functionality exists, needs testing)

### ❌ 16. Total Reviews Metric
**What to test**: Overview tab should show "Total Reviews" metric
**How to test**:
1. Admin Portal → Overview tab
2. Look at metric cards at top
3. Should show: Clients, Projects, Reviews, Revenue (in that order)
4. Reviews metric should show count of all reviews
5. **STATUS**: NEEDS VERIFICATION

---

## ADMIN PORTAL - CLIENTS TAB

### ❌ 17. Clients Excel-Style Table
**What to test**: Clients should display as one row per client (not cards)
**How to test**:
1. Admin Portal → Clients tab
2. Should see table layout with rows
3. Each client = one row
4. **STATUS**: NOT YET IMPLEMENTED (currently displays as cards)

---

## ADMIN PORTAL - REVIEWS TAB

### ❌ 18. Review → Project → Client Rigidity
**What to test**: Cannot create review without valid project ID
**How to test**:
1. Try to create a review
2. Project dropdown should be required
3. Cannot submit without selecting a project
4. ✅ **IMPLEMENTED**: Foreign key constraint in migration 007

### ❌ 19. No Orphaned Reviews
**What to test**: Deleting a project should handle associated reviews properly
**How to test**:
1. Create a review linked to a project
2. Delete that project
3. Review should still exist but project_id set to NULL
4. ✅ **IMPLEMENTED**: ON DELETE SET NULL in migration 007

---

## ADMIN PORTAL - MESSAGES TAB

### ❌ 20. Messages Tab Notification Bubble
**What to test**: New quote requests show notification badge on Messages tab
**How to test**:
1. Submit a quote request from homepage
2. Messages tab should show notification badge/bubble
3. **STATUS**: NOT YET IMPLEMENTED

### ❌ 21. Agentized Quote Drafts
**What to test**: New quotes automatically generate draft responses
**How to test**:
1. Submit a quote request
2. Admin can review auto-generated draft
3. Admin can edit before sending
4. **STATUS**: NOT YET IMPLEMENTED

---

## HOMEPAGE FIXES

### ❌ 22. Headline Replacement
**What to test**: Homepage headline should NOT be "Built by Someone Who Actually Answers the Phone"
**How to test**:
1. Go to homepage
2. Check hero section headline
3. **STATUS**: NOT YET IMPLEMENTED (awaiting user to choose from proposed headlines)

### ❌ 23. "What We Build" Subtitle
**What to test**: Subtitle should emphasize systems, tooling, automation
**How to test**:
1. Check "What We Build" section subtitle
2. Should mention backend systems, not just "websites"
3. **STATUS**: NOT YET IMPLEMENTED

### ❌ 24. Backend Services Screenshot Section
**What to test**: New section showing backend updater screenshot
**How to test**:
1. Under "What We Build" section
2. Should show screenshot of backend services
3. Should support expandable UI
4. **STATUS**: NOT YET IMPLEMENTED

---

## HOMEPAGE - PROJECTS + TESTIMONIALS MERGE

### ❌ 25. Unified Projects + Reviews Display
**What to test**: Completed projects with reviews display together
**How to test**:
1. Homepage → Recent Work section
2. Projects with reviews should show project + review side-by-side
3. **STATUS**: PARTIALLY IMPLEMENTED (public/projects.ts returns unified data)

### ❌ 26. Project Carousel
**What to test**: Multiple completed projects rotate every 10 seconds
**How to test**:
1. Create 2+ completed projects
2. Homepage should show carousel
3. Auto-rotates every 10 seconds
4. **STATUS**: NOT YET IMPLEMENTED

### ❌ 27. Clients Satisfied Metric Logic
**What to test**: Completing a project increments "Clients Satisfied"
**How to test**:
1. Check current "Clients Satisfied" count
2. Mark a project as completed
3. Metric should increment by 1
4. ✅ **IMPLEMENTED**: public/projects.ts:62 (Clients Satisfied = completed projects count)

---

## FRONTEND - EXPANDABLE BACKEND TRANSPARENCY

### ❌ 28. "See how this works in the backend!" Links
**What to test**: Expandable links under sections show backend screenshots
**How to test**:
1. Under "What We Build" section
2. Under "Recent Work" section
3. Under "Get a Free Quote" section
4. Click "See how this works in the backend!"
5. Should open modal with screenshot/recording
6. **STATUS**: NOT YET IMPLEMENTED

---

## DATABASE FIXES

### ❌ 29. Review Sequence Fix
**What to test**: Creating new reviews should NOT throw "duplicate key" error
**How to test**:
1. Admin Portal → Reviews tab
2. Click "Add Review"
3. Fill out form and save
4. Should create successfully without "Key (id)=(1) already exists" error
5. ✅ **FIXED**: Migration 008 resets review sequence

---

## SUMMARY

**Total Items**: 29
**Completed**: 14
**Pending User Verification**: 5
**Not Yet Implemented**: 10

### IMMEDIATE ACTION ITEMS FOR USER:
1. ✅ Run migration to fix duplicate services (visit `/api/migrate`)
2. ✅ Test quote submission redirect to `/request-received`
3. ✅ Verify Projects tab "View More" button and expansion
4. ✅ Verify Total Spent field in Edit Project form
5. ✅ Test search, filter, sort in Projects tab
6. ⏳ Choose headline options for homepage (awaiting decision)
7. ⏳ Confirm Clients tab should be table (not cards)
8. ⏳ Confirm which features are priority for next implementation

---

## HOW TO USE THIS CHECKLIST

Tell me: "check #X" for each item you verify works correctly.
Example: "check #4" means you verified the View More button is visible.

I will track progress and know what's working vs what needs fixing.
