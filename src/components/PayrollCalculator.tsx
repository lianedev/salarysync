import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  basicSalary: number;
  houseAllowance?: number;
  transportAllowance?: number;
  medicalAllowance?: number;
  otherAllowances?: number;
}

interface PayrollResult {
  employee: Employee;
  grossSalary: number;
  basicSalary: number;
  allowances: {
    house: number;
    transport: number;
    medical: number;
    other: number;
    total: number;
  };
  deductions: {
    paye: number;
    nssf: number;
    shif: number;
    housingLevy: number;
    total: number;
  };
  taxableIncome: number;
  netSalary: number;
}

const PayrollCalculator = ({ employees, onSwitchToAddEmployee }: { employees: Employee[]; onSwitchToAddEmployee?: () => void }) => {
  const [payrollResults, setPayrollResults] = useState<PayrollResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePAYE = (taxableIncome: number): number => {
    const personalRelief = 2400;
    const taxBands = [
      { limit: 24_000, rate: 0.10 },
      { limit: 32_333.33, rate: 0.25 },
      { limit: 500_000, rate: 0.30 },
      { limit: 800_000, rate: 0.325 },
      { limit: Infinity, rate: 0.35 }
    ];

    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const band of taxBands) {
      if (remainingIncome <= 0) break;
      const taxableAmount = Math.min(remainingIncome, band.limit - previousLimit);
      tax += taxableAmount * band.rate;
      remainingIncome -= taxableAmount;
      previousLimit = band.limit;
    }

    return Math.max(tax - personalRelief, 0);
  };

  const calculateNSSF = (basicSalary: number): number => {
    
    if (basicSalary <= 8000) {
      return 0.06 * 8000;  // Contribution for salary up to 8,000
    } else if (basicSalary <= 72000) {
      return 0.06 * (basicSalary - 8000)+480;  // Contribution for salary between 8,001 and 72,000
    } else {
      return 4320;  // Contribution for salary above 72,000
    }
  };


  const calculateSHIF = (grossSalary: number): number => {
    return Math.max(grossSalary * 0.0275, 300);
  };

  const calculateHousingLevy = (grossSalary: number): number => {
    return grossSalary * 0.015;
  };

  const roundCurrency = (amount: number): number => Math.round(amount * 100) / 100;

  const calculateBulkPayroll = () => {
    if (employees.length === 0) {
      toast({
        title: "No Employees",
        description: "Please add employees before calculating payroll.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    const results = employees.map((employee) => {
      const basicSalary = employee.basicSalary || 0;
      const houseAllowance = employee.houseAllowance || 0;
      const transportAllowance = employee.transportAllowance || 0;
      const medicalAllowance = employee.medicalAllowance || 0;
      const otherAllowances = employee.otherAllowances || 0;

      const grossSalary = basicSalary + houseAllowance + transportAllowance + medicalAllowance + otherAllowances;
      const nssf = calculateNSSF(basicSalary);
      const shif = calculateSHIF(grossSalary);
      const housingLevy = calculateHousingLevy(grossSalary);
      const statutoryDeductions = nssf + shif + housingLevy;
      const taxableIncome = grossSalary - statutoryDeductions;
      const paye = calculatePAYE(taxableIncome);
      const totalDeductions = statutoryDeductions + paye;
      const netSalary = grossSalary - totalDeductions;

      return {
        employee,
        grossSalary: roundCurrency(grossSalary),
        basicSalary: roundCurrency(basicSalary),
        allowances: {
          house: roundCurrency(houseAllowance),
          transport: roundCurrency(transportAllowance),
          medical: roundCurrency(medicalAllowance),
          other: roundCurrency(otherAllowances),
          total: roundCurrency(houseAllowance + transportAllowance + medicalAllowance + otherAllowances)
        },
        deductions: {
          paye: roundCurrency(paye),
          nssf: roundCurrency(nssf),
          shif: roundCurrency(shif),
          housingLevy: roundCurrency(housingLevy),
          total: roundCurrency(totalDeductions)
        },
        taxableIncome: roundCurrency(taxableIncome),
        netSalary: roundCurrency(netSalary)
      };
    });

    setPayrollResults(results);
    setIsCalculating(false);
    toast({
      title: "Payroll Calculated",
      description: `Payroll computed for ${employees.length} employees.`,
    });
  };

  

 const exportToCSV = () => {
  if (payrollResults.length === 0) {
    toast({
      title: "No Data",
      description: "Please calculate payroll first before exporting.",
      variant: "destructive",
    });
    return;
  }

  const headers = [
    "Employee ID", "Name", "Position", "Basic Salary", "Allowances",
    "Gross Salary", "PAYE", "NSSF", "SHIF", "Housing Levy",
    "Total Deductions", "Net Salary"
  ];

  const totals = {
    basicSalary: 0,
    allowances: 0,
    grossSalary: 0,
    paye: 0,
    nssf: 0,
    shif: 0,
    housingLevy: 0,
    totalDeductions: 0,
    netSalary: 0
  };

  //Csv formating
  
  const csvContent = [
    headers.join(","), // Add headers first
    ...payrollResults.map(result => {
      const totalDeductions = result.deductions.paye + result.deductions.nssf + result.deductions.shif + result.deductions.housingLevy;
      const row = [
        result.employee.employeeId,
        `"${result.employee.firstName} ${result.employee.lastName}"`, // Quoting Name field
        `"${result.employee.position}"`, // Quoting Position field
        result.basicSalary.toFixed(2), // Formatting as two decimal places
        result.allowances.total.toFixed(2),
        result.grossSalary.toFixed(2),
        result.deductions.paye.toFixed(2),
        result.deductions.nssf.toFixed(2),
        result.deductions.shif.toFixed(2),
        result.deductions.housingLevy.toFixed(2),
        totalDeductions.toFixed(2), // Calculating and formatting total deductions
        result.netSalary.toFixed(2)
      ].join(",");

      // Update totals for every field
      totals.basicSalary += result.basicSalary;
      totals.allowances += result.allowances.total;
      totals.grossSalary += result.grossSalary;
      totals.paye += result.deductions.paye;
      totals.nssf += result.deductions.nssf;
      totals.shif += result.deductions.shif;
      totals.housingLevy += result.deductions.housingLevy;
      totals.totalDeductions += totalDeductions;
      totals.netSalary += result.netSalary;

      return row;
    }),
    // Add empty row for spacing before totals
    "",  // Empty row for spacing
    // Add totals row with formatting for numeric values
    `,,"TOTALS",${totals.basicSalary.toFixed(2)},${totals.allowances.toFixed(2)},${totals.grossSalary.toFixed(2)},${totals.paye.toFixed(2)},${totals.nssf.toFixed(2)},${totals.shif.toFixed(2)},${totals.housingLevy.toFixed(2)},${totals.totalDeductions.toFixed(2)},${totals.netSalary.toFixed(2)}`
  ].join("\n");

  downloadFile(csvContent, "payroll-summary", "csv");
};





  const exportToPayslip = () => {
  if (payrollResults.length === 0) {
    toast({
      title: "No Data",
      description: "Please calculate payroll first before exporting.",
      variant: "destructive",
    });
    return;
  }

  payrollResults.forEach((result) => {
    const payslipContent = `
      PAYSLIP - ${result.employee.firstName} ${result.employee.lastName}
      Employee ID: ${result.employee.employeeId}
      Position: ${result.employee.position}
      Period: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}

      EARNINGS:
      Basic Salary: KSh ${result.basicSalary.toLocaleString()}
      Allowances: KSh ${result.allowances.total.toLocaleString()}
      Gross Salary: KSh ${result.grossSalary.toLocaleString()}

      DEDUCTIONS:
      PAYE: KSh ${result.deductions.paye.toLocaleString()}
      NSSF: KSh ${result.deductions.nssf.toLocaleString()}
      SHIF: KSh ${result.deductions.shif.toLocaleString()}
      Housing Levy: KSh ${result.deductions.housingLevy.toLocaleString()}
      Total Deductions: KSh ${result.deductions.total.toLocaleString()}

      NET SALARY: KSh ${result.netSalary.toLocaleString()}
      ${'='.repeat(50)}
    `;

    // Construct the file name from the employee's name
    const fileName = `${result.employee.firstName} ${result.employee.lastName}.txt`;

    // Use a function to create and download each payslip as a separate .txt file
    downloadFile(payslipContent, fileName, "txt");
  });
};


  const downloadFile = (content: string, filename: string, extension: string) => {
    const blob = new Blob([content], { type: `text/${extension === 'csv' ? 'csv' : 'plain'}` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Payroll data downloaded as ${extension.toUpperCase()} file.`,
    });
  };

  const totalGrossSalary = payrollResults.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalDeductions = payrollResults.reduce((sum, r) => sum + r.deductions.total, 0);
  const totalNetSalary = payrollResults.reduce((sum, r) => sum + r.netSalary, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payroll Calculator
          </CardTitle>
          <CardDescription>
            Calculate PAYE, NSSF, SHIF, and Housing Levy for all employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={calculateBulkPayroll} 
              className="w-full sm:flex-1"
              disabled={isCalculating || employees.length === 0}
            >
              {isCalculating ? "Calculating..." : `Calculate Payroll (${employees.length} employees)`}
            </Button>
            
          </div>


          {payrollResults.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Excel summary
              </Button>
              <Button onClick={exportToPayslip} variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export Employee Payslips
              </Button>

            </div>
          )}
        </CardContent>
      </Card>

      {payrollResults.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">Total Gross Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">KSh {totalGrossSalary.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600">Total Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">KSh {totalDeductions.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">Total Net Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">KSh {totalNetSalary.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>
                Detailed breakdown for {payrollResults.length} employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">Gross Salary</TableHead>
                      <TableHead className="text-right">PAYE</TableHead>
                      <TableHead className="text-right">NSSF</TableHead>
                      <TableHead className="text-right">SHIF</TableHead>
                      <TableHead className="text-right">Housing Levy</TableHead>
                      <TableHead className="text-right">Total Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {result.employee.firstName} {result.employee.lastName}
                        </TableCell>
                        <TableCell>{result.employee.position}</TableCell>
                        <TableCell className="text-right">KSh {result.basicSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.grossSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.deductions.paye.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.deductions.nssf.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.deductions.shif.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.deductions.housingLevy.toLocaleString()}</TableCell>
                        <TableCell className="text-right">KSh {result.deductions.total.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">KSh {result.netSalary.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {employees.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Employees Found</CardTitle>
            <CardDescription>
              Please add employees first before calculating payroll.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {onSwitchToAddEmployee && (
              <Button onClick={onSwitchToAddEmployee}>Add Employee</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PayrollCalculator;