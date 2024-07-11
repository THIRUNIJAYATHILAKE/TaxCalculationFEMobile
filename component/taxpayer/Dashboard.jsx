import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Avatar, Button, IconButton } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Dashboard() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
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
  useEffect(() => {
    if (id) {
      const getUserDetails = async () => {
        try {
          console.log("Fetching user details for ID:", id);
          const response = await axios.get(
            `http://192.168.8.231:3000/api/taxpayer/getNameForProfile/${id}`
          );
          console.log("Response Data:", response.data);
          if (response.data && response.data.Data && response.data.Data.data) {
            setUserData(response.data.Data.data);
            console.log("User Data:", response.data.Data.data);
          } else {
            console.log("Unexpected response structure:", response.data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getUserDetails();
    }
  }, [id]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007BFF" />
      {/* Top Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("./../../assets/profilepic.jpeg")}
          style={styles.profilePic}
        ></Image>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
        </View>
      </View>

      {/* Bottom Button Grid */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate("profile")}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate("taxstatus")}
        >
          <Text style={styles.buttonText}>Tax Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate("taxview")}
        >
          <Text style={styles.buttonText}>View Tax Calculation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridButton}
          onPress={() => navigation.navigate("taxhistory")}
        >
          <Text style={styles.buttonText}>Tax History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingTop: StatusBar.currentHeight || responsiveHeight(2),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsiveWidth(5),
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: responsiveWidth(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: responsiveWidth(5),
  },
  profileName: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: responsiveFontSize(2),
    color: "#666",
    marginTop: responsiveHeight(0.5),
  },
  buttonGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: responsiveHeight(5),
  },
  gridButton: {
    width: responsiveWidth(40),
    height: responsiveHeight(20),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(3),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  profilePic: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    borderRadius: responsiveWidth(10),
    borderWidth: 2,
    borderColor: "#007BFF",
  },
});
