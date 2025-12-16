# Game Design Document: Merge Architect

## 1. Introduction
**Merge Architect** is a casual puzzle game designed for an architecture firm's internal platform. It combines the addictive logic of "2048" with the thematic progression of architectural design. The ultimate goal is to relieve stress and foster a sense of collective achievement through a shared "Virtual City."

## 2. User Flow
1.  **Lobby (The City):** User logs in and sees the "Our City" dashboard. This is an isometric view of buildings created by colleagues.
2.  **Start Game:** User clicks "Start Project."
3.  **Gameplay Loop:**
    *   Swipe/Key inputs to move tiles on a 4x4 grid.
    *   Tiles merge: Material -> Component -> Structure -> Building.
    *   Score increases based on merge value.
4.  **Game Over:** No moves left.
5.  **Result Submission:**
    *   The highest tier building achieved is stamped as the "Final Output."
    *   Credits are awarded based on score.
    *   The building is sent to the server to be placed in the City.
6.  **Return to Lobby:** User sees their new building animated into the shared city grid.

## 3. Evolution Stages (The Tiles)
The game replaces numbers with architectural elements.

| Value | Level Name | Visual Concept | Description |
| :--- | :--- | :--- | :--- |
| 2 | **Raw Material** | Grey Brick Stack | Basic construction unit. |
| 4 | **Concrete** | Rough Concrete Block | Foundation material. |
| 8 | **Frame** | Steel I-Beam | Structural support. |
| 16 | **Wall** | Framed Wall | Defining boundaries. |
| 32 | **Room** | Isometric Room Box | A single habitable space. |
| 64 | **Pavilion** | Small Glass Cube | Simple artistic structure. |
| 128 | **House** | Gable Roof House | Basic residential unit. |
| 256 | **Villa** | Modern Flat Villa | Luxury housing. |
| 512 | **Office** | Mid-rise Glass Bldg | Commercial workspace. |
| 1024 | **Tower** | High-rise Skyscraper | Density and height. |
| 2048 | **Landmark** | Iconic Unique Design | The "Crown Jewel" (Win Condition). |

## 4. Technical Architecture: "Virtual City"

### Backend (Conceptual)
*   **Database (PostgreSQL):** Stores User Profiles, High Scores, and Inventory.
*   **City Grid (Redis/NoSQL):** A 20x20 grid representing the shared city map. Each cell stores `{ userId, buildingType, timestamp, colorTheme }`.
*   **API Endpoints:**
    *   `POST /api/game/submit`: Receives final score and max tile. Logic determines if the building replaces an older/smaller one in the city grid.
    *   `GET /api/city/state`: Returns the current layout of the city for rendering.

### Frontend Integration
*   **Rendering:** The City View uses CSS 3D Transforms (Isometric projection) rather than WebGL for performance and retro aesthetic.
*   **Updates:** When a user finishes a game, the client optimistically updates the local city view while syncing with the server in the background.
*   **Weekly Reset:** A cron job resets the grid every Monday, moving the best buildings to a "Hall of Fame" gallery to keep the map fresh.
