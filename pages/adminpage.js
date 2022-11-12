import Head from "next/head";
import s from '../styles/adminpage.module.css';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import Router from "next/router";


export default function Admin() {
    const router = Router;
    const auth = getAuth();
    var entEmail = '';
    var entPassword = '';

    return (
        <div>
            <Head>
                <title>Admin Page</title>
            </Head>
            <main id={s.main}>
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
                <div id={s.topPanel}>
                    <div id={s.head}>
                        Admin Dashboard
                    </div>
                    <div id={s.signout} onClick={
                        () => {
                            signOut(auth).
                                then(() => {

                                    Cookies.remove('isLogged');
                                    router.push('/');

                                })
                        }

                    }>
                        Sign Out
                    </div>
                </div>
                <section id={s.addUser} className={s.adminContent}>
                    <div className={s.secHead}>
                        Add a user
                    </div>
                    <div id={s.addBack}>
                        <div id={s.add}>
                            <div className={s.addELE}>
                                <div className={s.inpHead}>
                                    Email
                                </div>
                                <input type="email" placeholder="Enter user email" className={s.input} id="addEmail" onChange={() => {
                                    entEmail = document.getElementById('addEmail').value;
                                }} />
                            </div>
                            <div className={s.addELE}>
                                <div className={s.inpHead}>
                                    Password
                                </div>
                                <input type="text" placeholder="Enter user password" className={s.input} id="addPassword" onChange={() => {
                                    entPassword = document.getElementById('addPassword').value;
                                }} />
                            </div>
                        </div>
                        <div className={s.submitButton} onClick={
                            () => {
                                createUserWithEmailAndPassword(auth, entEmail, entPassword).then(() => {
                                    console.log(auth.currentUser.email);
                                    toast.success('Sucessfully added new user', {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                    });
                                });
                                document.getElementById('addEmail').value = '';
                                document.getElementById('addPassword').value = '';
                            }
                        }>Submit</div>
                    </div>

                </section>
            </main>
        </div>
    )
}