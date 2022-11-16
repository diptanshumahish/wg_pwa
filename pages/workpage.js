import { getAuth,updateProfile } from "firebase/auth";
import Cookies from 'js-cookie';
import Head from "next/head";
import s from "../styles/workpage.module.css"
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import moment from "moment/moment";
import { Modal, Input, Button, Text } from "@nextui-org/react";




export default function Work() {

    const emailFinal = Cookies.get('email');
    const [log, changeLog] = useState(false);
    const [modalVisible, showModal] = useState(false);
    const [email, setEmail] = useState('')
    const db = getFirestore();
    const auth = getAuth();
    const router = Router;
    const [isBreak, changeIsBreak] = useState(true);

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
    const mom = moment().format('Do MMMM, YYYY');


    var count = 0;

    async function update() {
        setDoc(doc(db, "dailyWork", emailFinal), {
            [`${mom}`]: count
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

    function closeHandler() {
        showModal(false);
    }
    console.log(count);
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

                        <div id={s.topquote}>

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
                                        changeIsBreak(false);
                                        await update();
                                        clearInterval(int);
                                        clearInterval(up);
                                    } : async () => {
                                        changeIsBreak(true);
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
                                        update().then(() => {
                                            router.push('/dashboard');
                                        });

                                    }}>
                                        Logout <br />
                                    </div></Link>
                                <div className={s.link} id={s.name} onClick={() => {
                                    showModal(true)
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
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={modalVisible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Update your Full name

                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        id="updateName"
                        placeholder="Email"
                        onChange={() => {
                            setEmail(document.getElementById('updateName').value);
                        }}

                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                    <Button auto onClick={() => {
                        closeHandler();
                        updateProfile(auth.currentUser, {
                            displayName: email,
                        })

                    }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}