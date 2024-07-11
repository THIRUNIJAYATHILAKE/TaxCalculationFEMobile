import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProgressBar from "react-native-progress/Bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function Profile() {
  const [id, setId] = useState(null);
  const [userData, setUserData] = useState({});
  const [businessIncomeDetails, setBusinessIncomeDetails] = useState([]);
  const [employmentIncomeDetails, setEmploymentIncomeDetails] = useState([]);
  const [investmentIncomeDetails, setInvestmentIncomeDetails] = useState([]);
  const [otherIncomeDetails, setOtherIncomeDetails] = useState([]);
  const [capitalValueGain, setCapitalValueGain] = useState([]);
  const [reliefForExpenditure, setReliefForExpenditure] = useState([]);
  const [reliefForRentIncome, setReliefForRentIncome] = useState([]);
  const [selfAssessmentPayment, setSelfAssessmentPayment] = useState([]);
  const [terminalBenefits, setTerminalBenefits] = useState([]);
  const [qualifyingPayments, setQualifyingPayments] = useState([]);
  const [whtOnInvestmentIncome, setWhtOnInvestmentIncome] = useState([]);
  const [whtOnServiceFeeReceived, setWhtOnServiceFeeReceived] = useState([]);
  const [whtWhichIsNotDeducted, setWhtWhichIsNotDeducted] = useState([]);
  const [apit, setApit] = useState([]);

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
      const fetchDetails = async (url, setter) => {
        try {
          const res = await axios.get(url);
          setter(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      const base_url = `http://192.168.8.231:3000/api/taxpayer/getuserbasicdetails/${id}`;

      const getUserDetails = async () => {
        try {
          const response = await axios.get(base_url);
          setUserData(response.data.Data);
          console.log(response.data.Data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getbusinessincome/${id}`,
        setBusinessIncomeDetails
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getemploymentincome/${id}`,
        setEmploymentIncomeDetails
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getinvestmentincome/${id}`,
        setInvestmentIncomeDetails
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getotherincome/${id}`,
        setOtherIncomeDetails
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getcapitalvaluegain/${id}`,
        setCapitalValueGain
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getreliefforexpenditure/${id}`,
        setReliefForExpenditure
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getreliefforrentincome/${id}`,
        setReliefForRentIncome
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getselfassessmentpayment/${id}`,
        setSelfAssessmentPayment
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getterminalbenefits/${id}`,
        setTerminalBenefits
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getqualifyingpayments/${id}`,
        setQualifyingPayments
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getwhtoninvestmentincome/${id}`,
        setWhtOnInvestmentIncome
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getwhtonservicefeereceived/${id}`,
        setWhtOnServiceFeeReceived
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getwhtwhichisnotdeducted/${id}`,
        setWhtWhichIsNotDeducted
      );
      fetchDetails(
        `http://192.168.8.231:3000/api/taxpayer/getapit/${id}`,
        setApit
      );
      getUserDetails();
    }
  }, [id]);

  const calculateProgress = () => {
    const fieldsToCount = [
      "name",
      "address",
      "email",
      "tin",
      "nameofemployer",
      "mobileno",
      "officeno",
      "homeno",
      "birthday",
      "isVerifiedEmail",
      "isVerifiedUser",
    ];
    const nonEmptyFields = fieldsToCount.reduce(
      (acc, field) => acc + (userData[field] ? 1 : 0),
      0
    );
    const verifiedCounts = [
      businessIncomeDetails,
      employmentIncomeDetails,
      investmentIncomeDetails,
      otherIncomeDetails,
      capitalValueGain,
      reliefForExpenditure,
      reliefForRentIncome,
      selfAssessmentPayment,
      terminalBenefits,
      qualifyingPayments,
      whtOnInvestmentIncome,
      whtOnServiceFeeReceived,
      whtWhichIsNotDeducted,
      apit,
    ].reduce(
      (acc, arr) => acc + arr.filter((item) => item.isverified).length,
      0
    );
    const totalFields = fieldsToCount.length + 14 + verifiedCounts;
    const progress = ((nonEmptyFields + verifiedCounts) / totalFields) * 100;
    return Math.round(progress);
  };

  const now = calculateProgress() / 100;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require("./../../assets/profilepic.jpeg")}
            style={styles.profilePic}
          />
          <Text style={styles.name}>{userData.name}</Text>
          {userData.isVerifiedUser && (
            <Text style={styles.verified}>Verified</Text>
          )}
          <Text style={styles.tin}>TIN: {userData.tin}</Text>
          <ProgressBar progress={now} width={null} style={styles.progressBar} />
          <Text style={styles.progressLabel}>{Math.round(now * 100)}%</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Birthday: {userData.birthday}</Text>
          <Text style={styles.detailsText}>Mobile: {userData.mobileno}</Text>
          <Text style={styles.detailsText}>Office: {userData.officeno}</Text>
          <Text style={styles.detailsText}>Home: {userData.homeno}</Text>
          <Text style={styles.detailsText}>Location: {userData.address}</Text>
          <Text style={styles.detailsText}>Email: {userData.email}</Text>
          <Text style={styles.detailsText}>Address: {userData.address}</Text>
          <Text style={styles.sectionHeader}>Document Submission Summary</Text>
          <Text style={styles.sectionSubHeader}>Total Assessable Income</Text>
          {renderIncomeDetails("Business Income", businessIncomeDetails)}
          {renderIncomeDetails("Employment Income", employmentIncomeDetails)}
          {renderIncomeDetails("Investment Income", investmentIncomeDetails)}
          {renderIncomeDetails("Rent Income", reliefForRentIncome)}
          {renderIncomeDetails("Other Income", otherIncomeDetails)}
          <Text style={styles.sectionSubHeader}>
            Qualifying Payments & Reliefs
          </Text>
          {renderIncomeDetails("Relief For Expenditure", reliefForExpenditure)}
          {renderIncomeDetails("Qualifying Payments", qualifyingPayments)}
          <Text style={styles.sectionSubHeader}>Tax Credit</Text>
          {renderIncomeDetails("APIT", apit)}
          {renderIncomeDetails(
            "WHT on Service Fee Received",
            whtOnServiceFeeReceived
          )}
          {renderIncomeDetails(
            "WHT On Investment Income",
            whtOnInvestmentIncome
          )}
          {renderIncomeDetails(
            "Self Assessment Payment",
            selfAssessmentPayment
          )}
          <Text style={styles.sectionSubHeader}>Other</Text>
          {renderIncomeDetails("Terminal Benefits", terminalBenefits)}
          {renderIncomeDetails("Capital Value & Gain", capitalValueGain)}
          {renderIncomeDetails(
            "WHT Which Is Not Deducted",
            whtWhichIsNotDeducted
          )}
        </View>
      </View>
    </ScrollView>
  );

  function renderIncomeDetails(title, details) {
    return (
      <View style={styles.incomeContainer}>
        <Text style={styles.incomeTitle}>{title}</Text>
        {details.map((item, index) => (
          <View key={index} style={styles.incomeItem}>
            <Text
              style={[
                styles.incomeItem,
                { color: item.filePath ? "green" : "red" },
              ]}
            >
              {item.filePath ? "Submitted" : "Not Submitted"}
            </Text>
            <Text
              style={[
                styles.incomeItem,
                { color: item.filePath ? "green" : "red" },
              ]}
            >
              {item.isverified ? "Verified" : "Not Verified"}
            </Text>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: responsiveHeight(3),
    marginTop: responsiveHeight(2),
    backgroundColor: "#Fff",
    padding: responsiveHeight(2),
    borderRadius: 10,
  },
  profilePic: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    borderWidth: 3,
    borderColor: "#4A90E2",
  },
  name: {
    fontSize: responsiveFontSize(3),
    color: "#2C3E50",
    fontWeight: "bold",
    marginTop: responsiveHeight(1),
  },
  verified: {
    fontSize: responsiveFontSize(2),
    color: "#27AE60",
    fontWeight: "600",
    marginTop: responsiveHeight(0.5),
  },
  tin: {
    fontSize: responsiveFontSize(2),
    color: "#7F8C8D",
    marginTop: responsiveHeight(0.5),
  },
  progressBar: {
    marginTop: responsiveHeight(2),
    width: "80%",
    backgroundColor: "#D5D8DC",
  },
  progressLabel: {
    fontSize: responsiveFontSize(2),
    color: "#2C3E50",
    fontWeight: "500",
    marginTop: responsiveHeight(1),
  },
  detailsContainer: {
    marginTop: responsiveHeight(2),
    backgroundColor: "#FFFFFF",
    padding: responsiveHeight(2),
    borderRadius: 10,
  },
  detailsText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
    fontWeight: "500",
    color: "#34495E",
    paddingLeft: responsiveWidth(4),
  },
  incomeContainer: {
    marginTop: responsiveHeight(2),
    paddingLeft: responsiveWidth(4),
  },
  incomeTitle: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.2),
    color: "#2C3E50",
    marginBottom: responsiveHeight(1),
  },
  incomeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(2),
  },
  sectionHeader: {
    marginLeft: responsiveWidth(4),
    marginTop: responsiveHeight(3),
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    color: "#2C3E50",
  },
  sectionSubHeader: {
    marginLeft: responsiveWidth(4),
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(2.2),
    fontWeight: "600",
    color: "#34495E",
  },
});
