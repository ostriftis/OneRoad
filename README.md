# Interoperable Toll Management System
### *Software Engineering Project – NTUA ECE 2024-2025*

A full-stack software solution designed to manage interoperability between distinct highway toll operators in Greece. [cite_start]This system handles cross-operator transactions, calculates financial settlements, and provides granular analytics through a RESTful API, a Command Line Interface (CLI), and a web-based dashboard[cite: 5, 12, 30].

---

## Project Overview

[cite_start]This project simulates a central authority responsible for the **clearing and settlement** of toll transactions between different highway operators (e.g., Attiki Odos, Nea Odos, Egnatia)[cite: 6, 12].

[cite_start]In a interoperable network, when a subscriber of Operator A passes through a toll station owned by Operator B, a debt is created[cite: 8]. This system acts as the intermediary to:
1.  [cite_start]**Ingest transaction data** from various stations[cite: 13].
2.  [cite_start]**Calculate financial obligations** (who owes whom)[cite: 14].
3.  [cite_start]**Visualize traffic and cost data** for stakeholders[cite: 35].

The architecture follows a **monolithic design**, unifying the backend logic, database interaction, and client interfaces into a cohesive, easily deployable unit.

---

## Key Features

### **Inter-Operator Settlement & Financials**
* [cite_start]**Cost Calculation:** Automatically calculates the exact amount one operator owes another for a specific time period (e.g., *How much does Nea Odos owe Attiki Odos for January?*)[cite: 160].
* [cite_start]**Debt Aggregation:** View total receivables for a specific operator from all other "visiting" operators[cite: 164].
* [cite_start]**Settlement Reporting:** Supports financial reconciliation by generating cost reports in both JSON and CSV formats[cite: 99].

### **Traffic Analytics**
* [cite_start]**Station Monitoring:** View pass events for any specific toll station within a selected date range[cite: 150].
* [cite_start]**Cross-Network Analysis:** Analyze pass events involving tags from one operator used at stations of another[cite: 154].
* [cite_start]**Timestamp Sorting:** All data is strictly returned in chronological order for accurate timeline reconstruction[cite: 97].

### **System Administration**
* [cite_start]**Data Ingestion:** Bulk import of toll pass records via CSV files using standard multipart forms[cite: 140].
* [cite_start]**System Health:** `Healthcheck` endpoints to verify database connectivity and system status[cite: 125].
* [cite_start]**Reset Capabilities:** Tools to safely clear database records or reset toll stations to their default state[cite: 135, 137].

---

##  Architecture & Components

[cite_start]The solution is composed of three primary interfaces, all powered by a unified backend[cite: 30].

### **1. RESTful API (Backend)**
The core of the system. It exposes endpoints for data management and calculations.
* [cite_start]**Tech:** Node.js / Express [cite: 43]
* **Capabilities:** JSON & CSV export, custom date-filtering, and robust error handling.
* [cite_start]**Documentation:** Fully documented using OpenAPI 3.0[cite: 87].

### **2. Command Line Interface (CLI)**
[cite_start]A functional administrative tool mirroring the API's capabilities for headless environments[cite: 33].
* **Tech:** Node.js
* [cite_start]**Scopes:** `tollstationpasses`, `passanalysis`, `passescost`, `chargesby`, `admin`[cite: 184].
* **Usage Example:**
    ```bash
    se24XX passescost --stationop aodos --tagop neaodos --from 20240101 --to 20240131
    ```

### **3. Web Frontend**
[cite_start]A lightweight, user-friendly dashboard for non-technical stakeholders[cite: 35].
* [cite_start]**Tech:** HTML5, CSS3, Vanilla JavaScript [cite: 46]
* **Function:** Visualizes debt settlements and traffic data via tables and charts.

---

## 💻 Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | Core server-side environment. |
| **Framework** | **Express.js** | REST API routing and middleware. |
| **Database** | **MySQL** | [cite_start]Persistent storage for stations, tags, and passes[cite: 45]. |
| **Frontend** | **Vanilla JS/HTML/CSS** | Lightweight UI without heavy framework overhead. |
| **Modeling** | **Visual Paradigm** | [cite_start]UML System design (Class, Sequence, Deployment)[cite: 51]. |

---

## 🎓 Learning Outcomes

[cite_start]This project served as a comprehensive exercise in the full Software Development Life Cycle (SDLC)[cite: 38]:
* [cite_start]**Requirements Engineering:** Translating vague business needs into a formal Software Requirements Specification (SRS)[cite: 25].
* [cite_start]**API Design:** Implementing a compliant REST API with standard HTTP status codes and strict parameter handling[cite: 84].
* **Data Modeling:** Designing a relational schema to handle complex many-to-many relationships between operators and tags.
* [cite_start]**Interoperability:** Understanding the complexities of data exchange between disparate systems[cite: 5].

---

### **How to Run**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ntua/softeng24-XX.git](https://github.com/ntua/softeng24-XX.git)
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Database Setup:**
    Ensure MySQL is running and import the schema from `/database`.
4.  **Start the Server:**
    ```bash
    npm start
    ```
    [cite_start]*Server will listen on `https://localhost:9115`*[cite: 90].

---
