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
    const options3 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                position: 'bottom',
                text: `productivity graph for ${searchPart}`,
            },

        },
    }
    const data3 = {
        labels: partProdLab,

        datasets: [
            {
                label: 'Productivity Score',
                data: partProdData,
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
        {
            name: 'Sorting',
            selector: row => row.SubmissionDate,

        },


    ]
    //interview Column
    var interviewCol = [
        {
            name: 'Submitted by',
            selector: row => row.SubmittedBy,

        },
        {
            name: 'Date',
            selector: row => row.Date,

        },
        {
            name: 'Candidate Name',
            selector: row => row.CandidateNme,

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
            name: 'Sorting',
            selector: row => row.SubmissionDate,

        },


    ]
    //submissions columns
    var submissionsCol = [
        {
            name: 'Submitted by',
            selector: row => row.SubmittedBy,

        },
        {
            name: 'Name',
            selector: row => row.Name,

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
            selector: row => row.candidate,

        },
        {
            name: 'Recruiter',
            selector: row => row.Recruiter,

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
            name: 'Sorting',
            selector: row => row.SubmissionDate,

        },


    ]
    //candidates coulmn
    var candidatesColumn = [
        {
            name: 'Submitted by',
            selector: row => row.SubmittedBy,

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
            selector: row => row.paymentMode,

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
            name: 'Sorting',
            selector: row => row.SubmissionDate,

        },


    ];
    //Feedback
    var FeedBackColumn = [
        {
            name: 'Submitted by',
            selector: row => row.SubmittedBy,

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
            name: 'Sorting',
            selector: row => row.SubmissionDate,

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
    async function getSubmissions() {
        var temp = [];
        const querySnapshot = await getDocs(collection(db, "submissions"));
        querySnapshot.forEach((doc) => {


            temp.push(doc.data());


        });
        temp.forEach(function (element, index) {
            element['id'] = index + 1
        })
        temp = temp.reverse();
        setDataT(temp);
        setColumns(submissionsCol);

    }
    async function getCandidatess() {
        var temp = [];
        const querySnapshot = await getDocs(collection(db, "candidates"));
        querySnapshot.forEach((doc) => {


            temp.push(doc.data());


        });
        temp.forEach(function (element, index) {
            element['id'] = index + 1
        })
        temp = temp.reverse();
        setDataT(temp);
        setColumns(candidatesColumn);

    }
    async function getInterviews() {
        var temp = [];
        const querySnapshot = await getDocs(collection(db, "interviews"));
        querySnapshot.forEach((doc) => {


            temp.push(doc.data());


        });
        temp.forEach(function (element, index) {
            element['id'] = index + 1
        })
        temp = temp.reverse();
        setDataT(temp);
        setColumns(interviewCol);

    }
    async function getFeedback() {
        var temp = [];
        const querySnapshot = await getDocs(collection(db, "Feedback"));
        querySnapshot.forEach((doc) => {


            temp.push(doc.data());


        });
        temp.forEach(function (element, index) {
            element['id'] = index + 1
        })
        temp = temp.reverse();
        setDataT(temp);
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
        const querySnapshot = await getDocs(collection(db, "dailyWork"));
        querySnapshot.forEach((doc) => {
            var dat = [];
            var tempDoc = Object.entries(doc.data());
            var y = 0;
            for (let i = 0; i < tempDoc.length; i++) {
                y += tempDoc[i][1];
            }
            dat.push(y);
        });
        setProdDat(dat);
    }
    //part Prod
    async function getPartProd() {

        const docRef = doc(db, 'productivityScore', searchPart)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var paridArray = [];
            var parDatArray = [];
            var data = docSnap.data();
            var map = Object.entries(data);
            for (let i = 0; i < map.length; i++) {
                paridArray.push(map[i][0]);
            }
            setPartProdLab(paridArray);
            for (let i = 0; i < map.length; i++) {
                parDatArray.push(map[i][1]);
            }
            setPartProdData(parDatArray)
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
                        <div className={s.catagory}
                            onClick={
                                () => {
                                    getSubmissions();
                                }
                            }>Submissions</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getFeedback();
                            }
                        }>Feedback</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getCandidatess();
                            }
                        }>Candidates</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getInterviews();
                            }
                        }>Interviews</div>
                        <div className={s.catagory} onClick={
                            () => {
                                getClients();
                            }
                        }>Clients</div>
                    </div>
                    <DataTable columns={columnsTables}
                        data={dataTables} />

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
                                            getPartProd().then(() => {
                                                setPartProd('block');
                                                document.getElementById('searchPartEmail').value = '';
                                            })
                                        }


                                    }

                                }>Search</div>
                            </div>
                        </div>
                    </div>
                    <Bar
                        options={options3} data={data3} style={{ display: showPartProd }}

                    />
                </section>
            </main>
        </div>
    )
}