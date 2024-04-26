import axios from "axios";
import Cookies from "js-cookie";

const host = "https://localhost:8443";




export async function tokenExpired  () {
    // return false;
    // console.log("Executing rest")
    const timestamp = Cookies.get("tokenTimestamp");
    if (!timestamp) {
        return true;
    }
    const currentTimestamp = Date.now();
    const differenceInMinutes = (currentTimestamp - timestamp) / (1000 * 60);
    console.log(differenceInMinutes);
    // OFbiz expires token in every 30 minutes 
    const token = await Cookies.get("token");
    if(!token){
        return true;
    }
    console.log(token);
    return differenceInMinutes > 29 ;
}


export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()]; // Get the month name as a three-letter abbreviation
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    
    return `${day} ${month} ${year} ${hours}:${minutes}`; // Format as specified
}

export function convertToReadableFormat(inputString) {
    const words = inputString.split('_');  
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    const readableString = capitalizedWords.join(' ');
    
    return readableString;
}

export async function getToken(user, pass) {


    // if (!tokenExpired) {
    //     return Cookies.get("token");
    // }

    // const testing = await fetch("https://localhost:8443/rest/services/getSummary")
    // console.log(testing);

    const username =  user;
    const password =  pass;
    
    let token = null;
    
    try {
        console.log("Getting new token!!");
        console.log(`${host}/rest/auth/token`)
        const response = await axios.post(`${host}/rest/auth/token`, {}, {
            auth: {
                username: username,
                password: password
            }
        });

        token = await response.data.data.access_token;
        console.log(token);
    } catch (error) {
        console.error('Error:', error);
    }
    
    
    console.log("Got token: " + token);
    Cookies.set("tokenTimestamp", Date.now());
    Cookies.set("token", token);
    // if(token){
    //     return token
    // }
    return token;
}

export async function doGet(endpoint) {
    
    // if(!tokenExpired){
    //     Cookies.get("token")
    // }


    const token = Cookies.get("token");  // This will get JWT token from OFbiz or from browser Cookies

    console.log("Token using: " + token);
    try {
        console.log("Performing doGet()")
        const response = await axios.get(`${host}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export function doPost() { }
