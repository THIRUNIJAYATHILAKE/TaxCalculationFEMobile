import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from "react-native-paper";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Axios } from "axios";

export default function SignupFirst() {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async () => {
   /* if ( !email || !password || !confirmPassword) {
      Alert.alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }*/

    try {
      const response = await Axios.post("/api/users/register", {
        email,
        password,
        
      });
      if (response.data.success) {
        Alert.alert(
          "Success",
          "Please verify your email",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("signup"),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      if (
        error.response.data.error === "User with this email already exists."
      ) {
        Alert.alert(
          "Registration Error",
          "A user with this email already exists."
        );
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : " height"}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#007BFF" />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          

          <View style={styles.field}>
            <View style={{ marginBottom: 1}}>
              <TextInput
                label="Email"
                mode="outlined"
                outlineColor="#d9d7d2"
                activeOutlineColor="#007BFF"
                style={styles.inputButton}
                value={email}
                theme={{ roundness: 10 }}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            
            
            <Button
              mode="contained"
              onPress={handleSignUp}
              style={styles.button}
              
            >
              Sign up
            </Button>

            <Button
              mode="contained"
              
              style={styles.button}
              onPress={() => navigation.navigate('signup')}
            >
              hkadd
            </Button>
          </View>

          <View style={styles.loginTextContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("loginscreen")}>
              <Text style={[styles.signupText, styles.signupLink]}>Log in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyTermsContainer}>
            <Text style={styles.privacyText}>
            By Signing Up, you agree to our
            Terms & Privacy Policy 
            </Text>
           
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginTop: responsiveHeight(3),
    backgroundColor: "#007BFF",
    width: responsiveWidth(80),
    padding: responsiveHeight(0),
  },

  head: {
    fontSize: responsiveFontSize(5),
    fontWeight: "bold",
    top: responsiveHeight(0.1),
  },
  text: {
    fontSize: responsiveFontSize(2),
  },
  feildText: {
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(0.1),
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },

  textSection: {
    marginLeft: responsiveWidth(5),
  },
  field: {
    width: "100%",
    top: responsiveHeight(3),
    alignItems: "center",
  },

  loginTextContainer: {
    flexDirection: "row",
    marginLeft: responsiveWidth(8),
    top: responsiveHeight(5),
    alignItems:"center"
  },

  signupText: {
    color: "#000",
    fontSize: responsiveFontSize(2),
    
  },

  signupLink: {
    color: "#007BFF",
    marginLeft: 7,
    textDecorationLine: "none",
  },

  privacyTermsContainer: {
    marginBottom: 10,
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },

  privacyText: {
    fontSize: responsiveFontSize(1.5),
    textAlign: "center",
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveHeight(0.5),
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "none",
    fontSize: responsiveFontSize(1.5),
  },
  andText: {
    fontSize: responsiveFontSize(1.5),
  },
  errorText: {
    color: "red",
    marginLeft: 10,
  },
  inputButton: {
    width: responsiveWidth(87),
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(1.9),
    marginBottom: 10,
  },
});
//user registration
