import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,TouchableOpacity,ToastAndroid,Vibration,LogBox } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectDestination,selectOrigin,selectTime,setStNumber,selectStNumber } from '../slices/navSlice';
import { onSnapshot,collection,query,where,addDoc,updateDoc,doc,getDocs } from "firebase/firestore"
import { useDispatch } from 'react-redux';
import { db } from '../firebase-config';


const message = "By Confirming you will be"+
" booking the bus and you won't be able to book"+
" again until you have used your trip token if its" +
" expires also you will be unlocked to book again."+
" If your have a temp trip your can book "





const Confirm = () => {
    LogBox.ignoreLogs(["TypeError: undefined is not a function (near '...Slots...')"])
    const navigation = useNavigation()
    const time = useSelector(selectTime)
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const [trip, setTrip] = useState([]);
    const[tripTemp, setTripTemp] = useState([])
    const dispatch = useDispatch()
    let loadState = "undone"
    let slotload = "undone"
    let tripTempload = "undone"
    let temp = false
    let Wslot;
    let [slots, setSlots] = useState([])
    
    
    const studentNum = useSelector(selectStNumber)
    
    useEffect(
        () => 
        onSnapshot(
            query(
                collection(db,"Trip"),
                where('Date','==', time.date),
                ), 
                (snapshot) => 
                    setTrip(
                        snapshot
                        .docs
                        .filter((doc) => doc.get("Status") == "Active")
                        .filter((doc) => doc.get("Temporally") == false)
                        .filter((doc) => doc.get("StudentNumber") == String(studentNum))
                        .map(doc => ({
                            id : doc.id,
                            ...doc.data()
                        })) 
                    ) 
                )
            ,    
        []
        
    );
    loadState = "done";
 

    const  qrScreen = async ()  =>
    {
       
        if(trip[0]?.id != null && loadState == "done")
        {
            Vibration.vibrate(100)
            ToastAndroid.show("You already have a active trip on "+trip[0]?.Time+" From "+trip[0]?.From+" to "+trip[0]?.To ,ToastAndroid.LONG)
        }
        else
        {
                
            if(slots[0]?.From == null)
            {
             onSnapshot(
                query(
                    collection(db,"Slot"),
                    where('Date','==', time.date),
                    ), 
                    (snapshot) => 
                        setSlots(
                            snapshot
                            .docs
                            .filter((doc) => doc.get("From") == origin)
                            .filter((doc) => doc.get("To") == destination)
                            .map(doc => ({
                                ...doc.data(), 
                                
                        }))
                        
                )
            )
            }
            slotload='done'

          
           
            if(slots[0]?.From != null && slotload == "done")
            {
                Wslot = slots[0]?.Slot;


                if(Wslot[time.index - 1].Space == 0)
                {
                    Wslot[time.index - 1].Bus = Wslot[time.index - 1].Bus + 1
                    Wslot[time.index - 1].Space = 42
                    temp = true 
                }
                else
                {
                    Wslot[time.index - 1].Space = Wslot[time.index - 1].Space - 1
                }

                if(Wslot[time.index - 1].Space > 45/2 && Wslot[time.index - 1].Bus > 1)
                {
                    temp = true
                }

                let temps = null;
                //Getting the existance of the temporally trip(token) in number
                await getDocs(
                        query(collection(db,"Trip")))
                        .then((data)=>
                        {temps = data.docs
                        .filter((doc) => doc.get("Date") == time.date)
                        .filter((doc) => doc.get("StudentNumber") == String(studentNum))
                        .filter((doc) => doc.get("Temporally") == true)
                        .filter((doc) => doc.get("Status") == "Active")
                        .length
                    })
                
                if(temps > 0 && temp)
                { 
                        Wslot[time.index - 1].Space = Wslot[time.index - 1].Space + 1
                        Vibration.vibrate(100)
                        ToastAndroid.show("Already have a Temporallt trip",500) 
                        return
                }
               
                //
                dispatch(setStNumber(studentNum))


                await addDoc(collection(db,"Trip"),{Date:time.date,
                                            From:origin,
                                            To:destination,
                                            Time:time.time,
                                            StudentNumber:studentNum,
                                            Temporally:temp,
                                            Status:"Active",
                                            No:1})
                .catch((error)=>{
                    console.log(error.message)
                })
                
                 const slotDoc = doc(db,"Slot",time.id)
    
                 const newVal = {"Slot": Wslot }                           
                  
                 await updateDoc(slotDoc,newVal)
                .catch((error)=>{console.log(error.message)})

                navigation.navigate("QRCode")
            }
            
        }
    }

    return (
        <View style={{backgroundColor:"white",flex:1}}>
            <Text style={styles.tittle}>Confirm</Text>
            <Text style={[styles.tittle,{marginTop:23,fontSize:19,paddingRight:50,paddingLeft:50}]}>Are you sure you would like to book the bus ?</Text>
            <Text style={styles.details}>Depurting at {time.time}</Text>
            <Text style={[styles.details,{marginTop:7,marginBottom:50}]}> {time.date}</Text>
            <View style={styles.trip}>
                <Text style={styles.road}>From : {origin}</Text>
                <Text style={styles.road}>To : {destination}</Text>
            </View>
            <Text style={styles.road2}>{message}</Text>
            <Text style={{alignSelf:"center",marginTop:80,marginBottom:-53}}>Double click to cornfirm</Text>
            <TouchableOpacity style={styles.btnYes} onPress={()=>{qrScreen()}}>
                <Text style={{alignSelf:"center",fontSize:19}}>Yes</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Confirm

const styles = StyleSheet.create({
    tittle:{
        alignSelf:"center",
        marginTop:100,
        fontSize:50,
    },
    details:{
        marginTop:23,
        alignSelf:"center",
        fontSize:17
    },
    road:{
        alignSelf:"center",
        fontSize:20,
        color:"white",
        fontWeight:"700"
    },
    road2:{
        marginTop:100,
        paddingLeft:40,
        paddingRight:40
    },
    trip:{
        backgroundColor:"black",
        height:70,
        justifyContent:"center",
        width:200,
        alignSelf:"center"
    },
    btnYes:{
        alignSelf:"center",
        marginTop:60,
        borderColor:"black",
        borderWidth:2,
        width:200,
        height:50,
        justifyContent:"center",
        borderRadius:23
    }
})
