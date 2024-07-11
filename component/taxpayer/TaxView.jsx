import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native"; // if using react-navigation

export default function TaxView() {
  const [show, setShow] = useState(false); // for modal
  const [msg, setMsg] = useState("");
  const [show2, setShow2] = useState(true);

  const [userDetails, setUserDetails] = useState({});
  const [listOfTaxDetails, setListOfTaxDetails] = useState({});
  const [listOfTaxDetails2, setListOfTaxDetails2] = useState({});

  const getYearFromDate = (dateString) => {
    if (dateString) {
      return dateString.split("-")[0];
    }
    return "";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("Extracted Token:", token);

        if (token) {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          console.log("Decoded Token ID:", id);

          const userDetailsResponse = await axios.get(
            `http://192.168.8.231:3000/api/taxpayer/getUserDetails/${id}`
          );
          setUserDetails(userDetailsResponse.data.Data);

          const taxDetailsResponse = await axios.get(
            `http://192.168.8.231:3000/api/taxpayer/getTaxCalDetails/${id}`
          );
          setListOfTaxDetails(taxDetailsResponse.data.Data);
          setListOfTaxDetails2(taxDetailsResponse.data.Data2);
        } else {
          console.log("Token is null or undefined");
        }
      } catch (error) {
        console.error("Error decoding token or fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  function generatePDF() {
    if (!userDetails.isVerifiedUser) {
      setMsg(
        "First you have to be a Verified user! To do that upload necessary documents and data"
      );
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    }

    axios
      .get(
        `http://192.168.8.231:3000/api/taxpayer/generate-report/${userDetails.id}`
      )
      .then((response) => {
        if (response.data.Status) {
          setShow2(false);
          setMsg(response.data.Status);
          setShow(true);
          setTimeout(() => {
            setShow(false);
          }, 3000);
        } else {
          console.error("Error generating report:", response.data.status);
        }
      })
      .catch((error) => {
        setMsg(error.response.data.Status);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      });
  }

  const downloadPDF = (id) => {
    axios
      .get(`http://192.168.8.231:3000/api/taxpayer/getSummaryReport/${id}`)
      .then((response) => {
        if (response.data.Data.isVerified) {
          Alert.alert("File Ready", "The file is ready for download.");
          // Implement file download functionality for React Native
        } else {
          setMsg("Please wait for verification");
          setShow(true);
          setTimeout(() => {
            setShow(false);
          }, 3000);
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Modal isVisible={show}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alert</Text>
            <Text>{msg}</Text>
            <Button title="Okay" onPress={() => setShow(false)} />
          </View>
        </Modal>
        <View style={styles.header}>
          <Text style={styles.headerText}>Mr. {userDetails.name}</Text>
          <Text style={styles.headerText}>TIN NO: {userDetails.tin}</Text>
          <Text style={styles.headerText}>INCOME TAX COMPUTATION REPORT</Text>
          <Text style={styles.headerText}>
            YEAR OF ASSESSMENT {getYearFromDate(listOfTaxDetails.createdAt)}/
            {parseFloat(getYearFromDate(listOfTaxDetails.createdAt)) + 1}
          </Text>
        </View>

        <View style={styles.totalLiability}>
          <Text style={styles.topic}>
            Total Tax Liability For Year{" "}
            {getYearFromDate(listOfTaxDetails.createdAt)}/
            {parseFloat(getYearFromDate(listOfTaxDetails.createdAt)) + 1}
          </Text>
          <View style={styles.amount}>
            <Text>LKR</Text>
            <Text style={styles.amountValue}>
              {listOfTaxDetails.incomeTax +
                -listOfTaxDetails2.TaxCredit +
                (listOfTaxDetails.incomeTax2 +
                  (listOfTaxDetails.TerminalTax +
                    listOfTaxDetails.CapitalTax +
                    listOfTaxDetails.WHTNotDeductTax) -
                  listOfTaxDetails2.TaxCredit2)}
            </Text>
            <Text style={styles.note}>*This is not certified.</Text>
          </View>
        </View>

        <View style={styles.calculations}>
          <View style={styles.calculationBlock}>
            <Text style={styles.topic}>Calculation For 09 Months</Text>
            <View style={styles.row}>
              <Text>Total Income for 09 Months</Text>
              <Text>{listOfTaxDetails2.TotAssessableIncome} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Total Qualifying Payments & Reliefs</Text>
              <Text>
                {listOfTaxDetails2.Reliefs +
                  (listOfTaxDetails2.Choosed_QP * 9) / 12}
                LKR
              </Text>
            </View>
            <View style={styles.row}>
              <Text>Total Taxable Income</Text>
              <Text>{listOfTaxDetails.taxableAmount} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Tax on Total Taxable Income</Text>
              <Text>{listOfTaxDetails.incomeTax} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Tax On Other Benefits</Text>
              <Text>
                {((listOfTaxDetails.TerminalTax +
                  listOfTaxDetails.CapitalTax +
                  listOfTaxDetails.WHTNotDeductTax) *
                  9) /
                  12}
                LKR
              </Text>
            </View>
            <Text style={styles.note}>(ex:-Terminal, Capital gain, etc.)</Text>
            <View style={styles.row}>
              <Text>Total Tax Credits</Text>
              <Text>({listOfTaxDetails2.TaxCredit} LKR)</Text>
            </View>
            <View style={styles.liability}>
              <Text>Total Tax Liability</Text>
              <Text>
                {listOfTaxDetails.incomeTax +
                  ((listOfTaxDetails.TerminalTax +
                    listOfTaxDetails.CapitalTax +
                    listOfTaxDetails.WHTNotDeductTax) *
                    9) /
                    12 -
                  listOfTaxDetails2.TaxCredit}
                LKR
              </Text>
            </View>
          </View>

          <View style={styles.calculationBlock}>
            <Text style={styles.topic}>Calculation For 03 Months</Text>
            <View style={styles.row}>
              <Text>Total Income for 03 Months</Text>
              <Text>{listOfTaxDetails2.TotAssessableIncome2} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Total Qualifying Payments & Reliefs</Text>
              <Text>
                {listOfTaxDetails2.Reliefs2 +
                  (listOfTaxDetails2.Choosed_QP * 3) / 12}
                LKR
              </Text>
            </View>
            <View style={styles.row}>
              <Text>Total Taxable Income</Text>
              <Text>{listOfTaxDetails.taxableAmount2} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Tax on Total Taxable Income</Text>
              <Text>{listOfTaxDetails.incomeTax2} LKR</Text>
            </View>
            <View style={styles.row}>
              <Text>Tax On Other Benefits</Text>
              <Text>
                {((listOfTaxDetails.TerminalTax +
                  listOfTaxDetails.CapitalTax +
                  listOfTaxDetails.WHTNotDeductTax) *
                  3) /
                  12}
                LKR
              </Text>
            </View>
            <Text style={styles.note}>(ex:-Terminal, Capital gain, etc.)</Text>
            <View style={styles.row}>
              <Text>Total Tax Credits</Text>
              <Text>({listOfTaxDetails2.TaxCredit2} LKR)</Text>
            </View>
            <View style={styles.liability}>
              <Text>Total Tax Liability</Text>
              <Text>
                {listOfTaxDetails.incomeTax2 +
                  ((listOfTaxDetails.TerminalTax +
                    listOfTaxDetails.CapitalTax +
                    listOfTaxDetails.WHTNotDeductTax) *
                    3) /
                    12 -
                  listOfTaxDetails2.TaxCredit2}
                LKR
              </Text>
            </View>
          </View>
        </View>

      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  totalLiability: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  topic: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amount: {
    alignItems: "center",
  },
  amountValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  note: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  calculations: {
    marginBottom: 20,
  },
  calculationBlock: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  liability: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
