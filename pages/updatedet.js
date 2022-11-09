import Head from 'next/head';
import { getAuth } from "firebase/auth";
import s from '../styles/updatedet.module.css';
import { getStorage, ref, uploadBytes, updateProfile, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function UpdateUser() {
    const [photo, setPhoto] = useState(null);
    const defaultImage = '/assets/def.png';
    const [pic, changeUrl] = useState(defaultImage);
    const [load, setLoading] = useState(false);
    const auth = getAuth();
    const storage = getStorage();


    async function upload(file, currentUser, setLoading) {
        const fileRef = ref(storage, 'profilePics/' + auth.currentUser.uid + '.png');
        const snpashot = await uploadBytes(fileRef, file);
        setLoading(false);
        // const photo = await getDownloadURL(snpashot);

    }


    useEffect(() => {
        if (auth.currentUser.photoURL != null) {
            changeUrl(auth.currentUser.photoURL);
        }
    }, [auth.currentUser])



    //upload image
    function changeImage(e) {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0])
        }
    }
    async function updateDetails() {
        await upload(photo, auth.currentUser, setLoading);
        console.log("photo done");
        const image = ref(storage, 'profilePics/' + auth.currentUser.uid + '.png');
        var newUrl = '';
        await getDownloadURL(image).then(function (url) {
            newUrl = url;
            console.log(newUrl);
        })
        changeUrl(newUrl);
        console.log(newUrl);
        // updateProfile(auth.currentUser, { photoURL: image });
        console.log(auth.currentUser.photoURL);
    }
    return (
        <div id={s.container}>
            <main>
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
                    <input type="text" value="" className={s.inp} required placeholder='Enter your full name' />
                    <div className={s.head}>
                        Your phone number
                    </div>
                    <input type="tel" className={s.inp} required placeholder='Your phone number' />
                    <div disbaled={load} id={s.submit} onClick={() => {
                        updateDetails();
                    }}>Update</div>
                </div>
            </main>
        </div>
    )
}