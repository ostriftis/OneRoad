# Interoperable Toll Management System  
### *Software Engineering Project – NTUA ECE 2024‑2025*

A complete monolithic web application implementing the interoperability framework for Greek highway toll operators.  
The system manages toll transactions across different operators, performs automated settlement calculations, provides analytics, and exposes all functionality through a fully compliant REST API, a custom CLI tool, and a lightweight web frontend.

---

## Project Description

This project simulates a centralized authority responsible for managing interoperability between the electronic toll systems of multiple Greek highway operators. Each operator maintains its own infrastructure, but all toll tags must be accepted across all highways. This creates cross‑operator financial obligations that must be tracked, analyzed, and settled.

Our system provides:

- **Data ingestion** from CSV files containing toll passes  
- **Persistent storage** of stations, tags, and pass events  
- **RESTful endpoints** for analytics, reporting, and settlement calculations  
- **Administrative operations** (reset, healthcheck, data import)  
- **A command‑line interface (CLI)** that mirrors the REST API  
- **A simple web frontend** for visualizing results and interacting with the backend  

The architecture is **monolithic**, meaning backend logic, CLI, and frontend coexist within a unified codebase, simplifying deployment and development.

---

## Architecture Overview

The system consists of three main components:

### **1. Backend (Node.js + Express)**
Implements all business logic, data management, and REST API endpoints exactly as defined in the project specification.  
Supports JSON and CSV output, timestamp‑sorted responses, and optional user authentication.

### **2. CLI Tool**
A Node‑based command‑line client that communicates with the backend.  
It supports all required scopes such as:

- `tollstationpasses`
- `passanalysis`
- `passescost`
- `chargesby`
- `admin` operations
- `login` / `logout` (optional)

### **3. Frontend (HTML/CSS/JS)**
A lightweight web interface that allows users to:

- View tables and summaries  
- Trigger API calls  
- Visualize data in a simple, user‑friendly way  

No frameworks — just clean, minimal, functional UI.

---

## 🛠 Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Node.js, Express |
| **Database** | MySQL |
| **Frontend** | HTML, CSS, Vanilla JS |
| **CLI** | Node.js |
| **Documentation** | Visual Paradigm |
---

## Key Features

- Fully compliant **REST API** with JSON/CSV output  
- Complete **CLI** mirroring all API functionality  
- **CSV import** for toll passes  
- **Automated settlement calculations** between operators  
- **Timestamp‑sorted responses**  
- **Monolithic architecture** for simplicity and cohesion

---

## Learning Outcomes

Through this project we practiced:

- Requirements engineering (SRS)
- UML modeling (class, sequence, activity, deployment diagrams)
- REST API design & implementation
- Database schema design
- CLI development
- Frontend integration
- AI‑assisted development workflows

---
