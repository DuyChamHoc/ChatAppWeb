import React, { useState } from 'react'
import { Row, Col, Button, Typography } from 'antd'
import { app, db } from '../../firebase';
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { addDocument, generateKeywords } from '../../service';
import { useNavigate } from 'react-router-dom'
export default function Login() {
    const navigate = useNavigate();
    const provider1 = new GoogleAuthProvider();
    const auth = getAuth(app);
    const provider = new FacebookAuthProvider();
    const { Title } = Typography
    const [getEmail, setEmail] = useState('')
    const [getPass, setPass] = useState('')
    let a = 0;
    const LoginEmail = async () => {
        signInWithEmailAndPassword(auth, getEmail, getPass)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    const LoginFB = async () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                checkadd(user)
            })
            .catch(
                (error) => {
                    console.log(error)
                }
            );
    }
    const LoginGG = async () => {
        signInWithPopup(auth, provider1)
            .then((result) => {
                const user = result.user;
                checkadd(user)
            }).catch((error) => {
                console.log(error)
            });
    }
    const checkadd = async (user) => {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            if (doc.data().uid === user.uid) {
                a = 1;
            }
        });
        if (a === 0) {
            try {
                addDocument('users', {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: user.providerData[0].providerId,
                    keywords: generateKeywords(user.displayName)
                })
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    }
    return (
        <div style={{ justifyContent: 'center', alignItems: 'center', backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg")` }}>
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8} style={{ marginLeft:200 }}>
                    <Title style={{ marginBottom:40,marginRight:140,marginTop:150, textAlign: 'center', color: '#6BC8FF', fontWeight: 'bold' }} level={3}>
                        Đăng nhập
                    </Title>
                    <input
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        placeholder='Tài khoản'
                        style={{paddingLeft:20,height: 35, width: 310, marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} />
                    <input
                        onChange={(event) => {
                            setPass(event.target.value);
                        }}
                        placeholder='Mật khẩu'
                        style={{paddingLeft:20 ,height: 35, width: 310, marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} />
                    <Button style={{ marginTop:15,height: 35, fontWeight: 'bold', color: 'white', backgroundColor: '#6BC8FF', width: 310, marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} onClick={LoginEmail}>
                        Đăng nhập
                    </Button>
                    <Button style={{ height: 35, borderRadius: 10, backgroundColor: '#35465d', fontWeight: 'bold', color: 'white', width: 310 }} onClick={() => navigate("/register")}>
                        Đăng ký
                    </Button>
                    <Button style={{ marginTop: 30, height: 35, borderRadius: 10, backgroundColor: '#CD201F', fontWeight: 'bold', color: 'white', width: 310, marginBottom: 5 }} onClick={LoginGG}>
                        Đăng nhập bằng Google
                    </Button>
                    <Button style={{ height: 35, borderRadius: 10, backgroundColor: '#1877F2', ontWeight: 'bold', color: 'white', width: 310 }} onClick={LoginFB}>
                        Đăng nhập bằng FaceBook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}





