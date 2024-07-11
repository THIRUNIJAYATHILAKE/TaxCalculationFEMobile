import { StatusBar } from 'expo-status-bar';
import { StyleSheet,  View } from 'react-native';
import { ClerkProvider , SignedIn,SignedOut} from "@clerk/clerk-expo";
import Login from './component/taxpayer/Login';
import Welcome from './component/taxpayer/Welcome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/taxpayer/LoginScreen';
import ForgetPassword from './component/taxpayer/ForgetPassword';
import Signup from './component/taxpayer/Signup';
import Dashboard from './component/taxpayer/Dashboard';
import Profile from './component/taxpayer/Profile';
import TaxPaymentHistory from './component/taxpayer/TaxPaymentHistory';
import TaxView from './component/taxpayer/TaxView';
import Register from './component/taxpayer/Register';
import TaxStatus from './component/taxpayer/TaxStatus';


const Stack = createStackNavigator();

export default function App() {
  return (
    <ClerkProvider publishableKey={'pk_test_c2luZ3VsYXItaGFnZmlzaC0zOS5jbGVyay5hY2NvdW50cy5kZXYk'}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="">
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="loginscreen" component={LoginScreen} />
        <Stack.Screen name="forget" component={ForgetPassword} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="taxhistory" component={TaxPaymentHistory} />
        <Stack.Screen name="taxview" component={TaxView} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="taxstatus" component={TaxStatus} />
      </Stack.Navigator>
    </NavigationContainer>

    
    <View style={styles.container}>

   
      
      
      <StatusBar style="auto" />
    </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#fff',
    
  },
});
