import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { initFirebase } from '../src/config'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Home() {
  const [isSplash, setSplash] = useState(true);
  useEffect(() => {
    if (getOS() == 'Android') {
      router.push('/er')
    } else if (getOS() == 'iOS') {
      router.push('/er')
    } else {
      setTimeout(() => {
        setSplash(false);
      }, 3000)
    }
  }, [])
  const router = useRouter();
  const [screen, changeScreen] = useState(true);
  var em = '';
  var pass = '';
  const app = initFirebase();
  const auth = getAuth();
  const [load, changeLoad] = useState('1');
  function getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  }

  return (

    <div className={styles.container}>
      <Head>
        <title>Work @ WGLLC</title>
        <meta name="application-name" content="Warriors Group Work" />
        <meta name="description" content="The official work app for Warriors Group LLC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Warriors Group LLC @work" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {
          isSplash ? <div id="loadingScreen" >
            <div id="innerLoading">
              <Image id="aniImage" src='/assets/aniLogo.gif' width={400} height={500} alt='loading animation logo' />
              <div id='dots'>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div> : <div></div>
        }


        <div id="LoginPage">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {screen ?
            <div id="maincont">
              <Image src='/pwatrans.png' width={300} height={300} alt='warriors logo' />
              <div id="head">Warriors Group LLC</div>
              <div id="subt">Login</div>
              <div className="subs">
                Enter your registered email
              </div>
              <input type="email" name="reg_email" id="em" className="inp" placeholder='Email' required
                onChange={() => {
                  em = document.getElementById("em").value;
                }} />
              <div className="subs">
                Enter your password
              </div>
              <input type="password" className="inp" placeholder='password' id='pass' required onChange={() => {
                pass = document.getElementById("pass").value;


              }} />
              <div className="subs" id="forget"

              ><div onClick={() => {

                changeScreen(false);


              }}>Forgot password?</div></div>
              <div id="butt" onClick={

                function log() {
                  changeLoad('0.4');
                  signInWithEmailAndPassword(auth, em, pass)
                    .then((userCred) => {
                      var user = userCred;
                      Cookies.set('isLogged', 'logged', { expires: 1 / 24 });
                      Cookies.set('email', auth.currentUser.email);

                      if (Cookies.get('email') == 'contact@warriorsgrp.com') {
                        if (auth.currentUser.displayName == '' || auth.currentUser.email == '' || auth.currentUser.displayName == null || auth.currentUser.photoURL == null || auth.currentUser.photoURL == "") {
                          router.push('/updatedet');
                        } else {
                          router.push('/adminpage');
                        }
                      } else {
                        if (auth.currentUser.displayName == '' || auth.currentUser.email == '' || auth.currentUser.photoURL == "") {
                          router.push('/updatedet')
                        } else {
                          router.push('/dashboard')
                        }
                        if (user.user.emailVerified == false) {
                          sendPasswordResetEmail(auth, auth.currentUser.email);
                        }
                      }


                    }).catch((error) => {

                      toast.warn('Invalid password/email', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                      changeLoad(1);
                      setTimeout(() => {
                        router.reload();
                      }, 3000)
                    })
                }
              } style={{ opacity: load }}>Login</div>

            </div> : <div id="maincont">
              <Image src='/pwatrans.png' width={300} height={300} alt='warriors logo' />
              <div id="head">Warriors Group LLC</div>
              <div id="subt">Password Reset</div>
              <div className="subs">
                Enter your registered email
              </div>
              <input type="email" name="reg_email" id="em" className="inp" placeholder='Email'
                onChange={() => {
                  em = document.getElementById("em").value;


                }} />

              <div id="back" className="subs" onClick={() => {
                changeScreen(true)
              }}
              >Back to login</div>

              <div id="butt" onClick={

                async function reset() {
                  changeLoad('0.5');
                  if (em != '') {
                    sendPasswordResetEmail(auth, em).then(() => {
                      toast.success('Password reset link sent succesfully', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                      changeLoad('1');


                    })
                  } else {

                    toast.error('Invalid email/ No email', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    changeLoad('1');
                    setTimeout(() => {
                      router.reload();
                    }, 2000)


                  }
                }
              } style={{ opacity: load }}>Reset Password</div>


            </div>
          }

        </div>

      </main >


    </div >


  )







}
