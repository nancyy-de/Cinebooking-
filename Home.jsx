import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function Home(){
 const [movies,setMovies] = useState([]);
 useEffect(()=>{ axios.get('/api/movies').then(r=>setMovies(r.data)).catch(()=>{}); },[]);
 return (<div className="container">
   <h1>Movies</h1>
   <div className="grid">{movies.map(m=> (
     <div className="card" key={m._id}>
       <h3>{m.title}</h3>
       <p>{m.description}</p>
       <Link to={"/show/"+m._id}>View shows</Link>
     </div>
   ))}</div>
 </div>);
}
