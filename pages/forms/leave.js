import Head from "next/head";
import Link from "next/link";
import { getAuth } from 'firebase/auth'

export default function Leave() {
    const auth = getAuth();
    return (

        <div id="Leavecontainer">
            <Head>
                <title>Leave</title>
            </Head>
            <main>
                <div id="leaveHead">
                    <Link href='/workpage'>
                        ← Apply for a leave
                    </Link>
                </div>
                <div id="leaveMain">
                    <form action="https://formsubmit.co/Hr@warriorsgrp.com" method='POST' id="leaveForm">
                        <label htmlFor="Name">
                            <div className="leaveSub">
                                Enter your name
                            </div>
                            <input type="text" name='name' placeholder="Enter your name" className="inputLeave" required />
                        </label>
                        <label htmlFor="email">
                            <div className="leaveSub" >
                                Your Email, (Your approval / rejection mail will come here)
                            </div>
                            <input type="email" name='replyToemail' placeholder="Enter your email" className="inputLeave" required />
                        </label>
                        <label htmlFor="leaveStart">
                            <div className="leaveSub">
                                Leave start date
                            </div>
                            <input type="date" name='leaveStartDate' className="inputLeave" required />
                        </label>
                        <label htmlFor="leaveEnd">
                            <div className="leaveSub">
                                Leave end date
                            </div>
                            <input type="date" name='leaveEndDate' className="inputLeave" required />
                        </label>
                        <label htmlFor="leavereason">
                            <div className="leaveSub">
                                Reason for leave
                            </div>
                            <input type="text" name='leaveReason' placeholder="Enter reason for leave" className="inputLeave" required />
                        </label>
                        <input type="hidden" name="_next" value="https://wg-pwa.vercel.app/"></input>
                        <input type="hidden" name="_captcha" value="false"></input>
                        <input type="hidden" name="_template" value="table"></input>
                        <input type="hidden" name="_subject" value="Leave request at Warriors Gruop LLC"></input>
                        <button type="submit" id="leaveSubmit">Submit</button>
                        <span id="helpLeave">(You will be redirected to the home page after submission)</span>
                    </form>
                </div>
            </main>
        </div>
    )
}