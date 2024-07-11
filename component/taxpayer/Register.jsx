import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Modal from "react-native-modal";
import RNRestart from "react-native-restart";

export default function Register() {
  const [id, setId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("Extracted Token:", token);
        if (token) {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          console.log("Decoded Token ID:", id);
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
      getIncomeDetails();
    }
  }, [id]);

  const [values, setValues] = useState({
    businessIncome: "",
    employmentIncome: "",
    investmentIncome: "",
    otherIncome: "",
    id: id,
  });

  const [userData, setUserData] = useState({});

  const getIncomeDetails = async () => {
    try {
      const response = await Axios.get(
        `http://192.168.8.231:3000/api/taxpayer/getuserincomedetails/${id}`
      );
      setUserData(response.data.Data);
      setValues({
        ...values,
        businessIncome: response.data.Data.businessIncome,
        employmentIncome: response.data.Data.employmentIncome,
        investmentIncome: response.data.Data.investmentIncome,
        otherIncome: response.data.Data.otherIncome,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await Axios.patch(
        `http://192.168.8.231:3000/api/taxpayer/updateincomedetails`,
        values
      );
      if (res.data.Status === "Success") {
        Alert.alert("Success", "Details updated successfully!", [
        //  { text: "OK", onPress: () => RNRestart.Restart() },
        ]);
      } else {
        Alert.alert("Error", "Error in updating details");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Income Details</Text>
      <Text style={styles.label}>Employment Income (LKR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={values.employmentIncome}
        onChangeText={(text) =>
          setValues({ ...values, employmentIncome: text })
        }
      />
      <Text style={styles.label}>Investment Income (LKR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={values.investmentIncome}
        onChangeText={(text) =>
          setValues({ ...values, investmentIncome: text })
        }
      />
      <Text style={styles.label}>Business Income (LKR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={values.businessIncome}
        onChangeText={(text) => setValues({ ...values, businessIncome: text })}
      />
      <Text style={styles.label}>Other Income (LKR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={values.otherIncome}
        onChangeText={(text) => setValues({ ...values, otherIncome: text })}
      />
      <Button
        style={styles.Button}
        title="Update"
        onPress={toggleModal}
        color="#007BFF"
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text>Do you want to update details?</Text>
          <View style={styles.modalButtons}>
            <Button title="No" onPress={toggleModal} color="#FF0000" />
            <Button title="Yes" onPress={handleSubmit} color="#007BFF" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 15,

    width: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0085FF",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9d7d2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  Button: {
    marginTop: 29,
  },

  outer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
});
