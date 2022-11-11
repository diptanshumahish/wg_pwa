import { getAuth } from "firebase/auth"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import Router from "next/router";

export default function Client() {
    const auth = getAuth();
    const db = getFirestore();
    const router = Router;
    //variables that will store the data to be inputted
    var name = '';
    var email = '';
    var mob = '';
    var org = '';
    var rec = '';
    var comments = '';

    var mom = moment().format('Do MMMM  YYYY,h:mm:ss a ')
    async function update() {
        setDoc(doc(db, "clients", `${auth.currentUser.email} + ${mom}`), {
            Name: name,
            Email: email,
            MobileNumber: mob,
            Organization: org,
            Recruiter: rec,
            Comments: comments
        }, { merge: true, mergeFields: true }).then(() => {
            router.push('/workpage')
        })
    }
    return (
        <div >
            <Head>
                <title>Clients @WG</title>
            </Head>
            <div>
                <Link href='/workpage'>
                    <div id="genback">
                        ← Clients Form
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
                            Comments
                        </div>
                        <textarea id="candCom" className="formInp" placeholder="Comments here" onChange={() => {
                            comments = document.getElementById("candCom").value;
                        }} />
                        <button className="formBut" onClick={() => {
                            update();


                        }} >Submit</button>
                        <div id="helpp">(After succcesful form submission you wil be redirected back to the Work Page)</div>
                    </div>
                    <div id="formImage">
                        <Image src='/assets/client1.svg' width={500} height={500} />
                    </div>
                </div>
            </div>
        </div>
    )
}