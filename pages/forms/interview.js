import { getAuth } from "firebase/auth"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import Router from "next/router";
import { useState } from "react";

export default function Interview() {
    const [clicked, changeClick] = useState('1')
    const auth = getAuth();
    const db = getFirestore();
    const router = Router;
    //variables that will store the data to be inputted
    var callDuration = '';
    var date = '';
    var feedback = '';
    var round = '';
    var support = '';
    var technology = '';
    var timing = '';
    var candidateName = '';


    var mom = moment().format('Do MMMM  YYYY,h:mm:ss a ')
    var submissiondate = Date.now();
    async function update() {
        setDoc(doc(db, "interviews", `${auth.currentUser.email} + ${mom}`), {
            CandidateName: candidateName,
            CallDuration: callDuration,
            Date: date,
            Round: round,
            Support: support,
            Technology: technology,
            Timing: timing,
            Feedback: feedback,
            SubmissionDate: submissiondate,
            SubmittedBy: auth.currentUser.email

        }, { merge: true, mergeFields: true }).then(() => {
            router.push('/workpage')
        })
    }
    return (
        <div >
            <Head>
                <title>Interviews @WG</title>
            </Head>
            <div>
                <Link href='/workpage'>
                    <div id="genback">
                        ← Interviews Form
                    </div>
                </Link>
                <div id="mainFormArea">
                    <div id="form">
                        <div className="formEle">
                            Candidate Name
                        </div>
                        <input type="text" id="candName" className="formInp" placeholder="Enter candidate name" onChange={() => {
                            candidateName = document.getElementById("candName").value;
                        }} />
                        <div className="formEle">
                            Call Duration
                        </div>
                        <input type="text" id="candCall" className="formInp" placeholder="Enter call duration e.g. 4hr 30mins " onChange={() => {
                            callDuration = document.getElementById("candCall").value;
                        }} />
                        <div className="formEle">
                            Date
                        </div>
                        <input type="text" id="candDate" className="formInp" placeholder="Enter date" onChange={() => {
                            date = document.getElementById("candDate").value;
                        }} />
                        <div className="formEle">
                            Round
                        </div>
                        <input type="text" id="candRound" className="formInp" placeholder="Enter round number" onChange={() => {
                            round = document.getElementById("candRound").value;
                        }} />
                        <div className="formEle">
                            Support
                        </div>
                        <input type="text" id="candTim" className="formInp" placeholder="Support" onChange={() => {
                            support = document.getElementById("candTim").value;
                        }} />
                        <div className="formEle">
                            Timing
                        </div>
                        <input type="text" id="candTim" className="formInp" placeholder="Enter timing for e.g. 3hrs " onChange={() => {
                            timing = document.getElementById("candTim").value;
                        }} />
                        <div className="formEle">
                            Feedback
                        </div>
                        <textarea id="candFeed" className="formInp" placeholder="Feedback" onChange={() => {
                            technology = document.getElementById("candFeed").value;
                        }} />
                        <button className="formBut" onClick={() => {
                            changeClick('0.6');
                            update();


                        }} style={{ opacity: clicked }}  >Submit</button>
                        <div id="helpp">(After succcesful form submission you wil be redirected back to the Work Page)</div>
                    </div>
                    <div id="formImage">
                        <Image src='/assets/interview.svg' width={500} height={500} alt='feedback' />
                    </div>
                </div>
            </div>
        </div>
    )
}