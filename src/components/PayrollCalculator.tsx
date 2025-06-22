import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    return basicSalary >= 6000 ? (basicSalary > 6000 ? 3000 : 480) : 0;
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

    const csvContent = [
      headers.join(","),
      ...payrollResults.map(result => [
        result.employee.employeeId,
        `"${result.employee.firstName} ${result.employee.lastName}"`,
        `"${result.employee.position}"`,
        result.basicSalary,
        result.allowances.total,
        result.grossSalary,
        result.deductions.paye,
        result.deductions.nssf,
        result.deductions.shif,
        result.deductions.housingLevy,
        result.deductions.total,
        result.netSalary
      ].join(","))
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

    const payslipContent = payrollResults.map(result => `
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
    `).join('\n');

    downloadFile(payslipContent, "payslips", "txt");
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
          <div className="flex gap-3">
            <Button 
              onClick={calculateBulkPayroll} 
              className="flex-1"
              disabled={isCalculating || employees.length === 0}
            >
              {isCalculating ? "Calculating..." : `Calculate Payroll (${employees.length} employees)`}
            </Button>
            {onSwitchToAddEmployee && (
              <Button onClick={onSwitchToAddEmployee} variant="outline">
                Add Employee
              </Button>
            )}
          </div>

          {payrollResults.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={exportToPayslip} variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export Payslips
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