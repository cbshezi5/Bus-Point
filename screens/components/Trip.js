import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity,Alert,Vibration,ToastAndroid } from 'react-native'
import { doc,deleteDoc} from "firebase/firestore"
import { db } from '../../firebase-config';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'
import { setTime } from '../../slices/navSlice';


async function deleteTrip(id)
{
    Vibration.vibrate(70)
    Alert.alert(
        'Warning',
        'Are you sure you would like to delete the Trip?',
        [
          { text: "Cancel", style: 'cancel', onPress: () => {return} },
          { text: 'Yes',style: 'destructive',onPress: () => {delConfirmed(id)} },
        ]
      );   
}

async function delConfirmed(id)
{
    const tripDoc = doc(db,"Trip",id)
    await deleteDoc(tripDoc)
    .catch((error)=>{
        console.log(error.message)
        return;
    })
    ToastAndroid.show("Trip deleted successfully",500)
}




const Trip = (props) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()

    async function currentTripPress()
    {
        
        navigation.navigate("QRCode")
        if(props.temp)
        {
            dispatch(setTime({"time" : props.time,"type" : "temp"}))
        }else{
            dispatch(setTime({"time" : props.time,"type" : "perm"}))
        }
        
    }


    return (    
        <View style={styles.box}>
            <TouchableOpacity onLongPress={()=>{deleteTrip(props.id)}} onPress={()=>{currentTripPress()}}>
            <Text style={styles.date}>Date : {props.date}
            {
                props.temp?
                (
                    <Text style={{fontSize:13,color:"grey"}}>                               Temporally Trip</Text>
                )
                :
                null
            }
            
            
            </Text>
            <Text style={[styles.date,styles.details]}>Depureture : {props.depu}</Text>
            <Text style={[styles.date,styles.details]}>Destination : {props.dest}</Text>
            <Text style={[styles.date,styles.details,{fontSize:20}]}>Time : {props.time}</Text>
            {
                props.Status == "Active" ?
                (
                    <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"green"}}>{props.Status}</Text> </Text>
                )
                :
                props.Status == "Expired" ?
                (
                    <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"red"}}>{props.Status}</Text></Text>
                )
                :
                <Text style={[styles.date,styles.details,{fontSize:20}]}>Status : <Text style={{color:"orange"}}>{props.Status}</Text></Text>
                
            }
            </TouchableOpacity>
            <Text style={[styles.date,styles.details,{alignSelf:"center",marginTop:30,paddingLeft:5,paddingRight:20,textAlign:"center"}]} >
                The trip will expire 5min before the depureture time. Press and hold to delete the trip
            </Text>
        </View >
    )
}

export default Trip

const styles = StyleSheet.create({
    box:{
        backgroundColor:"black",
        height:280,
        width:400,
        alignSelf:"center",
        marginTop:30,
        borderRadius:20,
        marginBottom:10
    },
    date:{
        color:"white",
        marginTop:40,
        marginLeft:20,
        fontSize:19,
        fontWeight:"700"
    },
    details:{
        fontWeight:"600",
        fontSize:14,
        marginTop:10,
    },
    deleteBox:{
        backgroundColor:"red",
        alignSelf:"flex-end",
        marginRight:50,
        marginBottom:-40,
        justifyContent:"center",
        height:50,
        width:50
    },
    deleteIcon:{
        height:30,
        width:30,
        alignSelf:"center"
    }
})
