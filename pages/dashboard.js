import Cookies from 'js-cookie';
import s from '../styles/dashboard.module.css';
import Head from "next/head";
import { useEffect, useState } from 'react';


export default function Dashboard() {


    const [log, changeLog] = useState(false);
    useEffect(() => {
        Cookies.get('isLogged') == 'logged' ? changeLog(true) : changeLog(false)
    }, [])
    return (
        <div id={s.container}>
            <Head>
                <title> Dashboard</title>
            </Head>

            <main>
                {
                    !log ?
                        <div id={s.mainContent}>
                            You can&apos;t Access the Dashboard without Logging in
                        </div>

                        :
                        <div id={s.mainContent}>
                            content h
                        </div>

                }

            </main>

        </div>
    )
}