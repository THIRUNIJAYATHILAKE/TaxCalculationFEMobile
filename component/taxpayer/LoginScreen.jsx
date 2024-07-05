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


export default function LoginScreen() {
  const base_url = 'http://192.168.8.231:3000/api/taxpayer/login';

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
      if (res.data.Status === "Success") {
        /*const cookies = await CookieManager.get('http://192.168.8.231:3000');
        if (cookies && cookies.jwt) {
          const token = cookies.jwt.value;
          // You can now use the token as needed
          console.log('JWT Token:', token);}*/
        navigation.navigate("dashboard"); // Corrected navigate to use navigation object
      } else {
        setLoading(false);
        alert("Login Failed!");
      }
    } catch (error) {
      console.log(error);
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
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007BFF" />

        <View style={styles.textSection}>
          <Text style={styles.welcomeText}>Login </Text>
        </View>

        <View style={styles.field}>
          <View style={{ marginBottom: responsiveHeight(2) }}>
            <TextInput
              label="Email"
              mode="outlined"
              outlineColor="#d9d7d2"
              activeOutlineColor="#007BFF"
              theme={{ roundness: 10 }}
              style={{
                width: responsiveWidth(87),
                height: responsiveHeight(6),
                fontSize: responsiveFontSize(1.9),
              }}
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
              style={{
                width: responsiveWidth(87),
                height: responsiveHeight(6),
                fontSize: responsiveFontSize(1.9),
              }}
              secureTextEntry
              value={values.password}
              onChangeText={(text) => setValues({ ...values, password: text })}
            />
          </View>
        </View>

        <View style={{ alignItems: "flex-end", width: responsiveWidth(42), marginBottom: responsiveHeight(1),marginTop:responsiveHeight(1) }}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          LOGIN
        </Button>

        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signupText, styles.signupLink]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    height: responsiveHeight(6.5),
    backgroundColor: "#007BFF",
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      },
    }),
  },
  button: {
    marginTop: responsiveHeight(5),
    backgroundColor: "#007BFF",
    width: responsiveWidth(80),
    padding: responsiveHeight(0),
    marginLeft: responsiveWidth(10),
  },
  welcomeText: {
    fontSize: responsiveFontSize(5),
    fontWeight: "bold",
    top: responsiveHeight(0.1),
  },
  signInText: {
    fontSize: responsiveFontSize(2),
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textSection: {
    marginLeft: responsiveWidth(5),
  },
  field: {
    width: responsiveWidth(100),
    top: responsiveHeight(5),
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: responsiveFontSize(2),
    textDecorationLine: "none",
    textAlign: "left",
    top: responsiveHeight(3),
    marginTop: responsiveHeight(4),
    marginLeft: responsiveWidth(8),
  },
  signupTextContainer: {
    flexDirection: "row",
    marginLeft: responsiveWidth(8),
    top: responsiveHeight(3),
  },
  signupText: {
    color: "#000",
    fontSize: responsiveFontSize(2),
    
  },
  signupLink: {
    color: "#007BFF",
    marginLeft: responsiveFontSize(0.5),
    textDecorationLine: "none",
  },
});
