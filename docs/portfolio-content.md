# Portfolio Content Guide

This guide turns the professional-content requirements in [BLUEPRINT.md](../BLUEPRINT.md) into page and case-study instructions. Keep the engineering identity primary; coordination, leadership, and personal interests should support it.

## Narrative

Present Yuri Andrei B. Morrison as a Software / AI Engineer who builds practical software and intelligent systems, understands how systems fit together, and helps move projects from ideas to working products. Do not lead with project management as the primary identity.

The portfolio should answer, in order:

1. Who is Yuri as an engineer?
2. What substantial systems has he built?
3. How does his professional and leadership experience support that work?
4. What does he care about beyond work?

## Homepage

The intended content order is:

1. Hero: name, Software / AI Engineer identity, short positioning statement, project CTA, and a secondary profile/contact action.
2. Selected projects: Waste-To-Worth first; software engineering internship as a professional case study.
3. Experience preview.
4. Skills preview, grouped by discipline rather than rendered as a keyword wall.
5. Profile and leadership preview.
6. Small personal-interest preview for music, League of Legends, and books.
7. Closing contact section with a real contact destination.

The current homepage already includes the identity hero, Waste-To-Worth and internship previews, profile/leadership content, and a closing section. Skills and personal-interest previews are still outstanding. The current closing link returns to selected work; replace it once Yuri supplies a real public email, LinkedIn, GitHub, or contact-form destination. Never invent contact details.

## Project Case Studies

Treat substantial work as engineering case studies, not just technology lists. For each project, document:

- Overview, problem, goal, and intended users.
- Yuri's specific role and contributions.
- Architecture and data flow.
- Technology choices and the reasons for them.
- Constraints, important trade-offs, challenges, and solutions.
- Results with enough context to explain how they were measured.
- Lessons learned and realistic next improvements.

Use diagrams, screenshots, and metrics only when they are accurate, authorized, and useful. Keep confidential employer information out of the portfolio.

### Waste-To-Worth

Role: Principal Researcher / Developer.

Waste-To-Worth is an AI-powered recycling and upcycling application. It helps users identify materials and find practical reuse or disposal guidance. The design includes image-based material classification, retrieval of relevant existing records, AI-generated recommendations, climate-aware disposal guidance, geolocation, gamification, projects, and community posts.

Planned architecture:

```text
React Native / Expo
  -> Flask / Python backend
  -> image recognition and material identification
  -> Firestore records and retrieval
  -> LLM-generated recycling or upcycling recommendations
```

The retrieval step is intended to reuse relevant existing records and reduce duplicate recommendations. Technologies include Firebase Authentication and Firestore, image recognition, retrieval-augmented generation, geolocation, and gamification.

Pilot figures to preserve with methodology and context:

- 36 users and 136 scans.
- 117 successful classifications, approximately 86% of recorded scans.
- 53 completed projects.
- Climate-specific disposal methods for 83 of 100 materials.
- Recognition: 3rd Best Capstone Project - Department Level.

Do not imply the pilot results are production-scale accuracy or general environmental impact. Explain the pilot population, what counted as a successful classification, and what the 83/100 measure represents when source details are available.

### Software Engineering Internship

Role: Software Engineering Intern at Electronic Science Corporation.

Describe work across frontend/backend development, API integration, debugging, AWS services, data processing, UI/UX, and QA preparation. Relevant technologies include JavaScript, Angular, AWS ECS, Lambda, S3, Cognito, Git, Postman, Jira, and Confluence.

The asynchronous bulk-data workflow reduced runtime to approximately 20% of the original, or an approximately 80% reduction. Explain the original bottleneck and engineering change only at a level that does not disclose confidential company information. Include Best Intern recognition and the invitation to apply for a software engineering opening when appropriate.

Other potential project case studies include the real-time web-based basketball management system and organizational task management web system. Add them only when their scope and Yuri's contribution can be described accurately.

## Experience, Leadership, and Communication

The Experience page should provide a fuller timeline than the homepage and group entries as professional, leadership, and editorial/technical communication experience.

For Bedan Information Technology Society, the blueprint records these roles:

- Associate External Vice President, 2022-2023.
- Internal Vice President, 2023-2024.
- President, 2024-2025.
- Internal Vice President, 2025-2026.

The organization involved approximately 150 members and 20+ officers/staff. Use these figures as approximate, and focus on coordination, delegation, planning, partnerships, event execution, budget management, mentorship, and technical event support. NOSEDIVE can be presented as a recurring industry-practices seminar initiative, showing planning, speaker engagement, coordination, execution, and continuity between officer teams.

The Bedan Herald supports the communication narrative through writing, research, editing, digital publishing, web administration, and content management. Roles listed in the blueprint include Senior Staff, Web Manager, Circulations Manager, and Research and Circulations Staff.

## Skills and Achievements

Group skills by category, for example:

- Languages: Python, Java, JavaScript, PHP, HTML, CSS, SQL.
- Frameworks: React, React Native, Angular, Node.js, Flask, Tailwind CSS, Next.js.
- Databases: Firebase Firestore, MySQL, MariaDB, SQL/NoSQL concepts.
- Cloud: AWS ECS, Lambda, S3, Cognito, Docker, Hostinger.
- AI/data: agents, LLM APIs, RAG, image recognition, API integration, data processing.
- Tools and practices: Git, GitHub, Postman, Jira, Confluence, Agile, testing, debugging, system integration, requirements analysis.

Potential achievements include Best Intern, 3rd Best Capstone Project, Dean's List / Annual Honor Roll, TOPCIT Level 4 (830/1000), PMI Project Management Ready, Microsoft certifications, Certiport IT Specialist certifications, and CompTIA IT Fundamentals. Verify titles, dates, and credential status before publishing; separate awards, certifications, academic recognition, and competition results.

## Contact

The contact page must provide at least one real contact method. If a form is added, submit through a server-side route, validate input, and keep provider credentials server-side. Do not publish personal information without Yuri's approval.

## Content Review Checklist

- The first viewport makes the Software / AI Engineer identity clear.
- Engineering projects and experience appear before hobby systems.
- Every metric has a defined source and meaning.
- Claims distinguish planned capability from shipped capability.
- Employer-confidential details and private contact data are excluded.
- Links point to implemented pages or real external destinations.
