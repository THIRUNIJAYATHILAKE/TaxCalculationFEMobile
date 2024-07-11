import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Signup() {
  const base_url = "http://192.168.8.231:3000/api/taxpayer/register";

  const [warning, setWarning] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    address: "",
    tin: "",
    nameofemployer: "",
    mobileno: "",
    officeno: "",
    homeno: "",
    birthday: "",
    agreeToannualFee: "",
    dprSource: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const navigation = useNavigation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    /*
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.');
      return;
    }
      if (email) {
      Alert.alert("Please fill in all fields");
      return;
    }
*/
if (password.length < 8) {
  setWarning("Password must be at least 8 characters long");
  return;
}

    
    if (password === "") {
      setWarning("Enter password!");
      return;
    }
    if (confirmPassword === "") {
      setWarning("Confirm password!");
      return;
    }

    if (password !== confirmPassword) {
      setWarning("Passwords do not match!");
      setPassword("");
      setConfirmPassword("");
      setValues({ ...values, password: "" });
      return;

      Alert.alert("Success", "Email and Password are valid!");
    }

    try {
      setLoading(true);
      const res = await Axios.post(base_url, values);
      console.log(res.data.message);

      if (res.data.Status === "Success") {
        console.log("Request was successful!");

        const setCookieHeader = res.headers["set-cookie"];
        if (setCookieHeader) {
          const token = setCookieHeader[0].split(";")[0].split("=")[1];
          console.log("Extracted Token:", token);
          await AsyncStorage.setItem("userToken", token);
        }

        navigation.navigate("dashboard");
      } else if (res.data.message === "already registered email") {
        Alert.alert("Email is already registered! Please Enter another one");
        setLoading(false);
      } else {
        Alert.alert("System Error!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Spinner visible={loading} />
        <View style={styles.form}>
          <Text style={styles.header}>Personal Details</Text>

          <TextInput
            label="Email"
            mode="outlined"
            style={styles.input}
            value={values.email}
            onChangeText={(text) => setValues({ ...values, email: text })}
          />

          <TextInput
            label="Name"
            mode="outlined"
            style={styles.input}
            value={values.name}
            onChangeText={(text) => setValues({ ...values, name: text })}
          />

          <TextInput
            label="Permanent Address"
            mode="outlined"
            style={styles.input}
            value={values.address}
            onChangeText={(text) => setValues({ ...values, address: text })}
          />

          <TextInput
            label="Tax Identification Number (TIN)"
            mode="outlined"
            style={styles.input}
            value={values.tin}
            onChangeText={(text) => setValues({ ...values, tin: text })}
          />

          <TextInput
            label="Name of the Employer"
            mode="outlined"
            style={styles.input}
            value={values.nameofemployer}
            onChangeText={(text) =>
              setValues({ ...values, nameofemployer: text })
            }
          />

          <Text style={styles.subHeader}>Contact Numbers</Text>

          <TextInput
            label="Mobile"
            mode="outlined"
            style={styles.input}
            value={values.mobileno}
            onChangeText={(text) => setValues({ ...values, mobileno: text })}
          />

          <TextInput
            label="Office"
            mode="outlined"
            style={styles.input}
            value={values.officeno}
            onChangeText={(text) => setValues({ ...values, officeno: text })}
          />

          <TextInput
            label="Home"
            mode="outlined"
            style={styles.input}
            value={values.homeno}
            onChangeText={(text) => setValues({ ...values, homeno: text })}
          />

          <TextInput
            label="Date of Birth"
            mode="outlined"
            style={styles.input}
            value={values.birthday}
            onChangeText={(text) => setValues({ ...values, birthday: text })}
          />

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setValues({ ...values, password: text });
            }}
          />

          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {warning ? <Text style={styles.warning}>{warning}</Text> : null}

          <Text style={styles.subHeader}>How do you know DPR?</Text>

          <RadioButton.Group
            onValueChange={(value) =>
              setValues({ ...values, dprSource: value })
            }
            value={values.dprSource}
          >
            <View style={styles.radioButton}>
              <RadioButton value="friend" />
              <Text>Introduced by a Friend</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="family" />
              <Text>Introduced by a Family Member</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="company" />
              <Text>Introduced by the Company</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="socialmedia" />
              <Text>Social Media</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="dprWebsite" />
              <Text>DPR Website</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="other" />
              <Text>Other</Text>
            </View>
          </RadioButton.Group>

          <Text style={styles.subHeader}>Are you agree with annual fee?</Text>

          <RadioButton.Group
            onValueChange={(value) =>
              setValues({ ...values, agreeToannualFee: value })
            }
            value={values.agreeToannualFee}
          >
            <View style={styles.radioButton}>
              <RadioButton value="yes" />
              <Text>Yes</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="no" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: responsiveWidth(5),
  },
  form: {
    borderRadius: 15,
    padding: responsiveWidth(5),
    backgroundColor: "#FFFFFF",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    fontSize: responsiveFontSize(3),
    marginBottom: responsiveHeight(2),
    color: "#0085FF",
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(2),
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    marginBottom: responsiveHeight(2),
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(1),
  },
  button: {
    marginTop: responsiveHeight(3),
    backgroundColor: "#007BFF",
  },
  warning: {
    color: "red",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
});
