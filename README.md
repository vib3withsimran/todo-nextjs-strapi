# 📝 Full-Stack Todo List Application

A premium, modern, and type-safe Todo List application built with **Next.js (App Router)** and **Tailapi v5 (CMS Backend)**.

---

## 🚀 Features

- **Robust User Authentication**: Fully integrated signup and signin flows powered by Strapi's local auth provider.
- **Dynamic Task Management**: Create, view, complete, and delete todo items in real time.
- **Detailed Descriptions**: Add context to your tasks with descriptions.
- **Persistent Sessions**: Syncs JWT cookies and client-side storage seamlessly with middleware session checks.
- **Harmonious Dark Theme**: A sleek zinc-based dark aesthetic with vibrant accents and responsive micro-animations.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS)
- **Backend**: Strapi v5
- **Database**: SQLite (local development database)

---

## ⚙️ Environment Variables

For both local development and production deployments (e.g., Railway), configure the following environment variable on the **Frontend**:

| Variable | Description | Local Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base endpoint URL of your Strapi backend | `http://127.0.0.1:1337/api` |

---

## 💻 Getting Started

### 1. Setup the Backend (Strapi)

```bash
cd todo-backend
npm install
npm run develop
```
- Open the admin dashboard at `http://127.0.0.1:1337/admin` to set up your administrator account.

> [!IMPORTANT]
> **Enable Database Permissions**:
> Newly created collection types are locked by default in Strapi. To ensure the application functions correctly, you must enable permissions for the Authenticated role:
> 1. Go to **Settings** > **Roles** (under *Users & Permissions plugin*).
> 2. Click on the **Authenticated** role.
> 3. Under the **Todo-list** accordion, check: `create`, `find`, `findOne`, `update`, and `delete`.
> 4. Click **Save**.

### 2. Setup the Frontend (Next.js)

In the root directory:

```bash
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 🔧 Important Troubleshooting & Configuration

### Windows localhost DNS Resolution
On Windows development machines, `localhost` often resolves to the IPv6 loopback `::1` in modern browsers and Node.js. Since Strapi binds to the IPv4 interface (`0.0.0.0`), fetching `http://localhost:1337` will fail with a `Failed to fetch` error. 
* **Solution**: The API calls are hardcoded to resolve loopback requests to `http://127.0.0.1:1337`, forcing the IPv4 stack.

### Strapi v5 Input Validation
Strapi v5 performs strict validation on request payloads:
- Schema naming: The collection's API routing uses the plural `todo-lists` endpoint rather than `/todos`.
- Relations: whitelisted inputs (like `users_permissions_user`) require the making role to have permission to `find` and `findOne` the related content type. These permissions have been successfully injected into the default SQLite template schema.
