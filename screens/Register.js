import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,TextInput,ToastAndroid,Vibration,TouchableOpacity,Image } from 'react-native'
import * as Font from 'expo-font'
import Apploading from "expo-app-loading";
import { useNavigation } from '@react-navigation/core';

import Parse from "parse/react-native";



const getFonts = () =>
  Font.loadAsync({
    MontserratBlack: require("../assets/font/CountrysideTwo-r9WO.ttf"),
    Rustling: require("../assets/font/HaisleyMind-lgxxZ.ttf"),
});


const doUserSignUp = async function (username,password,fname,lname,setStep,setPasswordErr) {
    // Note that these values come from state variables that we've declared before
    const usernameValue = username;
    const passwordValue = password;
    const emailValue = username;
    return await Parse.User.signUp(usernameValue.substring(0,usernameValue.indexOf("@")), passwordValue, { email: emailValue,
                                                                                                            firstName:fname,
                                                                                                            lastName:lname,
                                                                                                            student:true })
      .then(async (createdUser) => {
 
        await Parse.User.logOut();
        setPasswordErr("")
        setStep(3)
        // Go back to the login page
        //navigation.dispatch(StackActions.popToTop());
        return true;
      })
      .catch((error) => {
        // signUp can fail if any parameter is blank or failed an uniqueness check on the server
        
        setPasswordErr(error.message)

        if(error.message === "Account already exists for this username.")
        {
            setPasswordErr("Account already exists with the same email.") 
        }
        return false;
      });
};


function specialChars(phrase) {
    
    const spacials = String("!@#$%^&*()_-+=|\}]{[:;'?/>.<,~`")

    for (let index = 0; index < spacials.length; index++) {
        for (let x = 0; x < phrase.length; x++) {
            if(spacials[index] == phrase[x])
            {
                return true
            }
        }
        
    }
    return false
}

function anyNumber(phrase) {
    
    const spacials = String("1234567890")

    for (let index = 0; index < spacials.length; index++) {
        for (let x = 0; x < phrase.length; x++) {
            if(spacials[index] == phrase[x])
            {
                return true
            }
        }
        
    }
    return false
}



