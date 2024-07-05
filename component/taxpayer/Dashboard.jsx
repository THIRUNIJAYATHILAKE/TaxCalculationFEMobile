import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Avatar, Button, IconButton } from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useNavigation } from "@react-navigation/native";




export default function Dashboard() {
  const navigation = useNavigation();

  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007BFF" />
      {/* Top Profile Section */}
      <View style={styles.profileSection}>
      
        <Image source={require('./../../assets/profilepic.jpeg')} style={styles.profilePic}  ></Image> 
        <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Thiruni Jayathilake</Text>
        <Text style={styles.profileEmail}>thirunijayathilake@tna.com</Text>
        </View>
       
      </View>

      {/* Bottom Button Grid */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('profile')}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton} onPress={() => alert('Button 1')}>
          <Text style={styles.buttonText}>Download Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton} onPress={() => alert('Button 3')}>
          <Text style={styles.buttonText}>View Tax Calculation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton} onPress={() => navigation.navigate('taxhistory')}>
          <Text style={styles.buttonText}>Tax History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || responsiveHeight(2),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth(5),
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    margin: responsiveWidth(5),
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: responsiveWidth(5),
  },
  profileName: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  buttonGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(5),
  },
  gridButton: {
    width: responsiveWidth(40),
    height: responsiveHeight(20),
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
