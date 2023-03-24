import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [login, setlogin] = useState(false);
    const [user, setUser] = useState(null)

    const onLogout = ()=>{
        axios({
            method: "POST",
            withCredentials: true,
            url: "http://localhost:5000/api/users/logout",
        }).then((res)=>{
            alert("logout successfull");
            navigate('/login')
        }).catch((err)=>{
            console.log(err)
        });
    }

    useEffect(()=>{
            axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:5000/api/users/isLogin",
        }).then((res)=>{
            setUser(res.data.user)
            setlogin(true)
        }).catch((err)=>{
            setlogin(false)
            navigate('/login')
        });
        // eslint-disable-next-line
    }, []);
  return (
    <div>
        {login &&
        <>
            <h1>DashBorad</h1>
            <h1>Hello {user && user.username}</h1>
            <button onClick={onLogout}>logout</button>
        </>
        }
    </div>
  )
}

export default Dashboard
