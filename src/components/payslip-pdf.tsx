import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  companyInfo: {
    flex: 1,
  },
  payslipInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  employeeSection: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderStyle: "solid",
  },
  employeeInfo: {
    flex: 1,
  },
  payPeriod: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoRow: {
    marginBottom: 3,
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    borderBottomStyle: "solid",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeader: {
    backgroundColor: "#F1F3F4",
    fontWeight: "bold",
    fontSize: 9,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  tableCellRight: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: "right",
  },
  tableCellCenter: {
    flex: 1,
    paddingHorizontal: 5,
    textAlign: "center",
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderStyle: "solid",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 2,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000000",
    borderTopStyle: "solid",
    fontWeight: "bold",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
    color: "#495057",
  },
});

interface CutoffData {
  hoursWorked: number;
  overtime: number;
  regularHolidays: number;
  specialHolidays: number;
  grossPay: number;
  totalDeduction: number;
  netPay: number;
  deductions?: Array<{ name: string; amount: number }>;
}

interface PayslipData {
  fullName: string;
  workRate: number;
  cutoffA: CutoffData;
  cutoffB: CutoffData;
}

interface PayslipPDFProps {
  data: PayslipData;
  cutoff: "a" | "b";
  month?: string;
  year?: string;
  overtimePay?: number;
  deductions?: Array<{ name: string; amount: number | null }>;
  regularHours: number; // Optional, if you want to display regular hours
  regularHolidayPay: number; // Optional, if you want to display regular holiday pay
  specialHolidayPay: number; // Optional, if you want to display special holiday pay
  regularPay: number; // Optional, if you want to display regular pay
}

const PayslipPDF: React.FC<PayslipPDFProps> = ({
  data,
  cutoff,
  month,
  year,
  deductions,
  overtimePay = 0, // Default to 0 if not provided
  regularHours,
  regularHolidayPay = 0, // Default to 0 if not provided
  specialHolidayPay = 0, // Default to 0 if not provided
  regularPay = 0, // Default to 0 if not provided
}) => {
  const cutoffData = cutoff === "a" ? data.cutoffA : data.cutoffB;
  const currentDate = new Date();
  const payPeriod = month && year ? `${month} ${year}` : "Current Period";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>PGFI PAYROLL SYSTEM</Text>
            <Text>Employee Payslip</Text>
            <Text>Cutoff {cutoff.toUpperCase()}</Text>
          </View>
          <View style={styles.payslipInfo}>
            <Text>Generated: {currentDate.toLocaleDateString()}</Text>
            <Text>Time: {currentDate.toLocaleTimeString()}</Text>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeSection}>
          <View style={styles.employeeInfo}>
            <Text style={styles.subtitle}>Employee Information</Text>
            <View style={styles.infoRow}>
              <Text>Name: {data.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>Work Rate: {data.workRate.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.payPeriod}>
            <Text style={styles.subtitle}>Pay Period</Text>
            <View style={styles.infoRow}>
              <Text>{payPeriod}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>Cutoff: {cutoff.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Earnings Section */}
        <Text style={styles.sectionTitle}>EARNINGS</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCellCenter}>Hours/Days</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Regular Hours</Text>
            <Text style={styles.tableCellCenter}>{regularHours}</Text>
            <Text style={styles.tableCellRight}>{regularPay.toFixed(2)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Overtime Hours</Text>
            <Text style={styles.tableCellCenter}>{cutoffData.overtime}</Text>
            <Text style={styles.tableCellRight}>{overtimePay.toFixed(2)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Regular Holidays</Text>
            <Text style={styles.tableCellCenter}>
              {cutoffData.regularHolidays}
            </Text>
            <Text style={styles.tableCellRight}>
              {regularHolidayPay.toFixed(2)}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Special Holidays (1.3x)</Text>
            <Text style={styles.tableCellCenter}>
              {cutoffData.specialHolidays}
            </Text>
            <Text style={styles.tableCellRight}>
              {specialHolidayPay.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Deductions Section */}
        {deductions && deductions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Description</Text>
                <Text style={styles.tableCellRight}>Amount</Text>
              </View>
              {deductions?.map((deduction, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{deduction.name}</Text>
                  <Text style={styles.tableCellRight}>
                    {deduction.amount?.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Gross Pay:</Text>
            <Text>{cutoffData.grossPay.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Deductions:</Text>
            <Text>{cutoffData.totalDeduction.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>NET PAY:</Text>
            <Text>{cutoffData.netPay.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: "#E5E5E5",
            borderTopStyle: "solid",
          }}
        >
          <Text style={{ fontSize: 8, color: "#6C757D", textAlign: "center" }}>
            This is a computer-generated payslip.
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: "#6C757D",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Generated on {currentDate.toLocaleDateString()} at{" "}
            {currentDate.toLocaleTimeString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPDF;
