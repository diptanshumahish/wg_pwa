import { getAuth, updateProfile } from "firebase/auth";
import Cookies from 'js-cookie';
import Head from "next/head";
import s from "../styles/workpage.module.css"
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import moment from "moment/moment";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



export default function Work() {
    const mom1 = moment().format('D MMMM h:mma');
    const emailFinal = Cookies.get('email');
    const [log, changeLog] = useState(false);
    const [display, modalDisplay] = useState('none');
    const [name, changeName] = useState('');
    const db = getFirestore();
    const auth = getAuth();
    const router = Router;
    const [isBreak, changeIsBreak] = useState(true);
    upLogin();

    getCurrentDuration().then((value) => {
        count = value;
    })
    useEffect(() => {

        Cookies.get('isLogged') == 'logged'
            ? changeLog(true)
            : changeLog(false);


        return () => {
            clearInterval(int);
            clearInterval(up);
            // alert("You have not updated your time");
        }
    }, [])
    const mom = moment().format('D/MMMM/YYYY');



    var count = 0;

    async function update() {
        setDoc(doc(db, "dailyWork", emailFinal), {
            [`${mom}`]: count
        }, { merge: true, mergeFields: true });
    }
    //set login time
    async function upLogin() {
        setDoc(doc(db, "logData", emailFinal), {
            [`${mom1}`]: "login"
        }, { merge: true, mergeFields: true });
    }
    //set logout time
    async function upLogout() {
        setDoc(doc(db, "logData", emailFinal), {
            [`${mom1}`]: "logout"
        }, { merge: true, mergeFields: true });
    }
    //start break
    async function upBreakstart() {
        setDoc(doc(db, "logData", emailFinal), {
            [`${mom1}`]: "break start"
        }, { merge: true, mergeFields: true });
    }
    //break end
    async function upBreakEnd() {
        setDoc(doc(db, "logData", emailFinal), {
            [`${mom1}`]: "break end"
        }, { merge: true, mergeFields: true });
    }
    async function getCurrentDuration() {

        const docRef = doc(db, 'dailyWork', emailFinal)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var data = docSnap.data();
            var map = Object.entries(data)

            var main = map.find((item) => {
                return item[0] === mom
            })
            if (main == undefined) {
                return 0
            } else {
                return main[1]
            }
        } else {
            return 0
        }
    }
    var int = setInterval(() => {
        count++;
    }, 60000)
    var up = setInterval(() => {
        update();
    }, 1800000)

    return (
        <div id={s.container}>
            <Head>
                <title>Work Page</title>
            </Head>
            <main id={s.back}>
                {!log ?
                    <div id='mainContentCenter'>
                        <div id='innerError'>
                            You can&apos;t Access the Dashboard without Logging in 😕, <br />
                            <Link href='/'>
                                <span>Consider Logging in</span>
                            </Link>
                        </div>
                    </div>
                    : <><div id={s.top}>
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
                        <div id={s.topquote}>
                            <div id={s.modalBack} style={{ display: display }} >
                                <div id={s.modal} >
                                    <div id={s.cross} onClick={() => {
                                        modalDisplay('none');
                                    }}> ×</div>
                                    <div id={s.modalHeader}>
                                        Update Your Full Name
                                    </div>
                                    <div id={s.NameInputArea}>
                                        <input type="text" id="updateName" placeholder='update your full name' onChange={() => {
                                            changeName(document.getElementById('updateName').value);
                                        }} />
                                        <button type="submit" id={s.ButUpdate} onClick={() => {
                                            if (name == '') {
                                                toast.warn('No Name entered', {
                                                    position: "top-right",
                                                    autoClose: 5000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: "light",
                                                });
                                            } else {
                                                updateProfile(auth.currentUser, {
                                                    displayName: name
                                                }).then(() => {
                                                    toast.success('Sucessfuly updated name', {
                                                        position: "top-right",
                                                        autoClose: 5000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: "light",
                                                    });
                                                    changeName('');
                                                    modalDisplay('none');
                                                })
                                            }
                                        }}>
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div id={s.cont}>
                                <div id={s.instructions}>
                                    <span>Some Instructions: <br />
                                        1. Your work time is being observed using this web app.<br />
                                        2. Make sure if you take a break, please click on the take a break option, otherwise the work time would not be calculated when the device goes idle or locked out.<br />
                                        3. Donot worry if you you get logged out, logging in will continue your session from wherever you left.<br />
                                        4. You can minimize this window and continue with your work.<br />
                                        5. While submitting any of the information thruogh the forms , if after clicking submit button you have network issues , please contact to admin before resubmitting
                                    </span>
                                </div>
                                <div id={s.break} onClick={
                                    isBreak ? async () => {
                                        upBreakstart();
                                        changeIsBreak(false);
                                        await update();
                                        clearInterval(int);
                                        clearInterval(up);
                                    } : async () => {
                                        changeIsBreak(true);
                                        upBreakEnd();
                                        const tr = setInterval(() => {
                                            clearInterval(int);
                                            clearInterval(up);
                                        }, 1800000);
                                        clearInterval(tr);

                                    }
                                }>
                                    {
                                        isBreak ? 'Take a Break' : 'Continue work'
                                    }
                                </div>
                            </div>
                            <span id={s.mot}>Keep up the good Work!😊</span> <br />

                        </div>
                    </div><div id={s.mainItems}>
                            <div id={s.links}>
                                <Link href='/forms/candidates' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link} >
                                        Candidates
                                    </div></Link>
                                <Link href='/forms/submissions' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link}>
                                        Submissions
                                    </div></Link>
                                <Link href='/forms/interview' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link}>
                                        Interviews
                                    </div></Link>
                                <Link href='/forms/clients' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link}>
                                        Clients
                                    </div></Link>
                                <Link href='/forms/feedback' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link}>
                                        Feedback
                                    </div></Link>
                                <Link href='/forms/leave' onClick={() => {
                                    update();
                                }}>
                                    <div className={s.link}>
                                        Apply Leave
                                    </div></Link>
                                <Link href='/'>
                                    <div className={s.link} id={s.logout} onClick={() => {
                                        upLogout();
                                        update().then(() => {
                                            router.push('/dashboard');
                                        });

                                    }}>
                                        Logout <br />
                                    </div></Link>
                                <div className={s.link} id={s.name} onClick={() => {
                                    modalDisplay('flex');
                                }}>
                                    Update Name
                                </div>
                            </div>
                            <div id={s.image}>
                                <Image src='/assets/fill.gif' width={500} height={500} alt='work' id={s.LOG} />
                            </div>
                        </div></>
                }
            </main>

        </div>

    )
}