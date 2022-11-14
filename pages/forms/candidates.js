import { getAuth } from "firebase/auth"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { doc, setDoc, getFirestore, getDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import Router from "next/router";
import { useState } from "react";

export default function Candidates() {


    const [clicked, changeClick] = useState('1');

    var score = 0;

    const auth = getAuth();
    const db = getFirestore();
    const router = Router;
    getCurrentScore().then((value) => {
        score = value;
    });
    //variables that will store the data to be inputted
    var name = '';
    var tech = '';
    var visa = '';
    var exp = '';
    var w2 = '';
    var loc = '';
    var job = '';
    var onsite = '';
    var rate = '';
    var email = '';
    var mob = '';
    var ssn = '';
    var link = '';
    var pay = '';
    var comments = '';
    var edu = '';
    var us = '';
    var availability = '';
    var support = '';
    var mom = moment().format('Do MMMM  YYYY,h:mm:ss a ');
    var mom1 = moment().format('Do MMMM  YYYY');
    async function update() {
        updateScore();
        setDoc(doc(db, "candidates", `${auth.currentUser.email} + ${mom}`), {
            Name: name,
            Technology: tech,
            Visa: visa,
            Experience: exp,
            W2: w2,
            Loc: loc,
            oneTwoJob: job,
            Onsite: onsite,
            Rate: rate,
            Email: email,
            MobileNumber: mob,
            SSN: ssn,
            LinkedIn: link,
            PaymentMode: pay,
            Us: us,
            Availability: availability,
            Support: support,
            Comments: comments,
            SubmissionDate: Timestamp.now(),
            submittedBy: auth.currentUser.email
        }, { merge: true, mergeFields: true }).then(() => {
            router.push('/workpage')

        })
    }
    async function updateScore() {
        await getCurrentScore();

        setDoc(doc(db, "productivityScore", `${auth.currentUser.email}`), {
            [mom1]: score
        }, { merge: true, mergeFields: true })
    }

    async function getCurrentScore() {
        const docRef = doc(db, 'productivityScore', auth.currentUser.email)
        const docSnap = (await getDoc(docRef));
        if (docSnap.exists()) {
            var data = docSnap.data();
            var map = Object.entries(data)
            var main = map.find((item) => {
                return item[0] === mom1
            })

            if (main == undefined) {
                return 0
            } else {

                return (main[1] + 1)
            }
        } else {
            return 0
        }
    }


    return (
        <div >
            <Head>
                <title>Candidates@WG</title>
            </Head>
            <div>
                <Link href='/workpage'>
                    <div id="genback">
                        ← Candidates Form
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
                            Technology
                        </div>
                        <input type="text" id="candTech" className="formInp" placeholder="Technologies" onChange={() => {
                            tech = document.getElementById("candTech").value;
                        }} />
                        <div className="formEle">
                            Visa
                        </div>
                        <input type="text" id="candVisa" className="formInp" placeholder="Visa" onChange={() => {
                            visa = document.getElementById("candVisa").value;
                        }} />
                        <div className="formEle">
                            Experience
                        </div>
                        <input type="text" id="candExp" className="formInp" placeholder="Enter name" onChange={() => {
                            exp = document.getElementById("candExp").value;
                        }} />
                        <div className="formEle">
                            w2
                        </div>
                        <input type="text" id="candw2" className="formInp" placeholder="Type yes/no" onChange={() => {
                            w2 = document.getElementById("candw2").value;
                        }} />
                        <div className="formEle">
                            Location
                        </div>
                        <input type="text" id="candLoc" className="formInp" placeholder="Enter location" onChange={() => {
                            loc = document.getElementById("candLoc").value;
                        }} />
                        <div className="formEle">
                            1/2 Job
                        </div>
                        <input type="text" id="candOne" className="formInp" placeholder="1/2 jobs" onChange={() => {
                            job = document.getElementById("candOne").value;
                        }} />
                        <div className="formEle">
                            Onsite
                        </div>
                        <input type="text" id="candOns" className="formInp" placeholder="Onsite" onChange={() => {
                            onsite = document.getElementById("candOns").value;
                        }} />
                        <div className="formEle">
                            Rate
                        </div>
                        <input type="text" id="candRate" className="formInp" placeholder="Enter rate" onChange={() => {
                            rate = document.getElementById("candRate").value;
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
                            SSN
                        </div>
                        <input type="text" id="candSsn" className="formInp" placeholder="Enter SSN" onChange={() => {
                            ssn = document.getElementById("candSsn").value;
                        }} />
                        <div className="formEle">
                            Linkedin
                        </div>
                        <input type="text" id="candLink" className="formInp" placeholder="Enter LinkedIn Url" onChange={() => {
                            link = document.getElementById("candLink").value;
                        }} />
                        <div className="formEle">
                            Payment Mode
                        </div>
                        <input type="text" id="candPay" className="formInp" placeholder="Enter payment mode" onChange={() => {
                            pay = document.getElementById("candPay").value;
                        }} />
                        <div className="formEle">
                            Education
                        </div>
                        <input type="text" id="candEdu" className="formInp" placeholder="Enter Education" onChange={() => {
                            edu = document.getElementById("candEdu").value;
                        }} />
                        <div className="formEle">
                            US enter year
                        </div>
                        <input type="text" id="candUs" className="formInp" placeholder="Enter US enter year" onChange={() => {
                            us = document.getElementById("candUs").value;
                        }} />
                        <div className="formEle">
                            Availability
                        </div>
                        <input type="text" id="candAvail" className="formInp" placeholder="Enter availability " onChange={() => {
                            availability = document.getElementById("candAvail").value;
                        }} />
                        <div className="formEle">
                            Support
                        </div>
                        <input type="text" id="candSup" className="formInp" placeholder="Enter support yes/no" onChange={() => {
                            support = document.getElementById("candSup").value;
                        }} />
                        <div className="formEle">
                            Comments
                        </div>
                        <textarea id="candCom" className="formInp" placeholder="Comments here" onChange={() => {
                            comments = document.getElementById("candCom").value;
                        }} />
                        <button className="formBut" onClick={() => {
                            changeClick('0.6')
                            update();


                        }} style={{ opacity: clicked }}  >Submit</button>
                        <div id="helpp">(After succcesful form submission you wil be redirected back to the Work Page)</div>
                    </div>
                    <div id="formImage">
                        <Image src='/assets/candidate.svg' width={500} height={500} alt='candidate' />
                    </div>
                </div>
            </div>
        </div>
    )
}