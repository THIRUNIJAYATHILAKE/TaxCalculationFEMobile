import { View, Text ,StyleSheet,Image} from 'react-native'
import React from 'react'

export default function Welcome({navigation}) {
  return (
    <View style={style.container}>
       <Image source={require('./../../assets/tax.jpeg') 
       }  style={style.img}></Image> 
      <Text style={style.welcome}>Welcome</Text>
      <Text style={style.textfeild}>We are thrilled to welcome you 
to DPR, your go-to destination 
for hassle-free and efficient 
tax calculations.</Text>

<Text style={style.button}
onPress={() => navigation.navigate('loginscreen')}> Get Started</Text>
    </View>
  )
}


const style=StyleSheet.create({
    button:{
        backgroundColor:"#007BFF" ,
        padding:16,
        display:'flex',
        borderRadius:10,
        marginTop:20,
        textAlign:'center',
        color:'white',
        marginLeft:70,
      },
      container:{
        flex:1,
       // alignItems:'center',
        marginTop:120,
       
        width:350,
        //backgroundColor:'gray'
    },
    welcome:{
        marginTop:20,
        fontSize:24,
        textAlign:'center',
        marginLeft:70,
    },
    textfeild:{
        textAlign:'justify',
        marginTop:18,
        marginLeft:70,
    },
    img:{
width:413
    }
})