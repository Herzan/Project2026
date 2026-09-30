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

As a software engineer I wanted to strengthen my JavaScript skills by creating a program that solves a problem: keeping track of tasks. I was curious how a program could store data let a user add and update items and keep that information organized while the program runs.

The software I made is a Task Manager command-line program. The software was built with JavaScript running on Node.js. When you run the software the software shows a menu that allows you to add a task view all tasks mark a task as complete and delete a task. Each task records its description and its completion status.

My goal in building the software was to become comfortable with core programming concepts in JavaScript such as variables, functions arrays, objects, loops and conditional logic. I wanted to practice reading user input updating a data structure based on that input and showing results back to the user clearly. I did this because I plan to build on these fundamentals, with JavaScript projects later. Getting the basics right helps a lot.

Youtube link: https://www.youtube.com/watch?v=OZWt46d1mL4

# Development Environment

I used Visual Studio Code as my IDE. I used Git/GitHub for version control.

I tested the program locally using Node.js. I tested each menu option manually by running the program and entering inputs to make sure tasks were added, listed completed and removed correctly.

I used JavaScript (Node.js) to build this program. I used the built-in readline module to read input, from the user. I used standard JavaScript arrays and objects to store and manage the list of tasks.

# Useful Websites

* [Node.js Official Documentation](https://nodejs.org/en/docs)
* [MDN Web Docs - JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
* [Node.js readline Documentation](https://nodejs.org/api/readline.html)
