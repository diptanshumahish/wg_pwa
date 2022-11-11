import { getAuth, signOut } from "firebase/auth";
import Cookies from 'js-cookie';
import Head from "next/head";
import s from "../styles/workpage.module.css"
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";

export default function Work() {
    const auth = getAuth();
    const router = Router;
    return (
        <div id={s.container}>
            <Head>
                <title>Work Page</title>

            </Head>
            <main>
                <div id={s.top}>
                    <div id={s.topquote}>

                        <div id={s.cont}>
                            <div id={s.instructions}>
                                <span >Some Instructions: <br />
                                    1. Your work time is being observed using this web app. <br />
                                    2. Make sure if you take a break , please click on the take a break option, otherwise the work time would not be calculated when the device goes idle or locked out. <br />
                                    3. Donot worry if you you get logged out , logging in will continue your session from wherever you left. <br />
                                    4. You can minimize this window and continue with your work.
                                    5. While submutting any of the information thruogh the forms , if after clicking submit button you have network issues , please contact to admin before resubmitting
                                </span>
                            </div>
                            <div id={s.break}>
                                Take a Break
                            </div>
                        </div>
                        <span id={s.mot}>Keep up the good Work!😊</span> <br />

                    </div>
                </div>
                <div id={s.mainItems}>
                    <div id={s.links}>
                        <Link href='/forms/candidates'>
                            <div className={s.link}>
                                Candidates
                            </div></Link>
                        <Link href='/forms/submissions'>
                            <div className={s.link}>
                                Submissions
                            </div></Link>
                        <Link href='/forms/interview'>
                            <div className={s.link}>
                                Interviews
                            </div></Link>
                        <Link href='/forms/clients'>
                            <div className={s.link}>
                                Clients
                            </div></Link>
                        <Link href='/forms/feedback'>
                            <div className={s.link}>
                                Feedback
                            </div></Link>
                        <Link href='/'>
                            <div className={s.link} id={s.logout} onClick={() => {
                                signOut(auth).
                                    then(() => {
                                        Cookies.remove('isLogged');
                                        router.push('/');

                                    })
                            }}>
                                Logout <br />

                            </div></Link>
                    </div>
                    <div id={s.image}  >
                        <Image src='/assets/working1.gif' width={500} height={500} alt='work' />
                    </div>
                </div>
            </main>
        </div>
    )
}