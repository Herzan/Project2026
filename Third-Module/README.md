# Setup & Running

Express + MongoDB API (JWT login) and a Vite + React frontend, started together with one command.

## Quick start (Windows)

1. Make sure MongoDB is running (or put your Atlas link in `.env` as `MONGO_URI`).
2. Double-click **start.bat**  (or in the VS Code terminal run `.\start.bat`).
3. When you see `VITE ready`, open **http://localhost:5173** and log in with `admin` / `admin123`.

## Quick start (any system)

```bash
npm run setup      # installs backend + frontend packages (first time only)
cp .env.example .env
npm run dev:all    # starts API (port 3000) and website (port 5173) together
```

Demo users are created automatically the first time the server starts on an empty database.
To wipe and reload the sample data at any time: `npm run seed`.

The two "vulnerabilities" that npm reports are in development tools and can be ignored. Do not run `npm audit fix --force`.

## Deploy online

See **DEPLOY.md** for the Render + MongoDB Atlas step-by-step guide (`render.yaml` is included).

## Seed accounts

| Username | Password  |
|----------|-----------|
| admin    | admin123  |
| maria    | maria123  |
| carlos   | carlos123 |
| ana      | ana123    |

You can also create your own account with the "Sign up" link on the login page.

## Features

- **Login / Sign up / Log out** (passwords hashed with bcrypt, sessions use JWT tokens)
- **Add** tasks and **assign** them to any registered user
- **Edit** a task title or reassign it (pencil button or double-click)
- **Delete** tasks and mark them complete
- **Search** by title or assignee, filter by assignee and by status
- **Seed script** (`npm run seed`) to load sample data

## API

| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | no |
| POST | /api/auth/login | no |
| GET | /api/auth/me, /api/auth/users | yes |
| GET/POST | /api/tasks | yes |
| PUT/DELETE | /api/tasks/:id | yes |
| PUT | /api/tasks/:id/toggle | yes |

---

# Overview

I am a software engineer, and I wanted to get better at JavaScript. I built a small program to handle one simple job: tasks. I kept wondering how software can hold data, let a person change it, and still keep everything in order while it is running.

What I made is a Task Manager that works in the command line. I wrote it with JavaScript and ran it with Node.js. After you start it, a menu appears. From there you can add a task, see all tasks, mark a task as done, or remove a task. Each entry has a text note and a status that shows if it is finished.

I built this mainly to practice key JavaScript basics. I focused on variables and functions. I also worked with arrays and objects. Loops mattered too, along with if checks and other conditions. I wanted to practice taking what the user types, then updating my data model based on that input. After that, the program shows the result back in a clear way.

I did this so I can move on to bigger JavaScript projects later. Learning the basic pieces first makes future work easier.

Youtube link: https://www.youtube.com/watch?v=OZWt46d1mL4

# Development Environment

I worked in Visual Studio Code as my IDE. I also used Git and GitHub to track changes.

For testing, I ran the app on my computer with Node.js. I tried each menu item by hand, started the program, typed the inputs, and checked that the tasks showed up. I also confirmed that completed items were marked and that removed items were gone.

The program was written in JavaScript with Node.js. I relied on the readline module to get text from the user. I stored the task data in normal JavaScript arrays and objects, and I used them to keep the list updated.

# Useful Websites

* [Node.js Official Documentation](https://nodejs.org/en/docs)
* [MDN Web Docs - JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
* [Node.js readline Documentation](https://nodejs.org/api/readline.html)
