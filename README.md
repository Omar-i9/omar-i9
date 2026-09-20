<div align="center">

# Omar AbuZeineh

### EV & Hybrid Engineering Student · Software Engineer · Technical Builder

Engineering-focused software development across **electric vehicles, real-time systems, web applications, simulation, and technical interfaces**.

[![GitHub](https://img.shields.io/badge/GitHub-Omar--i9-181717?style=for-the-badge\&logo=github)](https://github.com/Omar-i9)
[![TAAMEN](https://img.shields.io/badge/TAAMEN-2.0.0-193940?style=for-the-badge)](https://taamenn.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-Omar%20Profiles-0F766E?style=for-the-badge)](https://omar-i9.github.io/omar-i9/)
[![EV Telemetry](https://img.shields.io/badge/EV%20Telemetry-Dashboard-263746?style=for-the-badge)](https://github.com/Omar-i9/EV-Telemetry-Dashboard)

</div>

---

## Profile

I am an **Electric & Hybrid Vehicle Engineering student** focused on building practical technical systems at the intersection of:

* Electric and hybrid vehicle engineering
* Battery, motor, and vehicle telemetry
* Software architecture and application development
* Real-time data systems and technical visualization
* Responsive web interfaces and browser-based tools
* Engineering-oriented simulation and diagnostics

My work is centered on turning engineering concepts into working software, then validating the resulting system through implementation, testing, and documentation.

> Palestinian engineering student focused on electric and hybrid vehicles, software systems, and practical technical development.

---

# Flagship Project

## TAAMEN 2.0

### Football Operations, Match Management & Tactical Workspace

**TAAMEN 2.0** is the primary software product in my portfolio and the most extensive application currently maintained in this account.

The project evolved from a football organization platform into a production-oriented application with a complete frontend, local data layer, server-side services, public sharing, historical data boundaries, PWA infrastructure, responsive navigation, and production deployment.

### Product Scope

TAAMEN provides a unified workspace covering:

* Match Center and upcoming match management
* Current match archive and result recording
* Match lifecycle and historical record separation
* Interactive Tactical Playground
* Player positioning, formations, roles, instructions, and captain state
* Tactical persistence, undo/redo, screenshot capture, and sharing
* Local user profiles and profile management
* Local notifications and match lifecycle events
* Public profile and match sharing
* Featured Member historical-access workflow
* Stadium and venue information
* Settings, privacy controls, backup, restore, and local data reset
* Support and contact workflows
* Arabic RTL and English LTR interfaces
* Responsive desktop and mobile experiences
* Progressive Web App support

### Application Architecture

TAAMEN 2.0 uses a layered production architecture built around:

| Layer                | Implementation                                               |
| -------------------- | ------------------------------------------------------------ |
| Frontend             | React · TypeScript · Vite                                    |
| Local data           | IndexedDB                                                    |
| Application domain   | Shared Match model and repository layer                      |
| Sharing              | Direct public share routes with validated local payloads     |
| Server               | Cloudflare Worker / same-origin API                          |
| Server storage       | Cloudflare KV for production state                           |
| Sessions             | HttpOnly server-managed sessions                             |
| Email                | Backend-controlled EmailJS                                   |
| PWA                  | Manifest + Service Worker                                    |
| Motion               | GSAP-based route and interface motion                        |
| Testing              | Frontend tests · Backend tests · Playwright E2E · QA scripts |
| Internationalization | Arabic RTL · English LTR                                     |

### Data Architecture

The normal TAAMEN experience is intentionally **local-first**.

User-owned application data is maintained locally through IndexedDB, including areas such as:

`Profile` · `Matches` · `Archive` · `Notifications` · `Tactical Plans` · `Settings` · `Shared Data` · `Screenshots`

The application also supports structured backup and restore rather than treating browser storage as disposable UI state.

### Match System

The Match Center and Archive are based on a common Match domain.

A match progresses through a controlled lifecycle:

```text
UPCOMING
   ↓
ACTIVE
   ↓
COMPLETED_PENDING_RESULT
   ↓
COMPLETED_WITH_RESULT
   ↓
ARCHIVED
```

This separates match operations from historical presentation and allows current data, archived data, and legacy historical records to remain within defined boundaries.

### Tactical System

The Tactical Playground is a dedicated football planning workspace with:

* Multiple formations
* Direct pointer/touch player movement
* Player selection and editing
* Derived positional information
* Roles and tactical instructions
* Captain state
* Persistent tactical plans
* Undo / redo
* Reset
* Screenshot capture
* Clipboard image support
* Share actions
* Desktop focus mode
* Mobile landscape optimization
* Reduced-motion support

The tactical state is treated as application data rather than visual-only DOM state.

### Notifications

TAAMEN includes a local notification lifecycle covering events such as:

* Match creation
* Match updates
* Approaching matches
* Match start
* Result pending
* Result recorded
* Archive creation
* Match sharing
* Shared-match import

Notification events are tracked with stable IDs to prevent duplicate lifecycle generation.

### Public Sharing

TAAMEN supports direct public profile and match sharing routes.

The sharing system is designed so that a shared URL can be opened independently of the sender's active React state.

Public sharing intentionally excludes private profile data such as:

* Email
* Phone number
* Member identifiers
* Private settings
* Other non-public workspace information

Share payloads are encoded for transport; they are not presented as encryption.

### Featured Member System

TAAMEN includes a separate Featured Member workflow for controlled historical access.

The current flow is:

```text
Member Identifier
      ↓
Server Validation
      ↓
Session Creation
      ↓
HttpOnly Session
      ↓
Featured Scope
      ↓
Read-Only Historical Records
```

The Featured context is intentionally separated from the normal local-first workspace and does not expose general-user editing capabilities over historical data.

### Production Infrastructure

The production topology is centered around:

```text
GitHub
   ↓
Cloudflare
   ↓
TAAMEN Worker
   ↓
taamenn.com
   ↓
Production API
   ↓
Managed services
```

The frontend and `/api/*` operate on the same production origin.

The Service Worker intentionally excludes API traffic from caching and handles share/acquisition routes separately.

### Production Release

**TAAMEN 2.0.0 — Final Release**

The September 2026 release represents the completed transition from Beta / Release Candidate into the validated production version.

The release includes stabilization of:

* Backend and API communication
* Server sessions
* Featured Member recognition
* Public profile sharing
* Public match sharing
* Share-route refresh behavior
* Service Worker behavior
* Production error handling
* Support/contact delivery
* Responsive browser flows
* Acquisition experience

The release documentation records:

```text
Frontend tests:   56 / 56 PASS
Backend tests:    78 / 78 PASS
Playwright E2E:   16 / 16 PASS
Typecheck:        PASS
Production build: PASS
QA checks:        PASS
```

### Acquisition

TAAMEN is maintained as a **pre-revenue software product and acquisition asset** rather than being presented as an established SaaS business.

The repository contains dedicated acquisition documentation covering:

* Product scope
* Technology stack
* Deployment architecture
* Included assets
* Operating model
* Growth opportunities
* Buyer handoff considerations

**Live Product:** [taamenn.com](https://taamenn.com)
**Acquisition Overview:** [taamenn.com/acquisition](https://taamenn.com/acquisition)
**Repository:** [github.com/Omar-i9/taamenn](https://github.com/Omar-i9/taamenn)

---

# EV Telemetry Dashboard

## Real-Time Electric Vehicle Simulation & Telemetry System

The **EV Telemetry Dashboard** is a separate engineering-focused project built around an executable electric-vehicle simulation rather than a static visualization.

The system models relationships across the battery pack, motor, drivetrain, vehicle dynamics, thermal system, energy consumption, regenerative braking, and alert conditions.

### Simulation Scope

The backend models:

* Battery SOC using Coulomb Counting
* Battery SOH
* Cell voltage behaviour
* Pack voltage and internal-resistance effects
* Battery current
* Cell imbalance
* Battery temperature
* Motor RPM
* Motor torque
* Motor power
* Motor efficiency
* Motor temperature
* Aerodynamic drag
* Rolling resistance
* Acceleration power
* Regenerative braking
* Coolant behaviour
* HVAC load
* Energy consumption
* Estimated range
* Trip distance and time
* Simulated GPS position
* Fault and warning thresholds

The simulation advances through predefined driving conditions including:

```text
IDLE
ACCELERATING
CRUISING
REGEN_BRAKING
```

Telemetry is streamed to the frontend at approximately **500 ms intervals** through Socket.IO/WebSocket communication.

### Technology Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Backend       | Python · Flask · Flask-SocketIO |
| Real-time     | WebSocket / Socket.IO           |
| Database      | SQLite                          |
| Frontend      | HTML5 · CSS3 · JavaScript       |
| Visualization | Chart.js + Canvas gauges        |
| Data flow     | REST API + WebSocket            |

The dashboard presents engineering telemetry through a dedicated automotive HUD-style interface with gauges, streaming charts, battery and motor panels, thermal data, GPS information, trip metrics, and alert visualization.

**Repository:** [EV-Telemetry-Dashboard](https://github.com/Omar-i9/EV-Telemetry-Dashboard)

---

# Engineering Domains

| Domain                  | Focus                                                     |
| ----------------------- | --------------------------------------------------------- |
| EV / Hybrid Engineering | Batteries · Motors · Thermal systems · Vehicle behaviour  |
| Battery Systems         | SOC · SOH · Cell voltage · Current · Thermal behaviour    |
| Vehicle Telemetry       | Real-time data · Power flow · Energy · Fault states       |
| Automotive Software     | Diagnostics · Simulation · Technical visualization        |
| Web Engineering         | React · TypeScript · JavaScript · Responsive applications |
| Data Systems            | IndexedDB · SQLite · REST APIs · WebSockets               |
| Infrastructure          | Cloudflare · GitHub · PWA · Service Workers               |
| Engineering Tools       | Git · GitHub · VS Code · Browser DevTools                 |

---

# Software Architecture Focus

The current development work increasingly centers on systems where the interface is only one layer of a larger technical model.

Core areas include:

```text
Application Architecture
        ↓
Domain Models
        ↓
Local / Server Data Boundaries
        ↓
State Management
        ↓
API Integration
        ↓
Validation & Testing
        ↓
Production Deployment
```

This approach is reflected most strongly in TAAMEN 2.0 and the EV Telemetry Dashboard.

---

# Portfolio & Technical Showcase

## Omar Profiles

My personal portfolio is a separate static HTML/CSS/JavaScript project used to organize:

* Professional identity
* Social and developer links
* Project showcases
* Quick-copy information
* Sharing
* Project documentation
* Release notes
* Technical project pages

The portfolio includes dedicated project showcases for TAAMEN and EV Telemetry Dashboard, allowing the projects to be presented independently from their source repositories.

**Portfolio:** [omar-i9.github.io/omar-i9](https://omar-i9.github.io/omar-i9/)
**Portfolio Repository:** [github.com/Omar-i9/omar-i9](https://github.com/Omar-i9/omar-i9)

---

# Additional Interface Projects

Alongside the larger engineering repositories, the account also contains smaller profile and interface projects.

### AboAli Profile

A custom personal profile microsite featuring:

* Social platform directory
* Quick-copy identifiers
* Share interface
* Responsive glass UI
* Pointer-based card interactions
* Developer attribution

**Repository:** [AboAli-profile](https://github.com/Omar-i9/AboAli-profile)

### Hani Profile

A dedicated personal profile microsite featuring:

* Social platform directory
* Custom Arabic interface
* Floating draggable Quran widget
* Interactive profile presentation
* Developer attribution layer

**Repository:** [hani-profile](https://github.com/Omar-i9/hani-profile)

These projects are maintained separately from the main engineering systems and primarily represent custom interface implementation work.

---

# Current Development Direction

The longer-term engineering direction is centered around combining:

**EV Engineering + Software + Data**

Current areas of development include:

* EV telemetry
* CAN Bus tooling
* Battery Management System concepts
* Embedded automotive systems
* Vehicle diagnostics
* Engineering dashboards
* Technical data visualization
* Real-time browser interfaces

Future concepts such as CAN tooling and BMS simulation are development directions, not claimed production products.

---

# Engineering Method

```text
Define the system
       ↓
Model the domain
       ↓
Design the architecture
       ↓
Implement the working system
       ↓
Validate behaviour
       ↓
Harden edge cases
       ↓
Document the result
       ↓
Deploy the verified version
```

The objective is to produce systems that are understandable at the engineering level, usable at the product level, and maintainable at the code level.

---

# Project Portfolio

| Project                    | Role                                                      | Status                          |
| -------------------------- | --------------------------------------------------------- | ------------------------------- |
| **TAAMEN 2.0**             | Football operations, match management, tactical workspace | **Production · v2.0.0 Final**   |
| **EV Telemetry Dashboard** | EV simulation, telemetry, powertrain visualization        | **Active Engineering Project**  |
| **Omar Profiles**          | Personal portfolio and technical project showcase         | **Active Portfolio**            |
| **AboAli Profile**         | Personal profile / interface microsite                    | **Completed Interface Project** |
| **Hani Profile**           | Personal profile / interface microsite                    | **Completed Interface Project** |

---

# Selected Links

<div align="center">

### Production & Projects

[**TAAMEN 2.0**](https://taamenn.com)
Production football management and tactical workspace.

[**TAAMEN Repository**](https://github.com/Omar-i9/taamenn)
Source code, architecture, documentation, releases, and tests.

[**TAAMEN Acquisition**](https://taamenn.com/acquisition)
Product acquisition overview and technical handoff information.

[**EV Telemetry Dashboard**](https://github.com/Omar-i9/EV-Telemetry-Dashboard)
Electric vehicle simulation and real-time telemetry system.

### Portfolio

[**Omar Profiles**](https://omar-i9.github.io/omar-i9/)
Personal portfolio, projects, technical showcases, and links.

[**GitHub Profile**](https://github.com/Omar-i9)
Complete public repository portfolio.

</div>

---

<div align="center">

### Build. Test. Diagnose. Improve.

**Omar AbuZeineh**

</div>
