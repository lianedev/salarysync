
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PayrollCalculatorProps {
  employees: any[];
  onSwitchToAddEmployee?: () => void;
}

const PayrollCalculator = ({ employees, onSwitchToAddEmployee }: PayrollCalculatorProps) => {
  const [payrollResults, setPayrollResults] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Calculate monthly PAYE for Kenya 2025 rates.
   *
   * @param grossSalary  Gross monthly salary (KES)
   * @returns             PAYE tax payable after personal relief (KES)
   */
  const calculatePAYE = (grossSalary: number): number => {
    const personalRelief = 2400;  // Personal relief is 2400 KSh per month

    // 2025 monthly band thresholds (KES)
    const band1 = 24_000;
    const band2 = 32_333.33;   // 24,000 + 8,333.33
    const band3 = 500_000;     // 32,333.33 + 467,666.67
    const band4 = 800_000;     // 500,000 + 300,000

    // Marginal tax rates for each band
    const rate1 = 0.10;   // 10% on the first 24,000
    const rate2 = 0.25;   // next 8,333.33
    const rate3 = 0.30;   // next 467,666.67
    const rate4 = 0.325;  // next 300,000
    const rate5 = 0.35;   // above 800,000

    let tax: number;
    if (grossSalary <= band1) {
      tax = grossSalary * rate1;
    } else if (grossSalary <= band2) {
      tax = band1 * rate1 + (grossSalary - band1) * rate2;
    } else if (grossSalary <= band3) {
      tax = band1 * rate1 + (band2 - band1) * rate2 + (grossSalary - band2) * rate3;
    } else if (grossSalary <= band4) {
      tax = band1 * rate1 + (band2 - band1) * rate2 + (band3 - band2) * rate3 + (grossSalary - band3) * rate4;
    } else {
      tax = band1 * rate1 + (band2 - band1) * rate2 + (band3 - band2) * rate3 + (band4 - band3) * rate4 + (grossSalary - band4) * rate5;
    }

    // Apply personal relief
    const payeAfterRelief = Math.max(tax - personalRelief, 0);  // Ensure PAYE is not negative
    
    // Round to 2 decimal places for cleaner output
    return Math.round(payeAfterRelief * 100) / 100;
  };

  // NSSF calculation with correct tier ranges and maximum values
  const calculateNSSF = (basicSalary: number) => {
    let totalNSSF = 0;

    // Tier 1: Applicable for employees earning between KSh 6,000 and KSh 18,000
    if (basicSalary >= 6000 && basicSalary <= 18000) {
      // Fixed contribution of KSh 480 for Tier 1
      totalNSSF += 480;
    }
    
    // Tier 2: Applicable for employees earning above KSh 6,000
    if (basicSalary > 6000) {
      // Fixed contribution of KSh 2,520 for Tier 2
      totalNSSF += 2520;
    }
    
    console.log(`NSSF calculation for salary ${basicSalary}: Tier 1 + Tier 2 = ${totalNSSF}`);
    return totalNSSF;
  };

  // SHIF calculation
  const calculateSHIF = (grossSalary: number) => {
    const shifAmount = grossSalary * 0.0275;
    return Math.max(shifAmount, 300); // Minimum Ksh 300
  };

  // Housing Levy calculation
  const calculateHousingLevy = (grossSalary: number) => {
    return grossSalary * 0.015; // 1.5% of gross salary
  };

  // Rounding helper function
  const roundToTwoDecimalPlaces = (num: number) => Math.round(num * 100) / 100;

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

      // Calculate deductions
      const nssf = calculateNSSF(basicSalary);
      const paye = calculatePAYE(grossSalary - nssf);
      const shif = calculateSHIF(grossSalary);
      const housingLevy = calculateHousingLevy(grossSalary);

      const totalDeductions = paye + nssf + shif + housingLevy;
      const netSalary = grossSalary - totalDeductions;

      return {
        employee,
        grossSalary,
        basicSalary,
        allowances: {
          house: houseAllowance,
          transport: transportAllowance,
          medical: medicalAllowance,
          other: otherAllowances,
          total: houseAllowance + transportAllowance + medicalAllowance + otherAllowances
        },
        deductions: {
          paye: roundToTwoDecimalPlaces(paye),
          nssf: roundToTwoDecimalPlaces(nssf),
          shif: roundToTwoDecimalPlaces(shif),
          housingLevy: roundToTwoDecimalPlaces(housingLevy),
          total: roundToTwoDecimalPlaces(totalDeductions)
        },
        netSalary: roundToTwoDecimalPlaces(netSalary)
      };
    });

    setPayrollResults(results);
    setIsCalculating(false);

    toast({
      title: "Payroll Calculated",
      description: `Payroll computed for ${employees.length} employees.`,
    });
  };

  const exportToExcel = () => {
    if (payrollResults.length === 0) {
      toast({
        title: "No Data",
        description: "Please calculate payroll first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
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

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll-summary-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Payroll report downloaded as CSV file.",
    });
  };

  const exportToPDF = () => {
    if (payrollResults.length === 0) {
      toast({
        title: "No Data",
        description: "Please calculate payroll first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Create a printable version
    const printContent = `
PAYROLL SUMMARY REPORT
Period: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
Generated on: ${new Date().toLocaleDateString()}

${payrollResults.map(result => `
Employee: ${result.employee.firstName} ${result.employee.lastName}
ID: ${result.employee.employeeId}
Position: ${result.employee.position}

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
`).join('\n')}

SUMMARY:
Total Employees: ${payrollResults.length}
Total Gross Salary: KSh ${payrollResults.reduce((sum, r) => sum + r.grossSalary, 0).toLocaleString()}
Total Deductions: KSh ${payrollResults.reduce((sum, r) => sum + r.deductions.total, 0).toLocaleString()}
Total Net Salary: KSh ${payrollResults.reduce((sum, r) => sum + r.netSalary, 0).toLocaleString()}
    `;

    const blob = new Blob([printContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-report-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Payroll report downloaded as text file.",
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
              <Button onClick={exportToExcel} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button onClick={exportToPDF} variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {payrollResults.length > 0 && (
        <>
          {/* Summary Cards */}
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

          {/* Payroll Summary Table */}
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
