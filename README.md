# Interoperable Toll Management System
### *Software Engineering Project – NTUA ECE 2024-2025*

A full-stack software solution designed to manage interoperability between distinct highway toll operators in Greece. This system handles cross-operator transactions, calculates financial settlements, and provides granular analytics through a RESTful API, a Command Line Interface (CLI), and a web-based dashboard.

---

## Project Overview

This project simulates a central authority responsible for the **clearing and settlement** of toll transactions between different highway operators (e.g., Attiki Odos, Nea Odos, Egnatia).

In an interoperable network, when a subscriber of Operator A passes through a toll station owned by Operator B, a debt is created. This system acts as the intermediary to:
1.  **Ingest transaction data** from various stations.
2.  **Calculate financial obligations** (who owes whom).
3.  **Visualize traffic and cost data** for stakeholders.

The architecture follows a **monolithic design**, unifying the backend logic, database interaction, and client interfaces into a cohesive, easily deployable unit.

---

## Key Features

### **Inter-Operator Settlement & Financials**
This system specializes in financial reconciliation between competing operators:
* **Cost Calculation:** Automatically calculates the exact amount one operator owes another for a specific time period (e.g., *How much does Nea Odos owe Attiki Odos for January?*).
* **Debt Aggregation:** View total receivables for a specific operator from all other "visiting" operators.
* **Settlement Reporting:** Supports financial reconciliation by generating detailed cost reports in both JSON and CSV formats.

### **Traffic Analytics**
* **Station Monitoring:** View pass events for any specific toll station within a selected date range.
* **Cross-Network Analysis:** Analyze pass events involving tags from one operator used at stations of another.
* **Timestamp Sorting:** All data is strictly returned in chronological order for accurate timeline reconstruction.

###  **System Administration**
* **Data Ingestion:** Bulk import of toll pass records via CSV files using standard multipart forms.
* **System Health:** `Healthcheck` endpoints to verify database connectivity and system status.
* **Reset Capabilities:** Tools to safely clear database records or reset toll stations to their default state.

---

##  Architecture & Components

The solution is composed of three primary interfaces, all powered by a unified backend.

### **1. RESTful API (Backend)**
The core of the system. It exposes endpoints for data management and calculations.
* **Tech:** Node.js / Express
* **Capabilities:** JSON & CSV export, custom date-filtering, and robust error handling.
* **Documentation:** Fully documented using OpenAPI 3.0.

### **2. Command Line Interface (CLI)**
A functional administrative tool mirroring the API's capabilities for headless environments.
* **Tech:** Node.js
* **Scopes:** `tollstationpasses`, `passanalysis`, `passescost`, `chargesby`, `admin`.
* **Usage Example:**
    ```bash
    se24XX passescost --stationop aodos --tagop neaodos --from 20240101 --to 20240131
    ```

### **3. Web Frontend**
A lightweight, user-friendly dashboard for non-technical stakeholders.
* **Tech:** HTML5, CSS3, Vanilla JavaScript
* **Function:** Visualizes debt settlements and traffic data via tables and charts.

---

##  Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | Core server-side environment. |
| **Framework** | **Express.js** | REST API routing and middleware. |
| **Database** | **MySQL** | Persistent storage for stations, tags, and passes. |
| **Frontend** | **Vanilla JS/HTML/CSS** | Lightweight UI without heavy framework overhead. |
| **Modeling** | **Visual Paradigm** | UML System design (Class, Sequence, Deployment). |

---

##  Learning Outcomes

This project served as a comprehensive exercise in the full Software Development Life Cycle (SDLC):
* **Requirements Engineering:** Translating vague business needs into a formal Software Requirements Specification (SRS).
* **API Design:** Implementing a compliant REST API with standard HTTP status codes and strict parameter handling.
* **Data Modeling:** Designing a relational schema to handle complex many-to-many relationships between operators and tags.
* **Interoperability:** Understanding the complexities of data exchange between disparate systems.

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
    *Server will listen on `https://localhost:9115`*.

