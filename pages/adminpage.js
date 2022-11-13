import Head from "next/head";
import s from '../styles/adminpage.module.css';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import Router from "next/router";
import { doc, collection, getDocs, getFirestore, getDoc } from "firebase/firestore";
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState } from "react";
import DataTable from "react-data-table-component";


export default function Admin() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const router = Router;
    const auth = getAuth();

    var entEmail = '';
    var entPassword = '';

    const db = getFirestore();
    var idArry = [];
    var totalDurArray = [];

    const [lab, setLab] = useState([]);
    const [dat, setDat] = useState([]);
    const [showBasic, setBasic] = useState('none')
    //particular
    const [partLab, setPartLabl] = useState([]);
    const [partDat, setPartDat] = useState([]);
    const [partShown, setPartShown] = useState('none');
    const [searchEmail, setEmail] = useState('');

    //labels for everyone
    async function getLabels() {
        const querySnapshot = await getDocs(collection(db, "dailyWork"));
        querySnapshot.forEach((doc) => {
            //get legends array
            idArry.push(doc.id);

        });
        setLab(idArry);
    }
    //labels for only particular employee
    async function getPartEmployee() {

        const docRef = doc(db, 'dailyWork', searchEmail)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var paridArray = [];
            var parDatArray = [];
            var data = docSnap.data();
            var map = Object.entries(data);
            for (let i = 0; i < map.length; i++) {
                paridArray.push(map[i][0]);
            }
            setPartLabl(paridArray);
            for (let i = 0; i < map.length; i++) {
                parDatArray.push(Math.round((map[i][1]) / 60 * 100) / 100);
            }
            setPartDat(parDatArray)
        } else {
            toast.error('Employee doesnot exist', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    //data for everyone
    async function getData() {
        const querySnapshot = await getDocs(collection(db, "dailyWork"));
        querySnapshot.forEach((doc) => {
            //get data for each person(email)
            var tempDoc = Object.entries(doc.data());
            var y = 0;
            for (let i = 0; i < tempDoc.length; i++) {
                y += Math.round((tempDoc[i][1]) / 60 * 100) / 100;
            }
            totalDurArray.push(y);
        });
        setDat(totalDurArray);
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                position: 'bottom',
                text: 'Comparitive report of employees total production',
            },

        },
    };

    const data = {
        labels: lab,

        datasets: [
            {
                label: 'Employee production hours',
                data: dat,
                backgroundColor: '#7d4aaa74',
                borderColor: '#7d4aaa',
                borderWidth: 1,

            }
        ]
    }
    const options1 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                position: 'bottom',
                text: `report for ${searchEmail}`,
            },

        },
    }
    const data1 = {
        labels: partLab,

        datasets: [
            {
                label: 'Employee production hours',
                data: partDat,
                backgroundColor: '#7d4aaa74',
                borderColor: '#7d4aaa',
                borderWidth: 1,

            }
        ]
    }

    //data table 
    const [columnsTables, setColumns] = useState([]);
    const [dataTables, setDataT] = useState([]);
    // clients column 
    var clientsCol = [
        {
            name: 'Name',
            selector: row => row.Name,

        },
        {
            name: 'Email',
            selector: row => row.Email,

        },
        {
            name: 'Organization',
            selector: row => row.Organization,

        },


        {
            name: 'Mobile Number',
            selector: row => row.MobileNumber,

        },
        {
            name: 'Recruiter',
            selector: row => row.Recruiter,

        },
        {
            name: 'Comments',
            selector: row => row.Comments,

        },


    ]
    //interview Column
    var interviewCol = [
        {
            name: 'Date',
            selector: row => row.Date,

        },
        {
            name: 'Email',
            selector: row => row.Email,

        },
        {
            name: 'Organization',
            selector: row => row.Organization,

        },


        {
            name: 'Mobile Number',
            selector: row => row.MobileNumber,

        },
        {
            name: 'Recruiter',
            selector: row => row.Recruiter,

        },
        {
            name: 'Comments',
            selector: row => row.Comments,

        },


    ]

    async function getClients() {
        var temp = [];
        const querySnapshot = await getDocs(collection(db, "clients"));
        querySnapshot.forEach((doc) => {


            temp.push(doc.data());


        });
        temp.forEach(function (element, index) {
            element['id'] = index + 1
        })
        temp = temp.reverse();
        setDataT(temp);
        setColumns(clientsCol);

    }



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
                <section id={s.common} className={s.adminContent}>
                    <div className={s.secHead}>
                        Employees&apos; comparitive reports
                    </div>
                    <div onClick={async () => {
                        await getData();
                        await getLabels();
                        setBasic('block');
                    }} className={s.submitButton} id={s.showbas}>Show Graph</div>

                    <Bar
                        options={options} data={data} style={{ display: showBasic }}

                    />


                </section>
                <section className={s.adminContent} id={s.partEle}>
                    <div className={s.secHead}>
                        Particular employee data
                    </div>
                    <div id={s.findEmp}>
                        <div id={s.findArea}>
                            <div className={s.findSpace}>
                                <div className={s.inpHead}>
                                    Email
                                </div>
                                <input type="email" placeholder="Enter user email" className={s.input} id="searchEmail" onChange={() => {
                                    setEmail(document.getElementById('searchEmail').value);
                                }} />
                            </div>
                            <div className={s.findSpace}>
                                <div className={s.submitButton} onClick={
                                    () => {
                                        if (searchEmail == '') {
                                            toast.error('No email entered', {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "light",
                                            });
                                            document.getElementById('searchEmail').value = '';
                                        }
                                        else {
                                            getPartEmployee().then(() => {
                                                setPartShown('block');
                                                document.getElementById('searchEmail').value = '';
                                            })
                                        }


                                    }

                                }>Search</div>
                            </div>
                        </div>
                    </div>
                    <Bar style={{ display: partShown }}
                        options={options1} data={data1}

                    />

                </section>
                <section className={s.adminContent}>
                    <div className={s.secHead}>
                        Form Data
                    </div>
                    <div id={s.catagories}>
                        <div className={s.catagory}>Submissions</div>
                        <div className={s.catagory}>Feedback</div>
                        <div className={s.catagory}>Candidates</div>
                        <div className={s.catagory}>Interviews</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getClients();
                            }
                        }>Clients</div>
                    </div>
                    <DataTable columns={columnsTables}
                        data={dataTables} />

                </section>
            </main>
        </div>
    )
}