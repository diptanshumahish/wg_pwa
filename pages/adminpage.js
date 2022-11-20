import Head from "next/head";
import s from '../styles/adminpage.module.css';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import Router from "next/router";
import { doc, collection, getDocs, getFirestore, getDoc, query, orderBy, where, onSnapshot, Timestamp } from "firebase/firestore";
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
import { use, useState } from "react";
import DataTable from "react-data-table-component";
import React from 'react'


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
    var genProdData = []

    //general title for data table
    const [title, setTitle] = useState('');

    const [lab, setLab] = useState([]);
    const [dat, setDat] = useState([]);
    const [showBasic, setBasic] = useState('none')
    //particular
    const [partLab, setPartLabl] = useState([]);
    const [partDat, setPartDat] = useState([]);
    const [partShown, setPartShown] = useState('none');
    const [searchEmail, setEmail] = useState('');
    //producityScore
    const [prodLab, setProdLab] = useState([]);
    const [proddata, setProdDat] = useState([]);
    const [showProd, setProd] = useState('none');
    //Particular Employee Productivity
    const [partProdLab, setPartProdLab] = useState([]);
    const [partProdData, setPartProdData] = useState([]);
    const [showPartProd, setPartProd] = useState('none');
    const [searchPart, setPartEmail] = useState('');
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
    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                position: 'bottom',
                text: 'Productivity Graph',
            },

        },
    }
    const data2 = {
        labels: prodLab,

        datasets: [
            {
                label: 'Employee Productivity Score',
                data: proddata,
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
            name: 'Submitted By',
            selector: row => row.submittedBy,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
                minHeight: '100px',


            },


        },
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
        {
            name: 'Submission date',
            selector: row => row.SubmissionDate.toDate().toDateString()


        },
        {
            name: 'Submission Time',
            selector: row => `${row.SubmissionDate.toDate().getHours()}:${row.SubmissionDate.toDate().getMinutes()} hrs`

        },


    ]
    //interview Column
    var interviewCol = [
        {
            name: 'Submitted by',
            selector: row => row.SubmittedBy,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },

        },
        {
            name: 'Date',
            selector: row => row.Date,

        },
        {
            name: 'Candidate Name',
            selector: row => row.CandidateName,

        },
        {
            name: 'Technology',
            selector: row => row.Technology,

        },


        {
            name: 'Timing',
            selector: row => row.Timing,

        },
        {
            name: 'Round',
            selector: row => row.Round,

        },
        {
            name: 'CallDuration',
            selector: row => row.CallDuration,

        },
        {
            name: 'Feedback',
            selector: row => row.Feedback,

        },
        {
            name: 'Support',
            selector: row => row.Support,

        },
        {
            name: 'Submission date',
            selector: row => row.SubmissionDate.toDate().toDateString()


        },
        {
            name: 'Submission Time',
            selector: row => `${row.SubmissionDate.toDate().getHours()}:${row.SubmissionDate.toDate().getMinutes()} hrs`

        },


    ]
    //submissions columns
    var submissionsCol = [
        {
            name: 'Submitted by',
            selector: row => row.submittedBy,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },

        },
        {
            name: 'Name',
            selector: row => row.Name,

        },
        {
            name: 'Rate',
            selector: row => row.Rate,

        },
        {
            name: 'Date',
            selector: row => row.Date,

        },
        {
            name: 'E mail',
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
            name: 'Candidate',
            selector: row => row.Candidate,

        },
        {
            name: 'End Client',
            selector: row => row.EndClient,

        },
        {
            name: 'Feedback',
            selector: row => row.Feedback,

        },
        {
            name: 'Submission date',
            selector: row => row.SubmissionDate.toDate().toDateString()


        },
        {
            name: 'Submission Time',
            selector: row => `${row.SubmissionDate.toDate().getHours()}:${row.SubmissionDate.toDate().getMinutes()} hrs`

        },

    ]
    //candidates coulmn
    var candidatesColumn = [
        {
            name: 'Submitted by',
            selector: row => row.submittedBy,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },

        },
        {
            name: 'Date',
            selector: row => row.Date,

        },
        {
            name: 'Name',
            selector: row => row.Name,

        },
        {
            name: 'Technology',
            selector: row => row.Technology,

        },
        {
            name: 'Visa',
            selector: row => row.Visa,

        },
        {
            name: 'Experience',
            selector: row => row.Experience,

        },
        {
            name: 'w2',
            selector: row => row.W2,

        },
        {
            name: 'Location',
            selector: row => row.Loc,

        },
        {
            name: '1/2 Job',
            selector: row => row.oneTwoJob,

        },
        {
            name: 'Onsite',
            selector: row => row.Onsite,

        },
        {
            name: 'Rate',
            selector: row => row.Rate,

        },
        {
            name: 'Email',
            selector: row => row.Email,

        },
        {
            name: 'Mob Number',
            selector: row => row.MobileNumber,

        },
        {
            name: 'SSN',
            selector: row => row.SSN,

        },
        {
            name: 'LinkedIn',
            selector: row => row.LinkedIn,

        },
        {
            name: 'Payment Mode',
            selector: row => row.PaymentMode,

        },
        {
            name: 'US Entry year',
            selector: row => row.Us,

        },
        {
            name: 'Availability',
            selector: row => row.Availability,

        },
        {
            name: 'Support',
            selector: row => row.Support,

        },
        {
            name: 'Comments',
            selector: row => row.Comments,

        },
        {
            name: 'Submission date',
            selector: row => row.SubmissionDate.toDate().toDateString()


        },
        {
            name: 'Submission Time',
            selector: row => `${row.SubmissionDate.toDate().getHours()}:${row.SubmissionDate.toDate().getMinutes()} hrs`

        },
    ];
    //Feedback
    var FeedBackColumn = [
        {
            name: 'Submitted by',
            selector: row => row.submittedBy,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },


        },
        {
            name: 'Name',
            selector: row => row.Name,


        },
        {
            name: 'Feedback',
            selector: row => row.Feedback,

        },
        {
            name: 'Submission date',
            selector: row => row.SubmissionDate.toDate().toDateString()


        },
        {
            name: 'Submission Time',
            selector: row => `${row.SubmissionDate.toDate().getHours()}:${row.SubmissionDate.toDate().getMinutes()} hrs`

        },

    ]

    async function getClients() {
        var temp = [];
        const colRef = collection(db, "clients");
        const q = query(colRef, orderBy("SubmissionDate", "desc"));
        onSnapshot(q, async (snapshot) => {
            await snapshot.docs.forEach((doc) => {
                temp.push(doc.data());
            })
            await temp.forEach(function (element, index) {
                element['id'] = index + 1
            });
            setDataT(temp);
        })
        setColumns(clientsCol);

    }
    async function getSubmissions() {
        var temp = [];
        const colRef = collection(db, "submissions");
        const q = query(colRef, orderBy("SubmissionDate", "desc"));
        onSnapshot(q, async (snapshot) => {
            await snapshot.docs.forEach((doc) => {
                temp.push(doc.data());
            })
            await temp.forEach(function (element, index) {
                element['id'] = index + 1
            });
            setDataT(temp);
        })
        setColumns(submissionsCol);
    }
    async function getCandidatess() {
        var temp = [];
        const colRef = collection(db, "candidates");
        const q = query(colRef, orderBy("SubmissionDate", "desc"));
        onSnapshot(q, async (snapshot) => {
            await snapshot.docs.forEach((doc) => {
                temp.push(doc.data());
            })
            await temp.forEach(function (element, index) {
                element['id'] = index + 1
            });
            setDataT(temp);
        })
        setColumns(candidatesColumn);

    }
    async function getInterviews() {
        var temp = [];
        const colRef = collection(db, "interviews");
        const q = query(colRef, orderBy("SubmissionDate", "desc"));
        onSnapshot(q, async (snapshot) => {
            await snapshot.docs.forEach((doc) => {
                temp.push(doc.data());
            })
            await temp.forEach(function (element, index) {
                element['id'] = index + 1
            });
            setDataT(temp);
        })
        setColumns(interviewCol);

    }
    async function getFeedback() {
        var temp = [];
        const colRef = collection(db, "Feedback");
        const q = query(colRef, orderBy("SubmissionDate", "desc"));
        onSnapshot(q, async (snapshot) => {
            await snapshot.docs.forEach((doc) => {
                temp.push(doc.data());
            })
            await temp.forEach(function (element, index) {
                element['id'] = index + 1
            });
            setDataT(temp);
        })

        setColumns(FeedBackColumn);

    }
    //productivity
    async function getProdEmail() {
        var id = []
        const querySnapshot = await getDocs(collection(db, "productivityScore"));
        querySnapshot.forEach((doc) => {
            //get legends array
            id.push(doc.id);

        });
        setProdLab(id);
    }
    async function getProdData() {
        const querySnapshot = await getDocs(collection(db, "productivityScore"));
        querySnapshot.forEach((doc) => {

            var tempDoc = Object.entries(doc.data());
            var y = 0;
            for (let i = 0; i < tempDoc.length; i++) {
                y += tempDoc[i][1];
            }

            genProdData.push(y);
        });
        setProdDat(genProdData);
    }
    //part Prod 
    const [sortHours, setSortHours] = useState([]);
    const [month, setMonth] = useState('');
    async function tableScore() {

        const docRef = doc(db, 'productivityScore', searchPart)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var tempAr = [];
            var idCollection = [];
            var data = docSnap.data();
            var map = Object.entries(data);

            map.forEach((ele) => {
                var t = ele[0].toString();
                var hi = t.split('/');
                tempAr.push(hi[0]);
                idCollection.push(hi[1]);
            });
            var idCol2 = [];
            idCollection.filter((curr, index, ele) => {
                if (curr == month) {
                    idCol2.push(index);
                }
                if (idCol2 == []) {
                    toast.error('No data for the month', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                };
            });
            var finalAr = [];
            idCol2.forEach((ele) => {
                finalAr.push(map[ele]);
            });
            var fin = [];
            var dat = [];
            finalAr.forEach((ele) => {

                var t = ele[0].split('/');
                fin.push(Number(t[0]));
                dat.push(ele[1]);

            })
            var newFin = [];
            newFin = fin.map((item) => { return { date: item } });
            newFin.forEach((ele, index) => {
                ele['id'] = index + 1
                ele['value'] = dat[index];
            });
            setSortHours(newFin);
        }
    }
    var prodScoreColumn = [
        {
            name: 'date',
            selector: row => row.date,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
            sortable: true
        },
        {
            name: 'Score',
            selector: row => row.value,
        }
    ];
    const [sortHours1, setSortHours1] = useState([]);
    const [month1, setMonth1] = useState('');
    var prodScoreColumn1 = [
        {
            name: 'date',
            selector: row => row.date,
            style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
            },
            sortable: true
        },
        {
            name: 'Score',
            selector: row => row.value,
        }
    ];
    async function tableScore1() {

        const docRef = doc(db, 'dailyWork', searchEmail)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var tempAr = [];
            var idCollection = [];
            var data = docSnap.data();
            var map = Object.entries(data);

            map.forEach((ele) => {
                var t = ele[0].toString();
                var hi = t.split('/');
                tempAr.push(hi[0]);
                idCollection.push(hi[1]);
            });
            var idCol2 = [];
            idCollection.filter((curr, index, ele) => {
                if (curr == month1) {
                    idCol2.push(index);
                }
                if (idCol2 == []) {
                    toast.error('No data for the month', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                };
            });
            var finalAr = [];
            idCol2.forEach((ele) => {
                finalAr.push(map[ele]);
            });
            var fin = [];
            var dat = [];
            finalAr.forEach((ele) => {

                var t = ele[0].split('/');
                fin.push(Number(t[0]));
                dat.push(ele[1]);

            })
            var newFin = [];
            newFin = fin.map((item) => { return { date: item } });
            newFin.forEach((ele, index) => {
                ele['id'] = index + 1
                ele['value'] = dat[index];
            });
            setSortHours1(newFin);
        }
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
                        Employees&apos; whole production hours
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
                        Particular employee daily hours data
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
                                <div className={s.inpHead}>
                                    Select Month
                                </div>
                                <select id="month1" class={s.select} onChange={() => {
                                    setMonth1(document.getElementById("month1").value);
                                }} required>
                                    <option value="January" className={s.option}>January</option>
                                    <option value="February" className={s.option} >February</option>
                                    <option value="March" className={s.option}>March</option>
                                    <option value="April" className={s.option}>April</option>
                                    <option value="May" className={s.option}>May</option>
                                    <option value="June" className={s.option}>June</option>
                                    <option value="July" className={s.option}>July</option>
                                    <option value="August" className={s.option}>August</option>
                                    <option value="September" className={s.option}>September</option>
                                    <option value="October" className={s.option}>October</option>
                                    <option value="November" className={s.option}>November</option>
                                    <option value="December" className={s.option}>December</option>
                                </select >
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
                                        if (month1 != '') {
                                            tableScore1();
                                        } else {
                                            toast.error('No month entered', {
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

                                }>Search</div>
                            </div>
                        </div>
                    </div>
                    <DataTable columns={prodScoreColumn1} title={month1}
                        data={sortHours1} pagination
                    />

                </section>
                <section className={s.adminContent}>
                    <div className={s.secHead}>
                        Form Data
                    </div>
                    <div id={s.catagories}>
                        <div className={s.catagory}
                            onClick={
                                () => {
                                    getSubmissions();
                                    setTitle('Submissions')
                                }
                            }>Submissions</div>

                        <div className={s.catagory} onClick={
                            () => {
                                getCandidatess();
                                setTitle('candidates')
                            }
                        }>Candidates</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getInterviews();
                                setTitle('Interviews');
                            }
                        }>Interviews</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getClients();
                                setTitle('Clients Data');
                            }
                        }>Clients</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getFeedback();
                                setTitle('Feedback')
                            }
                        }>Feedback</div>
                    </div>

                    <DataTable columns={columnsTables} title={title}
                        data={dataTables} pagination
                    />
                </section>
                <section className={s.adminContent}>
                    <div className={s.secHead}>
                        Productivity Score of all employees
                    </div>
                    <div onClick={async () => {
                        await getProdEmail();
                        await getProdData();
                        setProd('block');

                    }} className={s.submitButton} id={s.showbas}>Show Graph</div>
                    <Bar
                        options={options2} data={data2} style={{ display: showProd }}

                    />
                </section>
                <section className={s.adminContent}>
                    <div className={s.secHead}>
                        Productivity Score of Particular Employee
                    </div>
                    <div id={s.findEmp}>
                        <div id={s.findArea}>
                            <div className={s.findSpace}>
                                <div className={s.inpHead}>
                                    Email
                                </div>
                                <input type="email" placeholder="Enter user email" className={s.input} id="searchPartEmail" onChange={() => {
                                    setPartEmail(document.getElementById('searchPartEmail').value);
                                }} />
                            </div>
                            <div className={s.findSpace}>
                                <div className={s.inpHead}>
                                    Select Month
                                </div>
                                <select id="month" class={s.select} onChange={() => {
                                    setMonth(document.getElementById("month").value);
                                }} required>
                                    <option value="January">January</option>
                                    <option value="February" >February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select >
                            </div>
                            <div className={s.findSpace}>
                                <div className={s.submitButton} onClick={
                                    () => {
                                        if (searchPart == '') {
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
                                            document.getElementById('searchPartEmail').value = '';
                                        }
                                        else {
                                            if (month != '') {
                                                tableScore();
                                            } else {
                                                toast.error('No month entered', {
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
                                    }

                                }>Search</div>
                            </div>
                        </div>
                    </div>
                    <DataTable columns={prodScoreColumn} title={month}
                        data={sortHours} pagination
                    />
                </section>
            </main>
        </div>
    )
}