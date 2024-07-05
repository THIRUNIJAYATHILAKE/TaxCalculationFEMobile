import { View, Text, TextInput,StyleSheet} from 'react-native'
import React from 'react'
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";




WebBrowser.maybeCompleteAuthSession();

export default function Login() {

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress=async()=>{
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loginbold}>Login</Text>
      <Text>Username</Text>
      <TextInput style={styles.input}/>
      <Text>Password</Text>
      <TextInput style={styles.input}/>

      <Text style={styles.button}
      onPress={onPress}>Login</Text>

       <Text style={styles.button}
      onPress={onPress}>Continue with Google</Text>
    </View>
  )
}


const styles=StyleSheet.create({
  input:{
    borderWidth:1,
    padding:10
  },
  loginbold:{
    fontSize:20
  },
  button:{
    backgroundColor:'blue' ,
    padding:16,
    display:'flex',
    borderRadius:34,
    marginTop:20,
    textAlign:'center',
    color:'white'
  },
  container:{
    flex:1,
   // alignItems:'center',
    marginTop:150,
    marginLeft:50,
    width:300

  }
});