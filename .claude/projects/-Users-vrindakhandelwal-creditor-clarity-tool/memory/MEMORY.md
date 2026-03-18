# Creditor Clarity Tool - Memory

## Project Overview
A CRM/loan-processing tool built with React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI.
Single-page app for managing loan applicant profiles, creditor calculations, and documents.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Shadcn UI (Radix UI primitives) + Tailwind CSS
- **Routing**: react-router-dom v6
- **State**: React useState (local), TanStack React Query for async
- **Forms**: react-hook-form + zod
- **Charts**: recharts
- **Package manager**: npm (has bun.lock too but npm works fine)

## Key File Paths
- Entry: `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`
- Main layout: `src/pages/Index.tsx` — ClientHeader + LeftSidebar + main content + RightPanel
- CRM components: `src/components/crm/` (30+ components)
- UI primitives: `src/components/ui/` (Shadcn components)

## Architecture
- `Index.tsx` manages `activeView` state: "main" | "request-details" | "request-documents" | "assign-sales-rep"
- Main view has 3 tabs: PROFILE, CREDITOR, DOCUMENTS
- Right panel has actions: Request Details, Request Documents, Assign Sales Rep, Employer List, Serviceability
- Demo client hardcoded: "Saurabh Deshpande" / KFSAPP-INH-0226-2362704

## Dev Server
- Launch: `npm run dev` on port 8080
- launch.json located at `.claude/worktrees/hardcore-colden/.claude/launch.json`
- Vite config likely sets port 8080

## Notable Components
- `CreditorCalculatorTab.tsx` — creditor/FOIR calculations
- `FOIRCalculator.tsx` — Fixed Obligation to Income Ratio
- `LenderMatchTable.tsx` — lender matching
- `CreditorTable.tsx` — creditor listing
- `ProfileTab.tsx` — client profile
- `DocumentsTab.tsx` / `DocumentManager.tsx` — document management
