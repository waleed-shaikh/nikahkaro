import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [login, setLogin] = useState(false)
  const [recaptchaVerified, SetRecaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [otp, setOTP] = useState(false)
  const [forgetPassword, setForgetPassword] = useState(false);
  const [otpSend, setOtpSend] = useState(false)

  const onChange = (value)=> {
    setRecaptchaToken(value);
    SetRecaptchaVerified(true)
  }
  const onEmailChange = (event)=>{
    setEmail(event.target.value)
  }
  const onPassChange = (event)=>{
    setPassword(event.target.value)
  }

  const onSubmit = ()=>{
    if(recaptchaVerified){
      axios({
        method: "POST",
        data:{
          token: recaptchaToken
        },
        withCredentials: true,
        url: `http://localhost:5000/api/users/verifyRecaptcha`,
      }).then((res)=>{
        console.log(res)
        if(res.data.success){
          dispatch(ShowLoading())
          axios({
            method: "POST",
            data: {
            email,
            password
          },
          withCredentials: true,
          url: "http://localhost:5000/api/users/login",
          }).then((res)=>{
            alert("login successfull");
            navigate('/dashboard');
            dispatch(HideLoading());
          }).catch((err)=>{
            dispatch(HideLoading());
          });
        } else{
          alert('plese verify the google recaptcha');
        }
      }).catch((err)=>{
        console.log(err)
      }); 
    } else {
      alert('plese verify the google recaptcha');
    }
  }

  const onForgetPassword = async()=>{
    dispatch(ShowLoading())
      axios({
        method: "POST",
        data: {
        email
      },
      withCredentials: true,
      url: "http://localhost:5000/api/users/forgot-password",
    }).then((res)=>{
      if(res.data.success){
        setOtpSend(true)
      }
      dispatch(HideLoading());
    }).catch((err)=>{
      console.log(err.response.data)
      dispatch(HideLoading());
    });
  }

  const onSavePassword = async ()=>{
    dispatch(ShowLoading())
      axios({
        method: "POST",
        data: {
        email,
        otp,
        password
      },
      withCredentials: true,
      url: "http://localhost:5000/api/users/save-password",
    }).then((res)=>{
      if(res.data.success){
        setOtpSend(false);
        setOTP(false);
        setForgetPassword(false)
      }
      dispatch(HideLoading());
    }).catch((err)=>{
      console.log(err.response.data)
      dispatch(HideLoading());
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
          navigate('/login')
      });
      // eslint-disable-next-line
  }, []);
  return (
    <>
    {login && <div className='h-screen bg-primary'>
        <div className='page h-100 '>
          <div className="page-content h-100 w-100 d-flex align-items-center justify-content-center py-5">
            <div className="form-content w-75 d-flex align-items-center justify-content-center h-100 shadow bg-body rounded">
              <div className="form-details p-5 bg-secondary text-white w-50 h-100 rounded-start">
                <h2>INFORMATION</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et molestie ac feugiat sed. Diam volutpat commodo.</p>
                <div>
                   <p><span className='f-weight-6 me-1'>Eu ultrices: </span>Vitae auctor eu augue ut. Malesuada nunc vel risus commodo viverra. Praesent elementum facilisis leo vel.</p>
                </div>
                <div className='w-35'>
                  <button to='#' className="account text-black text-sm px-3" onClick={()=>{navigate('/register')}}>Create An Account</button>
                </div>
              </div>
              <div className="form-left p-5 w-50 h-100 bg-white rounded-end ">
                {!forgetPassword && <div>
                  <h2 className='text-center pb-3'>Login</h2>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="email">e-mail</label>
                      <input type="email" name="email" id="email" pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" className='input-text' onChange={onEmailChange}/>
                  </div>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="password">Password</label>
                      <input type="password" name="password" id="password" className="input-text"  onChange={onPassChange}/>
                  </div>
                  <div className='d-flex justify-content-start p-2'>
                    <ReCAPTCHA
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onChange={onChange}
                      />
                  </div>
                  <div className="form-row pt-3 px-2 ">
                      <button className='w-100 bg-secondary text-white' onClick={onSubmit}>Login</button>
                  </div>
                  <div className='py-2 text-center mt-2'>
                    <Link to='#' className='text-black' onClick={()=>{setForgetPassword(true)}}>forgot password</Link>
                  </div>
                </div>}
                {forgetPassword && <div>
                  <h2 className='text-center pb-3'>Forgot Password</h2>
                  <div className="form-row p-2">
                      <label className='mb-2' htmlFor="email">Enter your registered e-mail Id</label>
                      <input type="email" name="email" id="email" pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" className='input-text' onChange={onEmailChange}/>
                  </div>
                  {otpSend && <div>
                      <div className="form-row p-2">
                        <label className='mb-2' htmlFor="otp">Enter 6-Digit OTP</label>
                        <input type="text" name="otp" id="otp" pattern="[0-9]" className='input-text' onChange={(event)=>{setOTP(event.target.value)}} maxLength='6'/>
                      </div>
                      <div className="form-row p-2">
                        <label className='mb-2' htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="input-text" onChange={(event)=>{setPassword(event.target.value)}}/>
                      </div>
                      <div className="form-row p-2">
                        <label className='mb-2' htmlFor="cpassword">Confirm Password</label>
                        <input type="password" name="password" id="password" className="input-text" />
                      </div>
                  </div>}
                  {!otpSend? <div className="form-row pt-3 px-2 ">
                      <button className='w-100 bg-secondary text-white' onClick={onForgetPassword}>Send OTP</button>
                  </div> :
                  <div className="form-row pt-3 px-2 ">
                    <button className='w-100 bg-secondary text-white' onClick={onSavePassword}>Save Password</button>
                  </div>
                  }
                  <div className='py-2 text-center mt-2'>
                    <Link to='#' className='text-black' onClick={()=>{setForgetPassword(false)}}>Back to login</Link>
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
    </div>}
    </>
  )
}

export default Login
