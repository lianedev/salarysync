
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface PayrollResultsProps {
  data: any;
}

const PayrollResults = ({ data }: PayrollResultsProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const payslipContent = `
PAYSLIP - ${data.employee.firstName} ${data.employee.lastName}
Employee ID: ${data.employee.employeeId}
Position: ${data.employee.position}
Department: ${data.employee.department}
Period: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}

EARNINGS:
Basic Salary: KSh ${data.basicSalary.toLocaleString()}
House Allowance: KSh ${data.allowances.house.toLocaleString()}
Transport Allowance: KSh ${data.allowances.transport.toLocaleString()}
Medical Allowance: KSh ${data.allowances.medical.toLocaleString()}
Other Allowances: KSh ${data.allowances.other.toLocaleString()}
GROSS SALARY: KSh ${data.grossSalary.toLocaleString()}

DEDUCTIONS:
PAYE Tax: KSh ${data.deductions.paye.toLocaleString()}
NSSF: KSh ${data.deductions.nssf.toLocaleString()}
NHIF: KSh ${data.deductions.nhif.toLocaleString()}
Housing Levy: KSh ${data.deductions.housingLevy.toLocaleString()}
TOTAL DEDUCTIONS: KSh ${data.deductions.total.toLocaleString()}

NET SALARY: KSh ${data.netSalary.toLocaleString()}
    `;

    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${data.employee.firstName}-${data.employee.lastName}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Payroll Results - {data.employee.firstName} {data.employee.lastName}
              </CardTitle>
              <CardDescription>
                Payroll calculation for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Employee Info */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Employee ID</span>
              <p className="font-semibold">{data.employee.employeeId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Position</span>
              <p className="font-semibold">{data.employee.position}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Department</span>
              <p className="font-semibold">{data.employee.department}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="font-semibold">{data.employee.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Basic Salary</span>
              <span className="font-semibold">KSh {data.basicSalary.toLocaleString()}</span>
            </div>
            {data.allowances.house > 0 && (
              <div className="flex justify-between">
                <span>House Allowance</span>
                <span className="font-semibold">KSh {data.allowances.house.toLocaleString()}</span>
              </div>
            )}
            {data.allowances.transport > 0 && (
              <div className="flex justify-between">
                <span>Transport Allowance</span>
                <span className="font-semibold">KSh {data.allowances.transport.toLocaleString()}</span>
              </div>
            )}
            {data.allowances.medical > 0 && (
              <div className="flex justify-between">
                <span>Medical Allowance</span>
                <span className="font-semibold">KSh {data.allowances.medical.toLocaleString()}</span>
              </div>
            )}
            {data.allowances.other > 0 && (
              <div className="flex justify-between">
                <span>Other Allowances</span>
                <span className="font-semibold">KSh {data.allowances.other.toLocaleString()}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-lg font-bold text-green-600">
              <span>Gross Salary</span>
              <span>KSh {data.grossSalary.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>PAYE Tax</span>
              <span className="font-semibold">KSh {data.deductions.paye.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>NSSF Contribution</span>
              <span className="font-semibold">KSh {data.deductions.nssf.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>NHIF Contribution</span>
              <span className="font-semibold">KSh {data.deductions.nhif.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Housing Levy (1.5%)</span>
              <span className="font-semibold">KSh {data.deductions.housingLevy.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold text-red-600">
              <span>Total Deductions</span>
              <span>KSh {data.deductions.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Salary */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">Net Salary</h3>
            <p className="text-4xl font-bold text-blue-800">
              KSh {data.netSalary.toLocaleString()}
            </p>
            <Badge variant="secondary" className="mt-2">
              Take Home Pay
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 text-gray-600">
            <p>• PAYE calculated based on KRA tax bands with personal relief of KSh 2,400</p>
            <p>• NSSF contribution: 6% of pensionable pay (Tier 1: KSh 7,000, Tier 2: KSh 29,000)</p>
            <p>• NHIF contribution based on gross salary bands</p>
            <p>• Housing Levy: 1.5% of gross salary</p>
            <p>• Taxable income: KSh {data.taxableIncome.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollResults;
