import Head from 'next/head';
import { getAuth, updateProfile } from "firebase/auth";
import s from '../styles/updatedet.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UpdateUser() {
    const [done, changeDone] = useState('1')
    const [photo, setPhoto] = useState(null);
    const defaultImage = '/assets/def.png';
    const [updatedImage, UpdateImg] = useState(false);
    const [pic, changeUrl] = useState(defaultImage);
    //for checking wehther updated a profile pic or not
    const [pp, changePp] = useState(false);
    const auth = getAuth();
    const storage = getStorage();
    var fullName = '';
    var phoneNum = '';

    async function upload(file, currentUser) {
        const fileRef = ref(storage, 'profilePics/' + auth.currentUser.uid + '.png');
        const snpashot = await uploadBytes(fileRef, file);

    }
    useEffect(() => {
        if (auth.currentUser.photoURL != null) {
            changeUrl(auth.currentUser.photoURL);
        }
    }, [auth.currentUser])

    //upload all
    async function changeImage(e) {
        setPhoto(e.target.files[0]);
        changePp(true);
    }
    async function updateDetails(fName, phone) {
        var pic = '';

        if (pp == true) {
            await upload(photo, auth.currentUser);
            const image = ref(storage, 'profilePics/' + auth.currentUser.uid + '.png');
            await getDownloadURL(image).then(function (url) {
                pic = url;
                changeUrl(url);
                updateProfile(auth.currentUser, {
                    photoURL: url, displayName: fName, phoneNumber: phone
                })
            });
        }
        UpdateImg(true);
        toast.success('Successfully updated the profie pic and other profile data', {
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
    return (
        <div id={s.container}>
            <Head>
                <title>Update Details</title>
            </Head>
            <main>
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
                <h2>Please Update your profile details</h2>
                <div id={s.miniform}>
                    <div id={s.profile} style={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover' }}>
                        <div id={s.hover}>
                            <div id={s.help}> Upload Image</div>
                            <input type="file" id={s.profilePic} onChange={changeImage} />
                        </div>
                    </div>
                    <div className={s.head}>
                        Your Full Name
                    </div>
                    <input type="text" className={s.inp} id="fname" required placeholder='Enter your full name' onChange={() => {
                        fullName = document.getElementById("fname").value;
                    }} />
                    <div className={s.head}>
                        Your phone number
                    </div>
                    <input type="tel" className={s.inp} id="phone" required placeholder='Your phone number' onChange={() => {
                        phoneNum = document.getElementById("phone").value;
                    }} />
                    <div id={s.submit} onClick={() => {

                        updateDetails(fullName, phoneNum).then(() => {
                            changeDone('0.5')
                        })
                    }} style={{ opacity: done }}>Update</div>

                    {
                        updatedImage ? <div id={s.continue}>
                            <Link href='/dashboard'> Continue
                            </Link></div> : <div></div>
                    }
                    <div id={s.info}>(Click on update and wait till the button becomes inactive <br /> to see a preview of the uploaded Profile Pic  and Update details, <br />  then click on continue, <b> Check your mail for a password reset link</b>)</div>
                </div>
            </main>
        </div>
    )
}