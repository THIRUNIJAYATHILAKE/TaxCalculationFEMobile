import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { FontAwesome } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import ModalDropdown from 'react-native-modal-dropdown';

export default function TaxPaymentHistory() {
  const [taxPayments, setTaxPayments] = useState([]);
  const [selectedValue2, setSelectedValue2] = useState("All Payments");
  const [id, setId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          setId(id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://192.168.8.231:3000/api/taxpayer/getTaxPayments/${id}`)
        .then((response) => {
          setTaxPayments(response.data.Data);
        })
        .catch((error) => {
          console.error("Error fetching tax payments:", error);
        });
    }
  }, [id]);

  const handleDeleteClick = (index) => {
    const record = taxPayments[index];
    axios.delete(`http://192.168.8.231:3000/api/taxpayer/deletePaidTax/${record.paidTaxId}`)
      .then(() => {
        setTaxPayments((prevPayments) =>
          prevPayments.filter((_, i) => i !== index)
        );
        Alert.alert("Success", "Record deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handleDropdownSelect2 = (index, value) => {
    setSelectedValue2(value);
  };

  const filteredData = React.useMemo(() => {
    let data = taxPayments;
    if (selectedValue2 !== "All Payments") {
      data = taxPayments.filter(
        (payment) => payment.Description === selectedValue2
      );
    }
    return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [taxPayments, selectedValue2]);

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Paid Tax Summary Report</h1>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${filteredData.map(d => `
            <tr>
              <td>${new Date(d.updatedAt).toLocaleDateString()}</td>
              <td>${new Date(d.updatedAt).toLocaleTimeString()}</td>
              <td>${d.Description}</td>
              <td>${d.Paid}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await shareAsync(uri);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tax Payment History</Text>

      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select Payment Type:</Text>
        <ModalDropdown
          options={[
            "All Payments",
            "APIT",
            "WHT on Investment Income",
            "WHT on Service Fee Received",
            "Self Assessment Payments",
          ]}
          defaultValue={selectedValue2}
          onSelect={handleDropdownSelect2}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownList}
          dropdownTextStyle={styles.dropdownItemText}
        />
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeaderRow]}>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Date</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Time</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Description</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Amount</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell]}>Action</Text>
        </View>
        {filteredData.length > 0 ? (
          filteredData.map((d, index) => (
            <View key={d.paidTaxId} style={styles.tableRow}>
              <Text style={styles.tableCell}>{new Date(d.updatedAt).toLocaleDateString()}</Text>
              <Text style={styles.tableCell}>{new Date(d.updatedAt).toLocaleTimeString()}</Text>
              <Text style={styles.tableCell}>{d.Description}</Text>
              <Text style={styles.tableCell}>{d.Paid}</Text>
              <TouchableOpacity onPress={() => handleDeleteClick(index)}>
                <FontAwesome name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No tax payments found.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Generate Paid Tax Summary Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    width: '100%',
  },
  dropdownItemText: {
    fontSize: 16,
    padding: 10,
  },
  table: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderRow: {
    backgroundColor: "#eee",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  tableHeaderCell: {
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
