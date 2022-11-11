import Cookies from 'js-cookie';
import s from '../styles/dashboard.module.css';
import Head from "next/head";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import moment from 'moment';


export default function Dashboard() {
    var router = useRouter();
    const auth = getAuth();
    const [log, changeLog] = useState(false);
    const profile = auth.currentUser.photoURL;
    const personName = auth.currentUser.displayName;

    useEffect(() => {
        Cookies.get('isLogged') == 'logged'
            ? changeLog(true)
            : changeLog(false);


    }, [])
    return (
        <div id={s.container}>
            <Head>
                <title> Dashboard</title>
            </Head>

            <main>
                {
                    !log ?
                        <div id={s.mainContentCenter}>
                            <div id={s.innerError}>
                                You can&apos;t Access the Dashboard without Logging in 😕, <br />
                                <Link href='/'>
                                    <span>Consider Logging in</span>
                                </Link>
                            </div>
                        </div>

                        :
                        <div id={s.mainContent}>
                            <div id={s.top}>
                                <div id={s.logo} >Warriors Group LLC.</div>
                                <div id={s.profile} >
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger id={s.trigger}>
                                            <div id={s.profilePic} style={{ backgroundImage: `url(${profile})` }}
                                            ></div>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content id={s.triggerBack}>

                                            <DropdownMenu.Item className={s.triggerItem}><div onClick={() => {
                                                signOut(auth).
                                                    then(() => {
                                                        Cookies.remove('isLogged');
                                                        router.push('/');

                                                    })
                                            }} >Sign Out
                                            </div></DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </div>
                            </div>
                            <div id={s.out}>
                                <div id={s.box}>
                                    <div id={s.leftBox}>
                                        Welcome, <br />
                                        <span>{`${personName}`}</span>
                                        Have a nice day 😊
                                        <Link href='/workpage'>
                                            <div id={s.startWork}>
                                                Begin Work
                                            </div>
                                        </Link>
                                    </div>
                                    <div id={s.rightBox}>
                                        <Image src='/welcome.svg' width={300} height={300} alt='Welcome image'></Image>
                                    </div>
                                </div>
                            </div>
                            <div id={s.dateTime}>
                                {moment().format('Do MMMM  YYYY ')} <br />
                                <span>{moment().format('hh:mm a ')}</span>
                            </div>

                        </div>

                }

            </main>

        </div>
    )
}