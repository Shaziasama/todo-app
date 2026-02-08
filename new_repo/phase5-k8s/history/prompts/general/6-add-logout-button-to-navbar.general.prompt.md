---
id: 6
title: Add Logout Button to Navbar
stage: green
date: 2026-01-09
surface: agent
model: gemini-1.5-pro
feature: general
branch: main
user: shazia zohaib
command: (user requested a feature)
labels: ["nextjs", "feature", "navbar", "authentication"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - phase3-chatbot/src/components/layout/Navbar.tsx
tests_yaml: []
prompt_text: |
  Add a Logout button in the navbar.

  In Navbar.tsx:
  - Add a Button with "Logout" text
  - onClick={() => signOut({ callbackUrl: "/login" })}
  - Style: white text, sky blue border, hover sky blue background
  - Place it in user dropdown or next to avatar

  After logout, redirect to /login page.

  This way, I can test login flow every time.
response_text: |
  I have added the Logout button to `phase3-chatbot/src/components/layout/Navbar.tsx` with the specified styling and `onClick` handler.
  Now, I will create a PHR for this change.
  The feature is 'general'.
  The stage is 'green' as a new feature was implemented.
  The title of the PHR should be 'Add Logout Button to Navbar'.
---