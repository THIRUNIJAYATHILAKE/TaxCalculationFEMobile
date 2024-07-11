import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen() {
  const base_url = "http://192.168.8.231:3000/api/taxpayer/login";

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!values.email || !values.password) {
      Alert.alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await Axios.post(base_url, values);
      setLoading(false);
      if (res.data.Status === "Success") {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(res.data);
        const token = await AsyncStorage.getItem("userToken");
        console.log("Extracted Token:", token);
        if (token) {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          console.log("Decoded Token ID:", id);
        }
        console.log(res.data.message);
        navigation.navigate("dashboard");
      } else {
        Alert.alert("Login Failed", res.data.message || "Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert("An error occurred", error.message || "Please try again.");
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password");
    navigation.navigate("forget");
  };

  const handleSignUp = () => {
    navigation.navigate("signup");
  };

  useFocusEffect(
    useCallback(() => {
      setValues({ email: "", password: "" });
    }, [])
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#007BFF" />

          <View style={styles.textSection}>
            <Text style={styles.welcomeText}>Login</Text>
          </View>

          <View style={styles.field}>
            <View style={{ marginBottom: responsiveHeight(2) }}>
              <TextInput
                label="Email"
                mode="outlined"
                outlineColor="#d9d7d2"
                activeOutlineColor="#007BFF"
                theme={{ roundness: 10 }}
                style={styles.input}
                value={values.email}
                onChangeText={(text) => setValues({ ...values, email: text })}
              />
            </View>

            <View>
              <TextInput
                label="Password"
                mode="outlined"
                outlineColor="#d9d7d2"
                theme={{ roundness: 10 }}
                activeOutlineColor="#007BFF"
                style={styles.input}
                secureTextEntry
                value={values.password}
                onChangeText={(text) =>
                  setValues({ ...values, password: text })
                }
              />
            </View>
          </View>

          <View
            style={{
              alignItems: "flex-start",
              width: responsiveWidth(87),
              marginBottom: responsiveHeight(1),
              marginTop: responsiveHeight(1),
            }}
          >
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : "LOGIN"}
          </Button>

          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.signupText, styles.signupLink]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    paddingTop: responsiveHeight(10),
    marginTop: responsiveHeight(-29),
  },
  container: {
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(5),
    width: responsiveWidth(90),
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 10,
    alignItems: "center",
  },
  textSection: {
    marginBottom: responsiveHeight(2),
  },
  welcomeText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    color: "#007BFF",
  },
  field: {
    width: "100%",
    marginBottom: responsiveHeight(2),
    alignItems: "center",
  },
  input: {
    width: responsiveWidth(87),
    height: responsiveHeight(5),
    fontSize: responsiveFontSize(1.8),
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: responsiveFontSize(1.8),
  },
  button: {
    width: responsiveWidth(87),
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: responsiveHeight(1),
    alignItems: "center",
  },
  signupTextContainer: {
    flexDirection: "row",
    marginTop: responsiveHeight(2),
  },
  signupText: {
    fontSize: responsiveFontSize(1.8),
    color: "#444444",
  },
  signupLink: {
    color: "#007BFF",
  },
});
