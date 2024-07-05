import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

import jwtDecode from 'jwt-decode';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  /*const cookieValue = Cookies.get('http://192.168.8.231:3000');
  const token = cookieValue.token;
  console.log(cookieValue);
  const decodedToken = jwtDecode(token);
        const id = decodedToken.id;

        AsyncStorage.setItem('token', token);*/

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
    const base_url = `http://192.168.8.231:3000/api/taxpayer/getuserbasicdetails`;
    const getUserDetails = async () => {
      try {
        const response = await axios.get(base_url);
        setUserData(response.data.Data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDetails = async (url, setter) => {
      try {
        const res = await axios.get(url);
        setter(res.data);
      } catch (error) {
        console.error(error);
      }
    };
/*
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getbusinessincome/${id}`, setBusinessIncomeDetails);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getemploymentincome/${id}`, setEmploymentIncomeDetails);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getinvestmentincome/${id}`, setInvestmentIncomeDetails);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getotherincome/${id}`, setOtherIncomeDetails);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getcapitalvaluegain/${id}`, setCapitalValueGain);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getreliefforexpenditure/${id}`, setReliefForExpenditure);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getreliefforrentincome/${id}`, setReliefForRentIncome);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getselfassessmentpayment/${id}`, setSelfAssessmentPayment);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getterminalbenefits/${id}`, setTerminalBenefits);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getqualifyingpayments/${id}`, setQualifyingPayments);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getwhtoninvestmentincome/${id}`, setWhtOnInvestmentIncome);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getwhtonservicefeereceived/${id}`, setWhtOnServiceFeeReceived);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getwhtwhichisnotdeducted/${id}`, setWhtWhichIsNotDeducted);
    fetchDetails(`http://192.168.8.231:3000/api/taxpayer/getapit/${id}`, setApit);
    getUserDetails();*/
  }, []);

  const calculateProgress = () => {
    const fieldsToCount = ['name', 'address', 'email', 'tin', 'nameofemployer', 'mobileno', 'officeno', 'homeno', 'birthday', 'isVerifiedEmail', 'isVerifiedUser'];
    const nonEmptyFields = fieldsToCount.reduce((acc, field) => acc + (userData[field] ? 1 : 0), 0);
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
    ].reduce((acc, arr) => acc + arr.filter(item => item.isverified).length, 0);
    const totalFields = fieldsToCount.length + 14 + verifiedCounts;
    const progress = ((nonEmptyFields + verifiedCounts) / totalFields) * 100;
    return Math.round(progress);
  };

  const now = calculateProgress() / 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={require('./../../assets/profilepic.jpeg')} style={styles.profilePic} ></Image> 
        <Text style={styles.name}>{userData.name}</Text>
        {userData.isVerifiedUser && <Text style={styles.verified}>Verified</Text>}
        <Text style={styles.tin}>TIN: {userData.tin}</Text>
        <ProgressBar progress={now} width={null} style={styles.progressBar} />
        <Text style={styles.progressLabel}>{Math.round(now * 100)}%</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text>Birthday: {userData.birthday}</Text>
        <Text>Mobile: {userData.mobileno}</Text>
        <Text>Office: {userData.officeno}</Text>
        <Text>Home: {userData.homeno}</Text>
        <Text>Location: {userData.address}</Text>
        <Text>Email: {userData.email}</Text>
        <Text>Address: {userData.address}</Text>
        <Text style={styles.sectionHeader}>Document Submission Summary</Text>
        <Text style={styles.sectionSubHeader}>Total Assessable Income</Text>
        {renderIncomeDetails('Business Income', businessIncomeDetails)}
        {renderIncomeDetails('Employment Income', employmentIncomeDetails)}
        {renderIncomeDetails('Investment Income', investmentIncomeDetails)}
        {renderIncomeDetails('Rent Income', reliefForRentIncome)}
        {renderIncomeDetails('Other Income', otherIncomeDetails)}
        <Text style={styles.sectionSubHeader}>Qualifying Payments & Reliefs</Text>
        {renderIncomeDetails('Relief For Expenditure', reliefForExpenditure)}
        {renderIncomeDetails('Qualifying Payments', qualifyingPayments)}
        <Text style={styles.sectionSubHeader}>Tax Credit</Text>
        {renderIncomeDetails('APIT', apit)}
        {renderIncomeDetails('WHT on Service Fee Received', whtOnServiceFeeReceived)}
        {renderIncomeDetails('WHT On Investment Income', whtOnInvestmentIncome)}
        {renderIncomeDetails('Self Assessment Payment', selfAssessmentPayment)}
        <Text style={styles.sectionSubHeader}>Other</Text>
        {renderIncomeDetails('Terminal Benefits', terminalBenefits)}
        {renderIncomeDetails('Capital Value & Gain', capitalValueGain)}
        {renderIncomeDetails('WHT Which Is Not Deducted', whtWhichIsNotDeducted)}
      </View>
    </ScrollView>
  );

  function renderIncomeDetails(title, details) {
    return (
      <View style={styles.incomeContainer}>
        <Text style={styles.incomeTitle}>{title}</Text>
        {details.map((item, index) => (
          <View key={index} style={styles.incomeItem}>
            <Text>{item.filePath ? 'Submitted' : 'Not Submitted'}</Text>
            <Text>{item.isverified ? 'Verified' : 'Not Verified'}</Text>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#D3E9FE',
    borderRadius: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  name: {
    fontSize: 24,
    color: '#0085FF',
    marginTop: 10,
  },
  verified: {
    fontSize: 18,
    color: 'green',
  },
  tin: {
    fontSize: 18,
    marginTop: 10,
  },
  progressBar: {
    marginTop: 20,
    width: '80%',
  },
  progressLabel: {
    fontSize: 18,
  }
  })