import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";

import Axios from "axios";
import {jwtDecode} from "jwt-decode";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaxStatus() {
  const [id, setId] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("Extracted Token:", token);

        if (token) {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          console.log("Decoded Token ID:", id);
          setId(id);

          // You can now use the id to fetch user details or perform other actions
        } else {
          console.log("Token is null or undefined");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUserData();
  }, []);

  const [amountInputs, setAmountInputs] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryText, setSelectedCategoryText] = useState("");
  const [taxPayments, setTaxPayments] = useState([]);

  // Popup for confirmation
  const [show, setShow] = useState(false); // for modal
  const [msg, setMsg] = useState("");

  const handleClose = () => {
    setShow(false);
    // Triggering refresh is not needed in React Native; use state updates instead
  };

  // Handler for updating amount input value
  const handleAmountInputChange = (value, index) => {
    // Regex to match only numbers
    const regex = /^\d*\.?\d*$/;

    // If value matches regex or empty, update input value
    if (value === "" || regex.test(value)) {
      const newAmountInputs = [...amountInputs];
      newAmountInputs[index] = value;
      setAmountInputs(newAmountInputs);
    }
  };

  // Handler for dropdown selection change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const categoryText = categoryOptions.find(
      (item) => item.value === value
    ).label;
    setSelectedCategoryText(categoryText);
  };

  // Handler for resetting inputs
  const handleDiscard = () => {
    setSelectedCategory("");
    setSelectedCategoryText("");
    setAmountInputs([""]);
  };

  // Initial state with the list of items as objects
  const [listOfItems, setListOfItems] = useState([
    { note: "Tax on Income", amount: 0.0 },
    { note: "Tax on Terminal benefits", amount: 0.0 },
    { note: "Tax on Capital Value Gain", amount: 0.0 },
    { note: "Tax on WHT Which is not Deducted", amount: 0.0 },
  ]);

  // Function to fetch taxes
  const fetchTaxes = (id) => {
    Axios.get(
      `http://192.168.8.231:3000/api/taxpayer/getCalculatedTax/${id}`
    ).then((response) => {
      const taxData = response.data.Data;

      // Calculate the "Tax on Income"
      const taxOnIncome = taxData.incomeTax + taxData.incomeTax2;

      // Update the listOfItems state with fetched data
      setListOfItems([
        { note: "Tax on Income", amount: taxOnIncome },
        { note: "Tax on Terminal benefits", amount: taxData.TerminalTax },
        { note: "Tax on Capital Value Gain", amount: taxData.CapitalTax },
        {
          note: "Tax on WHT Which is not Deducted",
          amount: taxData.WHTNotDeductTax,
        },
      ]);
    });
  };

  // Function to fetch paid tax payments
  const fetchTaxPayments = (id) => {
    Axios.get(
      `http://192.168.8.231:3000/api/taxpayer/getSumTaxPayments/${id}`
    ).then((response) => {
      setTaxPayments(response.data.Data);
    });
  };

  // Get taxes and paid tax payments
  useEffect(() => {
    if (id) {
      fetchTaxes(id);
      fetchTaxPayments(id);
    }
  }, [id]);

  // Calculate the total amount
  const totalAmount = listOfItems.reduce(
    (total, item) => total + item.amount,
    0
  );
  const totalPayment = taxPayments.reduce(
    (total, item) => total + parseFloat(item.totalPaid || 0),
    0
  );

  // Handler for submitting form
  const handleSubmit = () => {
    const isValidAmount =
      amountInputs[0] !== "" && !/^0+$/.test(amountInputs[0]);

    if (
      selectedCategoryText === "" ||
      !isValidAmount ||
      selectedCategoryText === "Select Category"
    ) {
      setMsg("Please select a category and enter a valid amount.");
      setShow(true);
      return;
    }

    // Submit the data
    const submittedData = {
      category: selectedCategoryText,
      amount: amountInputs[0],
    };

    // Send data to tables
    Axios.post(
      `http://192.168.8.231:3000/api/taxpayer/paidtax/${id}`,
      submittedData
    )
      .then((response) => {
        setMsg(response.data.Status);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);

        // Fetch updated data after submission
        fetchTaxes(id);
        fetchTaxPayments(id);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });

    // Reset the form after submission
    handleDiscard();
  };

  const categoryOptions = [
    { label: "Select Category", value: "" },
    { label: "APIT", value: "1" },
    { label: "WHT on Investment Income", value: "2" },
    { label: "WHT on Service Fee Received", value: "3" },
    { label: "Self Assessment Payments", value: "4" },
  ];

  return (
    <View style={styles.container}>
      <Modal visible={show} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alert</Text>
            <Text>{msg}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleClose}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.taxContainer}>
        <Text style={styles.heading}>Taxes</Text>
        <FlatList
          data={listOfItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taxItem}>
              <Text>{item.note}:</Text>
              <Text>{item.amount} LKR</Text>
            </View>
          )}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Tax: {totalAmount} LKR</Text>
        </View>
      </View>

      {taxPayments.length > 0 && (
        <View style={styles.taxPaymentsContainer}>
          <Text style={styles.heading}>Tax Payments</Text>
          <FlatList
            data={taxPayments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.taxItem}>
                <Text>{item.Description}:</Text>
                <Text>{item.totalPaid} LKR</Text>
              </View>
            )}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Tax Payments: {totalPayment} LKR
            </Text>
          </View>
        </View>
      )}
      <View style={styles.totalLiabilityContainer}>
        <Text style={styles.totalLiabilityText}>
          Total Tax Liability: {totalAmount - totalPayment} LKR
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.addTaxesText}>Add Paid Taxes</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => handleCategoryChange(itemValue)}
        >
          {categoryOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="AMOUNT"
          value={amountInputs[0]} // Set value from state
          onChangeText={(value) => handleAmountInputChange(value, 0)} // Handle input change
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
          <Text style={styles.buttonText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 20,
    alignItems: "center",
  },
  taxContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    marginBottom: 20,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taxPaymentsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    marginBottom: 20,
    elevation: 5,
  },
  totalLiabilityContainer: {
    backgroundColor: "#0085ff",
    padding: 10,
    borderRadius: 10,
    width: "90%",
    elevation: 2,
  },
  totalLiabilityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
  },
  addTaxesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0085ff",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    elevation: 2,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  discardButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#0085ff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
