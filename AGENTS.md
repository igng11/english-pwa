# Project principles

These rules are permanent constraints for work in this repository.

- This is a personal English-learning PWA.
- Reading is the primary learning activity. New work must preserve a calm, focused reading experience.
- Keep the application offline-first: the core learning flow must work without a network connection after the first successful load.
- Keep user data local-first. Store learning progress on the device unless the user explicitly approves a future synchronization design.
- Do not add a backend or authentication by default.
- Do not add paid APIs.
- Do not add AI APIs by default.
- Keep learning content separate from UI components and application logic.
- Design mobile-first, then adapt deliberately for larger screens.
- Avoid unnecessary abstractions, frameworks, and dependencies. Prefer small browser-native implementations when they remain clear and reliable.
- Preserve accessibility: semantic HTML, keyboard access, visible focus, adequate contrast, and practical touch targets.
- Keep progression, vocabulary rules, and persistence behind their current dedicated modules so they can evolve independently.
- Do not block access to readings based on level recommendations.

Before completing a change, run the available typecheck and production build. Update the relevant file in `specs/` when a change materially affects the documented system.
