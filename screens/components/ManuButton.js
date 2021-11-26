import React,{useState} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Image,ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Parse from "parse/react-native";
import { setStNumber,setLastName,setEmail,setFirstName } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';

async function LogOut(navigation) {
    await Parse.User.logOut()
    .then((error)=>{
        navigation.navigate("Login") 
    })
    navigation.navigate("Login")
}

async function getUserDet(setUserDetails,dispatch) {
    await Parse.User.currentAsync()
    .then((loggedInUser)=>{
        setUserDetails(loggedInUser.get("firstName")+" "+loggedInUser.get("lastName"))
        dispatch(setStNumber(loggedInUser.getUsername()))
        dispatch(setEmail(loggedInUser.getEmail()))
        dispatch(setFirstName(loggedInUser.get("firstName")))
        dispatch(setLastName(loggedInUser.get("lastName")))
    })
    .catch((error)=>{
        console.log(error.message)
        ToastAndroid.show("Sorry we couldn't get your details",500)
    })
    
    
}

const ManuButton = () => {
    const [manuOpenned, setManuOpenned] = useState(false)
    const [userDetails,setUserDetails] = useState(String())
    const dispatch = useDispatch()
    const navigation = useNavigation()
    getUserDet(setUserDetails,dispatch)

    return (
        <View>
            {
                manuOpenned ?
                (
                    <View style={{top:53}}>
                    <TouchableOpacity style={[styles.iconPromo,{backgroundColor:"white"}]} onPress={()=>{setManuOpenned(false)}}>
                        <Image source={require('../../assets/bus_bl48px.png')} style = {styles.iconProp} />
                    </TouchableOpacity>

                    <View style={styles.manu}>
                            <Text style={styles.userNames}>{userDetails}</Text>
                            <TouchableOpacity style={{width:80,marginLeft:30,marginTop:60}} onPress={()=>{LogOut(navigation)}}>
                                <Text style={styles.buttons}>Logout</Text>
                            </TouchableOpacity>
                            <Text style={{color:"white",fontSize:40,marginTop:-39,marginLeft:114}}>•</Text>
                            <TouchableOpacity style={{width:120,marginLeft:150,marginTop:-40}} onPress={()=>{navigation.navigate("CurrentTrip")}}>
                                <Text style={styles.buttons}>Current Trip</Text>
                            </TouchableOpacity>
                    </View>
                    </View>
                )
                :
                <View>
                    <TouchableOpacity style={styles.iconPromo} onPress={()=>{setManuOpenned(true)}}>
                            <Image source={require('../../assets/bus_wh48px.png')} style = {styles.iconProp} />
                    </TouchableOpacity>
                </View>
            }
            
            
            
            
            
        </View>
    )
}

export default ManuButton


const styles = StyleSheet.create({
    iconPromo:{
		alignSelf:"center",
		marginTop:90,
        marginBottom:-84,
		marginLeft:250,
        backgroundColor:"black",
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        borderRadius:50,
        elevation:9,
	},
    iconProp:{
        height: 30, 
        width: 30, 
        resizeMode : 'stretch',
    },
    manu:{
        backgroundColor:"black",
        height:110,
        zIndex:-2,
        elevation:8,
    },
    buttons:{
        color:"white",
        fontSize:20,

    },
    userNames:{
        color:"white",
        marginLeft:20,
        fontSize:30,
        marginTop:20,
        marginBottom:-50,
        fontWeight:"700",
    }
})
