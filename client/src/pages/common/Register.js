import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import Loader from "../../components/Loader";
import axios from 'axios';

const Register = () => {
  const { loading } = useSelector((state) => state.loader);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, setLogin] = useState(false)
  const [register, setRegister] = useState(false)
  const [username, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [otp, setOTP] = useState(null);
  const [password, setPassword] = useState(null);

  // otp send
  const onSubmit = async()=>{
      dispatch(ShowLoading())
      axios({
        method: "POST",
        data: {
          username,
          email,
          password
      },
      withCredentials: true,
      url: "http://localhost:5000/api/users/send-otp",
    }).then((res)=>{
      console.log(res.data)
      if(res.data.success){
        setRegister(true)
      }
      dispatch(HideLoading());
    }).catch((err)=>{
      console.log(err.response.data)
      dispatch(HideLoading())
    });
  }

  // otp confirmation
  const onOTPConfirm = async()=>{
    dispatch(ShowLoading())
      axios({
        method: "POST",
        data: {
          username,
          email,
          password,
          otp,
      },
      withCredentials: true,
      url: "http://localhost:5000/api/users/otp-confirmation",
    }).then((res)=>{
      console.log(res.data)
      if(res.data.success){
        console.log('user registration successful')
      }
      navigate('/login')
      dispatch(HideLoading());
    }).catch((err)=>{
      console.log(err.response.data);
      dispatch(HideLoading())
    });
  }

  useEffect(()=>{
    axios({
    method: "GET",
    withCredentials: true,
    url: "http://localhost:5000/api/users/isLogin",
    }).then((res)=>{
        setLogin(false);
        navigate('/dashboard');
    }).catch((err)=>{
        setLogin(true)
        navigate('/register');
    });
    // eslint-disable-next-line
}, []);
  return (
    <>
    {login && <div className='h-screen bg-primary'>
        {<div className='page h-100 '>
          <div className="page-content h-100 w-100 d-flex align-items-center justify-content-center py-5">
            <div className="form-content w-75 d-flex align-items-center justify-content-center h-100 shadow bg-body rounded">
              <div className="form-details p-5 bg-secondary text-white w-50 h-100 rounded-start">
                <h2>Information</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et molestie ac feugiat sed. Diam volutpat commodo.</p>
                <div>
                   <p><span className='f-weight-6 me-1'>Eu ultrices: </span>Vitae auctor eu augue ut. Malesuada nunc vel risus commodo viverra. Praesent elementum facilisis leo vel.</p>
                </div>
                <div className='w-35'>
                  <button to='#' className="account text-black text-sm px-3" onClick={()=>{navigate('/login')}}>Have An Account</button>
                </div>
              </div>
              <div className="form-left p-5 w-50 h-100 bg-white rounded-end ">
                <h2 className='text-center pb-3'>Register</h2>
                {!register && <div>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="email">E-mail</label>
                      <input type="email" name="email" id="email" pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" className='input-text' onChange={(event)=>{setEmail(event.target.value)}}/>
                  </div>
                  
                  <div className="form-row pt-2">
                      <p className='text-xs text-center'>You will receive the confirmation OTP on email after submitting this form.</p>
                  </div>
                </div>}
                {register && <div className='border p-2'>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="otp">Enter 6-Digit OTP</label>
                      <input type="text" name="otp" id="otp" pattern="[0-9]" className='input-text' onChange={(event)=>{setOTP(event.target.value)}} maxLength='6'/>
                  </div>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="username">User Name</label>
                      <input type="email" name="username" id="username" pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" className='input-text' onChange={(event)=>{setUserName(event.target.value)}}/>
                  </div>
                  <div className="form-group d-flex">
                      <div className="form-row p-2">
                        <label className='mb-2' htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="input-text"  onChange={(event)=>{setPassword(event.target.value)}}/>
                      </div>
                      <div className="form-row p-2">
                        <label className='mb-2' htmlFor="cpassword">Confirm Password</label>
                        <input type="password" name="password" id="password" className="input-text" />
                      </div>
                  </div>
                  <div className="form-row pt-3 px-2 ">
                      <button className='w-100 bg-secondary text-white' onClick={onOTPConfirm}>Confirm</button>
                      {loading && <Loader/>}
                  </div>
                </div>}
                {!register && <div className="form-row pt-3 px-2 ">
                    <button className='w-100 bg-secondary text-white' onClick={onSubmit}>Register</button>
                    {loading && <Loader/>}
                </div>}
              </div>
            </div>
          </div>
        </div>}
    </div>}
    </>
  )
}

export default Register
