# 🧠 Mathify — BRAIN.md

## 📌 Project Overview
**Mathify** is a lightweight, fast-paced mobile game where players solve simple math problems under time pressure.
The goal is to create an addictive, smooth, and beginner-friendly game with clean UI and responsive gameplay.

---

## 🎯 Objectives
- Build a simple but polished mobile game
- Focus on one core mechanic: **solve math quickly**
- Deliver a smooth and responsive user experience
- Keep the scope small and achievable

---

## 🎮 Core Gameplay Loop
1. Display a math question (e.g., `8 + 5`)
2. Show 3–4 possible answers
3. Player selects an answer
4. Immediate feedback:
   - ✅ Correct → increase score
   - ❌ Wrong → penalty (time or life)
5. Continue until timer ends
6. Show final score

---

## 🧩 Core Features

### 1. Question Generator
- Random numbers (range: 1–20)
- Operators:
  - Easy: `+`
  - Medium: `+`, `-`
  - Hard: `+`, `-`, `*`

---

### 2. Answer System
- 1 correct answer
- 2–3 incorrect answers
- No duplicates
- Randomized order

---

### 3. Timer System
- Countdown (default: 60 seconds)
- Ends game when timer reaches 0

---

### 4. Score System
- +1 (or more) per correct answer
- Optional penalty for wrong answers

---

### 5. Game States
- `idle` → before start
- `playing` → active game
- `game_over` → end screen

---

### 6. UI Screens
- Home Screen
  - Start button
- Game Screen
  - Question
  - Answer buttons
  - Timer
  - Score
- Game Over Screen
  - Final score
  - Restart button

---

### 7. Feedback System
- Visual:
  - Green flash → correct
  - Red flash → wrong
- Optional:
  - Sound effects
  - Button animations

---

### 8. Difficulty Scaling
- Increase complexity over time:
  - Add harder operations
  - Reduce response time
  - Increase speed of transitions

---

## 🏗️ Technical Scope

### Suggested Stack
- React Native (Expo) OR Flutter
- State management: simple (useState / Provider / Zustand)

---

### Suggested Architecture
