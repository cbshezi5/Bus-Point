import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native'
import { setTime } from '../../slices/navSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';



const SlotRender = (props) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [disableColor, setDisableColor] = useState("black")
    const [disabledVal, setDisabledVal] = useState(null)


    const [current, setcurrent] = useState(new Date()) ;
    const [minCur, setminCur] = useState(Number(current.getMinutes())) ;
    const [hrCur, sethrCur] = useState(Number(current.getHours())) ;

    const [minTrp, setminTrp] = useState(Number(props.time.substr(props.time.indexOf(":")+1,props.time.length)));
    const [hrTrp, sethrTrp] = useState(Number(props.time.substr(0,props.time.indexOf(":"))));

    const [dayCur,setDayCur] = useState(current.getUTCDate()+"-"+(current.getMonth()+1)+"-"+current.getFullYear())
  
    const [message, setMessage] = useState(props.busNum + " bus depurting");
    const [seatMessage, setSeatMessage] = useState() ;
 

    let isTemp = false;

    const totalBusSpace = 45

    useEffect(() => {

                if(props.avalSpace == 0)
                {
                    setSeatMessage("No seat left u can book as a temp")
                }

                if(props.avalSpace > 0 && props.avalSpace < 11)
                {
                    setSeatMessage("Fast book your self, seat low")
                }

                if(props.avalSpace > 10 && props.avalSpace < 21)
                {
                    setSeatMessage("Still fare seat available")
                }

                if(props.avalSpace > 20)
                {
                    setSeatMessage("Early bird catches the worm")
                }

                



                if(minCur >= minTrp && hrCur >= hrTrp && props.date == dayCur)
                {
                    setDisableColor("lightgrey")
                    setDisabledVal(true)
                    setMessage("Bus already gone")
                    setSeatMessage("Bus is already gone slot expired")
                    return
                }

                
                
                if(hrTrp - hrCur === 1 && props.date == dayCur)
                {
                    setDisableColor("green")
                    return
                }
                
                if(hrTrp - hrCur === 1 &&  minCur > 40 && props.date == dayCur)
                {
                    setDisableColor("orange")
                    return
            
                }

                if(props.busNum > 1 && props.avalSpace > totalBusSpace/2)
                {
                    setSeatMessage("Temp book currently  ⚠️")
                    setDisableColor("grey")
                    isTemp = true
                    return
                    
                }

                if(hrTrp - hrCur === 1 &&  minCur > 55 && props.date == dayCur)
                {
                    setDisableColor("red")
                    setMessage("Locked too late")
                    setSeatMessage("You are too late too book this bus")
                    setDisabledVal(true)
                    return
                }
           
    }, [])

   
    function timeClicked()
    {
        
       if(disableColor == "grey")
       {
            dispatch(setTime({"time" : props.time,"date" : props.date,"space":props.avalSpace,"id":props.id,"index":props.index,"type":"temp"}))
       }
       else
       {
            dispatch(setTime({"time" : props.time,"date" : props.date,"space":props.avalSpace,"id":props.id,"index":props.index,"type":"perm"}))
       }
        navigation.navigate("Confirm")
    } 
    

    return ( 
            <View style={{marginBottom:20}}>
                <TouchableOpacity style={[styles.button,{backgroundColor:disableColor}]} onPress={()=>{timeClicked()}} disabled={disabledVal}>
                    <Text style={styles.btnText}>{props.time} • {props.avalSpace} avaliable spaces</Text>
                </TouchableOpacity>
                <Text style={styles.busCount}>{message}</Text>
                <Text style={styles.capacity}>{seatMessage}</Text>
            </View>
    )
}

export default SlotRender

const styles = StyleSheet.create({
    button:{
        backgroundColor:"black",
        width:200,
        height:50,
        justifyContent:"center",
        marginLeft:16,
        borderRadius:30,
        marginTop:30,
    },
    btnText:{
        color:"white",
        alignSelf:"center",
    },
    busCount:{
        marginTop:-45,
        marginLeft:229,
        fontSize:17,
        fontWeight:"700"
    },
    capacity:{
        marginTop:3,
        marginLeft:229,
        fontSize:12,
    }

})