const Register = () => {
    //Values
    const [firstName, setFirstName] = useState(String())
    const [lastName, setLastName] = useState(String())
    const [email, setEmail] = useState(String())
    const [password, setPassword] = useState(String())
    //Error Messeging
    const [firstNameErr, setFirstNameErr] = useState(String())
    const [lastNameErr, setLastNameErr] = useState(String())
    const [emailErr, setEmailErr] = useState(String())
    const [passwordErr, setPasswordErr] = useState(String(""))


    const [step, setStep] = useState(1)
    const [fontsloaded, setFontsLoaded] = useState(false);
    const navigation = useNavigation()



    function toStepTwo()
    {
        if(firstName == "")
        {
            ToastAndroid.show("Empty first name not allowed",500)
            setFirstNameErr("*Field is mandetory")
            return
        }
        else
        {
            setFirstNameErr("")
        }

        if(lastName == "")
        {
            ToastAndroid.show("Empty last name not allowed",500)
            setLastNameErr("*Field is mandetory")
            return
        }
        else
        {
            setLastNameErr("")
        }

        if(email == "")
        {
            ToastAndroid.show("Empty email not allowed",500)
            setEmailErr("*Field is mandetory")
            return
        }
        else
        {
            setEmailErr("")
        }


        if(firstName.length < 3)
        {
            ToastAndroid.show("Too short first name",500)
            setFirstNameErr("Too short first name")
            return
        }
        else
        {
            setFirstNameErr("")
        }

        if(lastName.length < 3)
        {
            ToastAndroid.show("Too Short last name",500)
            setLastNameErr("Too Short last name")
            return
        }
        else
        {
            setLastNameErr("")
        }
        
        if(email.length < 5)
        {
            ToastAndroid.show("Too short email",500)
            setEmailErr("Too short email")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(specialChars(firstName))
        {
            ToastAndroid.show("Special character on first name",500)
            return
        }
        
        if(specialChars(lastName))
        {
            ToastAndroid.show("Special character on last name",500)
            return
        }

        if(anyNumber(firstName))
        {
            ToastAndroid.show("Number on last name",500)
            return
        }

        if(anyNumber(lastName))
        {
            ToastAndroid.show("Number on last name",500)
            return
        }

        if(firstName.indexOf(" ") == firstName.length)
        {
            setFirstName(firstName.substring(0,firstName.length - 1))
        }

        if(lastName.indexOf(" ") == lastName.length)
        {
            setLastName(lastName.substring(0,lastName.length - 1))
        }


        if(email.indexOf(" ") == email.length)
        {
            setEmail(email.substring(0,email.length - 1))
        }

        if(email.indexOf("@") < 1)
        {
            ToastAndroid.show("Incorrect email syntax",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.indexOf(".") < 1)
        {
            ToastAndroid.show("Incorrect email syntax",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(email.indexOf(".") < email.indexOf("@"))
        {
            ToastAndroid.show("Invalid student email address",500)
            return
        }
        else
        {
            setEmailErr("")
        }

        const studentNumber = email.substring(0,email.indexOf("@"))
        const domainName = email.substring(1 + email.indexOf("@"),email.indexOf("."))
        const orgCountry = email.substring(1 + email.indexOf("."),email.length)
        const orgnasation = orgCountry.substring(0,orgCountry.indexOf("."))
        const country = orgCountry.substring(orgCountry.indexOf(".") + 1,orgCountry.length)
        
        if(studentNumber == "" || domainName == "" || orgnasation == "" || country == "")
        {
            ToastAndroid.show("Incorrect email syntax missing dependancy",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(specialChars(domainName))
        {
            ToastAndroid.show("Found special characters on domain name",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(specialChars((email[email.length-1])))
        {
            ToastAndroid.show("Invalid student email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        if(orgnasation != "ac")
        {
            ToastAndroid.show("Not allowed organisation of the email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }
        
      
        if(country == "za" || country == "za ")
        {
            setEmailErr("")
        }
        else
        {
            ToastAndroid.show("Application only allows south african emails only",500)
            setEmailErr("Invalid student email address")
            return
        }

        if(specialChars(studentNumber))
        {
            ToastAndroid.show("Student number expected on the email identifier",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        for (let index = 0; index < studentNumber.length; index++) {
            if(isNaN(Number(studentNumber[index])))
            {
                ToastAndroid.show("Student number expected on the email identifier",500)
                setEmailErr("Invalid student email address")
                return
            }
            setEmailErr("")
        }
            
        

        if(email.indexOf(" ") > 1 && email.indexOf(" ") < email.length - 1)
        {
            ToastAndroid.show("Spaces are not allowed on email address",500)
            setEmailErr("Invalid student email address")
            return
        }
        else
        {
            setEmailErr("")
        }

        
       

        setStep(2)
    }

    function toStepThree()
    {
        Vibration.vibrate(70)
        doUserSignUp(email,password,firstName,lastName,setStep,setPasswordErr)
        //setStep(3)
    }

    function backStep()
    {
        setStep(1)
    }

    if(fontsloaded)
    {
    return (
        <View style={{flex:1,backgroundColor:"white",justifyContent:"center"}}>
            <Text style={{alignSelf:"center",marginTop:100,fontSize:53}}>Register</Text>
            <Text style={{alignSelf:"center",marginTop:10,marginBottom:100}}>Create your new account</Text>
            
            {
                step == 1 ?(
                <View >
                    
                <TextInput 
                    style={styles.input} 
                    numberOfLines={1}
                    multiline={false}
                    placeholder="Enter your first name"
                    maxLength={25}
                    textContentType="givenName"
                    autoCompleteType="name"
                    value={firstName}
                    onChangeText={(e)=>{setFirstName(e)}}
                    /> 
                    <Text style={{marginLeft:53,color:"red",marginBottom:-10}}>{firstNameErr}</Text>
                <TextInput 
                    style={styles.input} 
                    numberOfLines={1}
                    multiline={false}
                    placeholder="Enter your last name"
                    maxLength={25}
                    textContentType="givenName"
                    autoCompleteType="name"
                    value={lastName}
                    onChangeText={(e)=>{setLastName(e)}}
                    
                    />
                    <Text style={{marginLeft:53,color:"red",marginBottom:-10}}>{lastNameErr}</Text>
                <TextInput 
                    style={styles.input} 
                    numberOfLines={1}
                    multiline={false}
                    placeholder="Enter your student email"
                    textContentType="emailAddress"
                    maxLength={64}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    value ={email}
                    onChangeText={(e)=>{setEmail(e)}}
                    />
                    <Text style={{marginLeft:53,color:"red",marginBottom:-10}}>{emailErr}</Text>

                    
                    <TouchableOpacity style={{alignSelf:"center",marginTop:60}} onPress={()=>{toStepTwo()}}>
                        <Text style={[{fontSize:20},styles.next]}>Next</Text>
                    </TouchableOpacity>
                </View>
                )
                :
                step == 2 ?
                (
                    <View >

                    
                    <TextInput 
                    style={styles.input} 
                    numberOfLines={1}
                    multiline={false}
                    placeholder="Password"
                    keyboardType = 'visible-password'
                    value={password}
                    onChangeText={(e)=>{setPassword(e)}}
                    />

                    <Text style={{marginLeft:50,color:"red"}}>{passwordErr}</Text>
                    <TouchableOpacity style={{alignSelf:"center",marginTop:100}} onPress={()=>{toStepThree()}} >
                        <Text style={[styles.next,{fontSize:24}]} >Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignSelf:"center",marginTop:30}} onPress={()=>{backStep()}}>
                        <Text style={{fontSize:20,color:"black"}}>Back</Text>
                    </TouchableOpacity>
                    </View>
                )
                :
                step == 3  ? 
                (
                    <View>
                        <Text style={{alignSelf:"center",marginBottom:83,marginTop:-83}}>Click the bus below to proceed</Text>
                        <Text style={{paddingLeft:35,paddingRight:35,marginTop:-74,marginBottom:73}}>Verify your email address there should be a email with a link to verify click it's.</Text>

                    <View style={styles.icon}>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Login")}}>
                            <Image source={require('../assets/bus_wh48px.png')} style = {styles.iconProp}/>
                        </TouchableOpacity> 
                    </View>
                    <Text style={{alignSelf:"center",marginTop:23,fontSize:35}}>Welcome</Text>
                    <Text style={{alignSelf:"center",marginTop:3,fontSize:15}}>To</Text>
                                       
                    <Text style={{alignSelf:"center",marginTop:15,fontSize:50,fontFamily:"MontserratBlack"}}>Bus Point</Text>
     
                    </View>
                )
                :
                null
            }

        </View>
    )
    }
    else
    {
         return(<Apploading startAsync={getFonts} onFinish={() => { setFontsLoaded(true); }} onError={console.warn} />)
    }
}

export default Register

const styles = StyleSheet.create({
    input:{
        backgroundColor:'whitesmoke',
        marginTop:50,
        width:350,
        alignSelf:"center",
        height:50,
        fontSize:20,
        paddingRight:20,
        paddingLeft:20,
    },
    email:{
        marginTop:90,
        marginBottom:-80,
        marginLeft:50,
        fontSize:16
    },
    next:{
        backgroundColor:"black",
        color:"white",
        paddingLeft:20,
        paddingBottom:10,
        paddingRight:20,
        paddingTop:10
    },
    iconProp:{
        alignSelf:"center",
    },
    icon:{
        backgroundColor:"black",
        width:200,
        height:200,
        alignSelf:"center",
        marginTop:0,
        justifyContent:"center",
        borderRadius:100
    },
})
