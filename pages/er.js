import Head from "next/head";
import s from '../styles/er.module.css';

export default function NoSupport() {
    return (
        <div id={s.container}>
            <Head>
                <title>Not Suported</title>
            </Head>
            <main id={s.main}>
                <div id={s.center}>
                    This web app is meant to work only on Windows/Linux/MacOS
                </div>
            </main>

        </div>
    )
}