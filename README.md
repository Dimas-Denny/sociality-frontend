# Sociality

A social media web app (MVP) where people can share photos, follow each other, like, comment, and save posts. Built as the frontend for the **Sociality API** as part of the WPH Bootcamp.

- **API docs:** https://be-social-media-api-production.up.railway.app/api-swagger/
- **Repository:** https://github.com/Dimas-Denny/sociality-frontend
- **Live demo:** _coming soon_

---

## Features

| Area         | What you can do                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Auth**     | Register, log in, stay signed in after refresh, log out. Expired sessions log out automatically with a notice |
| **Feed**     | Timeline of your posts + people you follow, with infinite scroll. Logged-out visitors see Explore             |
| **Posts**    | Create a post (1 image + caption, drag & drop), view post detail, delete your own post                        |
| **Likes**    | Like / unlike anywhere a post appears, see who liked a post, view posts you liked                             |
| **Comments** | Read, add (with emoji picker) and delete comments. Post owners can delete any comment on their post           |
| **Follow**   | Follow / unfollow from profiles and user lists, browse followers & following                                  |
| **Saves**    | Bookmark posts and view them in the Saved tab                                                                 |
| **Profile**  | My profile with Gallery / Saved / Liked tabs, edit profile with avatar upload                                 |
| **Users**    | Search people by name or username, view public profiles with Gallery / Liked tabs                             |

### UX details

- **Optimistic UI** for like, save, follow and comments: the UI updates instantly, then syncs with the server and rolls back on failure.
- **Idempotent actions**: rapid clicking never double-counts likes, saves or followers.
- **Loading, empty and error states** on every page, with a retry button on errors.
- **Return-to after login**: private actions while logged out redirect to Login, then back to where you were.
- **Responsive**: mobile-first, with dedicated desktop layouts (inline header search, centered columns, comments modal with image + side panel).

---

## Tech Stack

