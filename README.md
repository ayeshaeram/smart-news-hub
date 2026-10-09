# [Project Name]

> Read less. Understand more. News for people who are short on time.

## Problem
- Text-heavy articles fail to explain complex data
- Busy professionals have no time for long reports
- Cluttered sites cause information overload

## Solution
| Feature | What it does |
|---|---|
| Scrollytelling | Charts animate as you scroll to explain data |
| Audio playlist | Text-to-speech for hands-free listening |
| 60-word cards | Swipeable news in seconds |
| AI chat | Ask questions about any article |
| Smart recommender | Ranks news by importance and your interests |
| PWA | Install it and read offline |

## Live Demo
[link here] | Screenshots below

## Screenshots
![Home](assets/screenshots/home.png)
![Cards](assets/screenshots/cards.png)
![Chat](assets/screenshots/chat.png)

## Tech Stack
HTML, CSS, JavaScript, Chart.js, Web Speech API, Node.js, Express, LLM API, Service Worker

## Importance Score
`Score = 0.35 × Recency + 0.25 × Credibility + 0.20 × Trending + 0.20 × Keyword urgency`

## Folder Structure
```
/css  /js  /server  /data  /assets
index.html  manifest.json  service-worker.js
```

## Setup
```bash
git clone https://github.com/[username]/[repo-name].git
cd [repo-name]
npm install
cp .env.example .env     # add your API key (optional)
npm start
```
Open http://localhost:3000

## Environment Variables
```
LLM_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```
Without keys, the app runs on sample data and mock chat replies.

## Team
- [Name] - [Role]
- [Name] - [Role]

## Future Scope
Real-time news APIs, voice commands, mobile app, more regional languages

## License
MIT
