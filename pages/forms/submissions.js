import { getAuth } from "firebase/auth"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import Router from "next/router";
import { useState } from "react";

export default function Submissions() {
    const auth = getAuth();
    const db = getFirestore();
    const router = Router;
    const [clicked, changeClick] = useState('1')
    //variables that will store the data to be inputted
    var name = '';
    var email = '';
    var mob = '';
    var org = '';
    var rec = '';
    var date = ''
    var feed = '';
    var endClient = '';
    var candidate = '';
    var rate = '';

    var mom = moment().format('Do MMMM  YYYY,h:mm:ss a ')
    async function update() {
        setDoc(doc(db, "submissions", `${auth.currentUser.email} + ${mom}`), {
            Date: date,
            Name: name,
            Rate: rate,
            Email: email,
            Organization: org,
            'Mobile Number': mob,
            Candidate: candidate,
            'End Client': endClient,
            Recruiter: rec,
            Feedback: feed
        }, { merge: true, mergeFields: true }).then(() => {
            router.push('/workpage')
        })
    }
    return (
        <div >
            <Head>
                <title>Submissions @WG</title>
            </Head>
            <div>
                <Link href='/workpage'>
                    <div id="genback">
                        ← Submissions Form
                    </div>
                </Link>
                <div id="mainFormArea">
                    <div id="form">
                        <div className="formEle">
                            Name
                        </div>
                        <input type="text" id="candName" className="formInp" placeholder="Enter name" onChange={() => {
                            name = document.getElementById("candName").value;
                        }} />


                        <div className="formEle">
                            Rate
                        </div>
                        <input type="text" id="candRate" className="formInp" placeholder="Enter rate" onChange={() => {
                            rate = document.getElementById("candRate").value;
                        }} />


                        <div className="formEle">
                            Date
                        </div>
                        <input type="text" id="candDate" className="formInp" placeholder="Enter Date" onChange={() => {
                            date = document.getElementById("candDate").value;
                        }} />

                        <div className="formEle">
                            Candidate
                        </div>
                        <input type="text" id="candCand" className="formInp" placeholder="Enter candidate" onChange={() => {
                            candidate = document.getElementById("candCand").value;
                        }} />




                        <div className="formEle">
                            Email
                        </div>
                        <input type="text" id="candEmail" className="formInp" placeholder="Enter email" onChange={() => {
                            email = document.getElementById("candEmail").value;
                        }} />


                        <div className="formEle">
                            Mobile Number
                        </div>
                        <input type="text" id="candMob" className="formInp" placeholder="Enter mobile number" onChange={() => {
                            mob = document.getElementById("candMob").value;
                        }} />



                        <div className="formEle">
                            Organization
                        </div>
                        <input type="text" id="candOrg" className="formInp" placeholder="Enter organization" onChange={() => {
                            org = document.getElementById("candOrg").value;
                        }} />


                        <div className="formEle">
                            Recruiter
                        </div>
                        <input type="text" id="candRec" className="formInp" placeholder="Enter Recruiter" onChange={() => {
                            rec = document.getElementById("candRec").value;
                        }} />

                        <div className="formEle">
                            End Client
                        </div>
                        <input type="text" id="candEnd" className="formInp" placeholder="Enter End Client" onChange={() => {
                            endClient = document.getElementById("candEnd").value;
                        }} />


                        <div className="formEle">
                            Feedback
                        </div>
                        <textarea id="candCom" className="formInp" placeholder="Feedback here" onChange={() => {
                            feed = document.getElementById("candCom").value;
                        }} />


                        <button className="formBut" onClick={() => {
                            changeClick('0.6');
                            update();


                        }} style={{ opacity: clicked }}>Submit</button>
                        <div id="helpp">(After succcesful form submission you wil be redirected back to the Work Page)</div>
                    </div>
                    <div id="formImage">
                        <Image src='/assets/submit.svg' width={500} height={500} alt='submissions' />
                    </div>
                </div>
            </div>
        </div>
    )
}