| Tool                                                                      | Used for                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Next.js](https://nextjs.org/) (App Router) + TypeScript                  | Framework & type safety                                     |
| [Tailwind CSS v4](https://tailwindcss.com/)                               | Styling, design tokens from Figma                           |
| [shadcn/ui](https://ui.shadcn.com/) (Base UI)                             | Button, Input, Label, Textarea                              |
| [Redux Toolkit](https://redux-toolkit.js.org/)                            | Client / UI state (auth status, open sheets)                |
| [TanStack Query](https://tanstack.com/query)                              | Server state, caching, infinite queries, optimistic updates |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Forms & validation                                          |
| [Day.js](https://day.js.org/)                                             | Relative time ("2 minutes ago")                             |
| [Axios](https://axios-http.com/)                                          | HTTP client with auth interceptors                          |
| [Sonner](https://sonner.emilkowal.ski/)                                   | Toast notifications                                         |
| [Lucide](https://lucide.dev/)                                             | Icons                                                       |

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone https://github.com/Dimas-Denny/sociality-frontend.git
cd sociality-frontend
npm install
```

### Environment variables

Copy the example file and keep the default API URL:

```bash
cp .env.example .env.local
```

| Variable                   | Description                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Sociality API, without a trailing slash. Default: `https://be-social-media-api-production.up.railway.app` |

### Run

```bash
npm run dev     # development server on http://localhost:3000
npm run build   # production build
npm run start   # run the production build
```

---

## Project Structure

```
src/
├── app/                    # Routes (App Router)
│   ├── (auth)/             # Login, Register — shared auth layout
│   ├── (focus)/            # Full-screen pages without bottom nav
│   │   ├── me/edit/        #   Edit profile
│   │   ├── posts/new/      #   Add post
│   │   ├── posts/[id]/     #   Post detail
│   │   └── users/search/   #   Search (mobile)
│   └── (main)/             # Pages with the bottom navigation
│       ├── (home)/         #   Home feed with the logo header
│       ├── me/             #   My profile, followers, following
│       └── profile/[username]/  # Public profile, followers, following
├── assets/                 # Logo, background glows, icons
├── components/
│   ├── layout/             # AppHeader, PageHeader, BottomNav, header search
│   ├── shared/             # AuthGuard, BottomSheet, Dropdown, EmptyState, ...
│   └── ui/                 # shadcn components
├── features/               # One folder per domain (mirrors the API)
│   ├── auth/  comments/  feed/  follow/  likes/
│   ├── me/  posts/  profile/  saves/  users/
│   │   ├── api.ts          #   Raw API calls
│   │   ├── hooks.ts        #   TanStack Query hooks
│   │   ├── schemas.ts      #   Zod schemas
│   │   ├── types.ts        #   TypeScript types
│   │   └── components/     #   Feature UI
├── hooks/                  # Reusable hooks (debounce, media query, infinite scroll, ...)
├── lib/                    # Axios client, token, query keys, date helper
├── providers/              # Redux + React Query providers, auth initializer
├── store/                  # Redux store and slices
└── types/                  # Shared API types (ApiResponse, Pagination)
```

---

## Architecture Notes

### State management

| State             | Where          | Examples                                                      |
| ----------------- | -------------- | ------------------------------------------------------------- |
| Auth token        | Cookie         | JWT, attached to every request by an Axios interceptor        |
| Server data       | TanStack Query | Feed, posts, profiles, comments, user lists                   |
| Client / UI state | Redux Toolkit  | Logged-in status, which post's comments / likes sheet is open |

### Keeping counters consistent

A post can appear in several lists at once (feed, explore, profile grids, saved, detail). Mutations update **every cached copy** of that post (`updatePostEverywhere`, `removePostEverywhere`) so likes, comment counts and deletions stay in sync without a reload. Query keys are centralized in `src/lib/query-keys.ts` and grouped by prefix (`["posts", ...]`, `["users", ...]`, `["me", ...]`) so related data can be updated or invalidated together.

### Session handling

The Axios response interceptor emits an event when the server rejects a token. The `AuthInitializer` listens for it, clears auth state and private cache, and shows a single "session expired" toast. The JWT `exp` claim is also checked before each request and on page load.

---

## API Coverage

| Feature    | Endpoints                                                                                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth       | `POST /api/auth/register`, `POST /api/auth/login`                                                                                                                                              |
| My profile | `GET /api/me`, `PATCH /api/me`, `GET /api/me/posts`                                                                                                                                            |
| Users      | `GET /api/users/search`, `GET /api/users/{username}`, `GET /api/users/{username}/posts`, `GET /api/users/{username}/likes`                                                                     |
| Feed       | `GET /api/feed`                                                                                                                                                                                |
| Posts      | `GET /api/posts`, `POST /api/posts`, `GET /api/posts/{id}`, `DELETE /api/posts/{id}`                                                                                                           |
| Likes      | `POST /api/posts/{id}/like`, `DELETE /api/posts/{id}/like`, `GET /api/posts/{id}/likes`, `GET /api/me/likes`                                                                                   |
| Comments   | `GET /api/posts/{id}/comments`, `POST /api/posts/{id}/comments`, `DELETE /api/comments/{id}`                                                                                                   |
| Follow     | `POST /api/follow/{username}`, `DELETE /api/follow/{username}`, `GET /api/users/{username}/followers`, `GET /api/users/{username}/following`, `GET /api/me/followers`, `GET /api/me/following` |
| Saves      | `POST /api/posts/{id}/save`, `DELETE /api/posts/{id}/save`, `GET /api/me/saved`                                                                                                                |

---

## Known Limitations

These are deliberate decisions based on what the API and the Figma design provide:

| Item                                                  | Reason                                                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Email can't be edited                                 | `PATCH /api/me` doesn't accept `email`; the field is shown read-only                             |
| Register has an Email field                           | Not in the Figma design, but required by the API                                                 |
| Share icon has no counter                             | The API has no share data; the icon copies the post link instead                                 |
| Bookmark state is read from the latest 50 saved posts | Post responses don't include a `savedByMe` flag                                                  |
| "Liked" tab on My Profile                             | The brief asks for a My Likes page; Figma has none, so it follows the public profile's Liked tab |
| Followers / Following pages and Post Detail           | No Figma design; built following the existing design patterns                                    |
| Post Detail on desktop                                | No desktop design yet; uses the mobile layout                                                    |

---

## Author

**Dimas Denny Wibowo** — [@Dimas-Denny](https://github.com/Dimas-Denny)
**Live demo:** https://sociality-frontend.vercel.app

WPH Bootcamp
