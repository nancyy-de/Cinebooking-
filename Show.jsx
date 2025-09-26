import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function Show(){
 const { id } = useParams();
 const [shows,setShows]=useState([]);
 const [selectedShow,setSelectedShow]=useState(null);
 const [seats,setSeats]=useState([]);
 const [holdInfo,setHoldInfo]=useState(null);
 useEffect(()=>{
   // fetch shows for movie id
   axios.get('/api/shows?movieId='+id).then(r=>setShows(r.data)).catch(()=>{});
 },[id]);
 async function loadShow(showId){
   const r = await axios.get('/api/shows/'+showId);
   setSelectedShow(r.data);
   // construct seats grid (A_1..A_8 rows A..D)
   const s=[];
   for(let row=0;row<4;row++){
     for(let col=1;col<=8;col++) s.push(String.fromCharCode(65+row)+'_'+col);
   }
   setSeats(s);
 }
 async function hold(){
   if(!selectedShow) return;
   const pick = seats.filter((_,i)=> i%7===0).slice(0,3); // demo pick first few
   const r = await axios.post('/api/bookings/hold',{ showId: selectedShow._id, seats: pick });
   setHoldInfo({ seats: pick, token: r.data.holdToken, expiresAt: r.data.expiresAt });
 }
 async function confirm(){
   if(!selectedShow || !holdInfo) return;
   const r = await axios.post('/api/bookings/confirm',{ showId: selectedShow._id, seats: holdInfo.seats, userEmail: 'demo@example.com' });
   alert('Booked! ID: '+r.data.booking._id);
   setHoldInfo(null);
   loadShow(selectedShow._id);
 }
 return (<div className="container">
   <h1>Shows</h1>
   <div>
     {shows.map(s=> (<div key={s._id}><button onClick={()=>loadShow(s._id)}>{new Date(s.startAt).toLocaleString()} - {s.screenName}</button></div>))}
   </div>
   {selectedShow && (
     <div>
       <h2>Seat map - {selectedShow.screenName}</h2>
       <div className="seat-grid">{seats.map(k=>{
         const st = selectedShow.seats && selectedShow.seats[k];
         const cls = st && st.status==='booked' ? 'seat booked' : 'seat';
         return <div key={k} className={cls}>{k}</div>;
       })}</div>
       <div style={{marginTop:10}}>
         {!holdInfo ? <button onClick={hold}>Hold seats (demo)</button> : (
           <div>
             <div>Held: {holdInfo.seats.join(', ')}</div>
             <button onClick={confirm}>Confirm Booking</button>
           </div>
         )}
       </div>
     </div>
   )}
 </div>);
}
