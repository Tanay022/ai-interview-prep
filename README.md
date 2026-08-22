# AI Interview Prep

An AI-powered web app that generates a personalized interview preparation report from a candidate's resume (or self-description) and a target job description.

## Features
- Upload a resume (PDF) or write a quick self-description
- AI-generated match score against the job description
- Technical and behavioral interview questions with intent + model answers
- Skill gap analysis with severity ratings
- 7-day personalized preparation roadmap
- Download an AI-generated, tailored resume as a PDF
- Secure authentication with JWT + httpOnly cookies and token blacklisting on logout

## Tech Stack
**Frontend:** React, Vite, React Router, Axios, Sass
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, Puppeteer
**AI:** Google Gemini API with structured JSON schema output (Zod)
