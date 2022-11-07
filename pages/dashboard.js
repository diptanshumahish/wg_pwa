import Cookies from 'js-cookie';
import s from '../styles/dashboard.module.css';
import Head from "next/head";

export default function Dashboard() {

    var isLogged = Cookies.get('isLogged');

    return (
        <div id={s.container}>
            <Head>
                <title> Dashboard</title>
            </Head>

            <main>
                {
                    isLogged != 'logged' ?
                        <div id={s.mainContent}>
                            You can&apos;t Access the Dashboard without Logging in
                        </div>

                        :
                        <div id={s.mainContent}>
                            content
                        </div>

                }

            </main>

        </div>
    )
}