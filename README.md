##Kenya Payroll Management System – Documentation

--This project is a payroll management web application designed to handle tax deductions, housing levy, NHIF/SSIF contributions, and other statutory deductions in Kenya. It allows companies to manage employees efficiently while providing employees with access to their payslips and personal metrics.

##Features
--Company/Employer Functionality

--Add, edit, and manage employees in your company.

--Calculate all statutory deductions in Kenya, including:
PAYE (Income Tax),NHIF,NSSF,Housing Levy
Other statutory contributions

--Generate and download payslips for employees.

--Maintain a record of all employees for reporting and compliance purposes.

--Employee Functionality

--Secure login to view personal payroll data.

--View payslips, deductions, and metrics.

--Track individual contributions and net salary over time.

--Admin & System Tools

--Dashboard for company metrics and employee summaries.

--Efficient employee management with a clean UI.

--Real-time calculations to ensure accurate deductions.

##Tech Stack

--Vite – Fast development and build tool for modern web projects.

--TypeScript – Provides type safety and improved developer experience.

--React – Frontend framework for building interactive user interfaces.

--shadcn-ui – Component library for building a modern, responsive UI.

--Tailwind CSS – Utility-first CSS framework for custom styling and responsive layouts.

##Getting Started
Installation

Clone the repository and install dependencies:

git clone <repository-url>
cd <project-directory>
npm install
# or
yarn install
# or
pnpm install

Running the Development Server

Start the development server with:

npm run dev
# or
yarn dev
# or
pnpm dev


Open http://localhost:5173
 (default Vite port) in your browser to view the application.

##File Structure Highlights

src/components/ – Reusable UI components using shadcn-ui and Tailwind.

src/pages/ – React pages for Employee Dashboard, Company Dashboard, Login, and Registration.

src/utils/ – Utility functions for calculations (tax, NHIF, NSSF, housing levy, etc.).

src/services/ – API and data handling for storing employee records.

src/styles/ – Tailwind CSS configuration and custom styles.

##Usage

Company Admin

Log in or register as a company.

Add employees and enter their salary details.

Generate payslips and manage employee records.

##Employee

--Log in with provided credentials.

--View payslips, salary deductions, and metrics.

--Download payslips for personal record keeping.

##Notes

--All deductions are calculated according to Kenya statutory rates.

--The system is optimized for responsive design and works across devices.

--Security measures include protected employee login and company-level access controls.

##Future Improvements

--Add email notifications for payslip availability.

--Include reporting and analytics for company-wide payroll summaries.

--Mobile app support for employees and admins.
