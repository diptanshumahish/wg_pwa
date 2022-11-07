import Head from "next/head";
import styles from "../styles/forgot.module.css"
import Image from "next/image";
import { useState, useEffect } from "react";
import { initFirebase } from '../src/config'
import Link from "next/link";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function Forgot() {
    const app = initFirebase();
    const auth = getAuth();
    const [right1, changeright1] = useState(-900);
    const [right2, changeright2] = useState(-900);
    return (
        <div className={styles.container}>
            <Head>
                <title>Work @ WGLLC</title>

            </Head>
            <main>
                <div id="LoginPage">
                    <div id="maincont">
                        <Image src='/pwatrans.png' width={300} height={300} />
                        <div id="head">Warriors Group LLC</div>
                        <div id="subt">Password Reset</div>
                        <div className="subs">
                            Enter your registered email
                        </div>
                        <input type="email" name="reg_email" id="em" className="inp" placeholder='Email'
                            onChange={() => {
                                em = document.getElementById("em").value;

                                changeright1(-900)


                            }} />
                        <Link href='/'>
                            <div id="back">Back to login</div>
                        </Link>
                        <div id="butt" onClick={
                            async function reset() {
                                if (em != '') {
                                    sendPasswordResetEmail(auth, em).then(() => {
                                        changeright1(0)
                                    })
                                } else {
                                    changeright2(0)
                                }
                            }
                        } >Reset Password</div>


                    </div>
                </div>


                <div id="reset" style={{ right: right1 }} >
                    Password reset link sent
                </div>
                <div id="noemail" style={{ right: right2 }} >
                    Please enter your registered email in the email field
                </div>


            </main>


        </div>

    )
}