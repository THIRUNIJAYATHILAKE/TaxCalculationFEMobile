import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { Button, TextInput } from "react-native-paper";
import Axios from "axios";

export default function ForgetPassword() {
  const base_url = "http://192.168.8.231:3000/api/taxpayer/forgot-password"; 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const res = await Axios.post(base_url, { email });
      if (res.data.Status === "Success") {
        Alert.alert("Success", "We have sent a link. Please check your email!");
        setLoading(false);
      } else if (res.data.Status === "NotSuccess" && res.data.message === "Email not found") {
        Alert.alert("Error", "Email not found");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.log(error);
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007BFF" />
        <View style={styles.form}>
          <Text style={styles.header}>Forgot Password</Text>
          <TextInput
            label="Enter your Email"
            mode="outlined"
            outlineColor="#d9d7d2"
            activeOutlineColor="#007BFF"
            theme={{ roundness: 10 }}
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              "Send Link"
            )}
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#D3E9FE",
  },
  form: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#fff",
    width: responsiveWidth(80),
    alignSelf: "center",
    boxShadow: "1px 5px 3px -3px rgba(0,0,0,0.44)",
  },
  header: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    color: "#0085FF",
    marginBottom: responsiveHeight(3),
    alignSelf: "center",
  },
  input: {
    width: responsiveWidth(70),
    height: responsiveHeight(6),
    alignSelf: "center",
    marginBottom: responsiveHeight(2),
  },
  button: {
    backgroundColor: "#007BFF",
    width: responsiveWidth(40),
    alignSelf: "center",
    padding: responsiveHeight(1),
    borderRadius: 10,
  },
});
