import React, { useState, useContext } from 'react'
import { Row, Col, Button, Typography } from 'antd'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../firebase';
import { AuthContext } from '../Context/AuthProvider';
import { addDocument, generateKeywords } from '../../service';
export default function Register() {
  const { isUpdateLoad, setIsUpdateLoad } = useContext(AuthContext)
  const [getName, setName] = useState('')
  const [getEmail, setEmail] = useState('')
  const [getPass, setPass] = useState('')
  const { Title } = Typography
  const LoginEmail = () => {
    createUserWithEmailAndPassword(auth, getEmail, getPass)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: getName
        }).then(() => {
          addDocument('users', {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            providerId: auth.currentUser.providerData[0].providerId,
            keywords: generateKeywords(auth.currentUser.displayName)
          })
          setIsUpdateLoad(!isUpdateLoad)
        }).catch((error) => {
          console.log("update error")
        });
      })
      .catch(
        (error) => {
          console.log(error)
        }
      );
  }
  return (
    <div style={{ justifyContent: 'center', alignItems: 'center',backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg")`}}>
      <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ marginTop:200,marginRight: 100, textAlign: 'center', color: '#6BC8FF', fontWeight: 'bold' }} level={3}>
            Đăng ký tài khoản
          </Title>
          <input
            type='text'
            style={{ height: 35, width: '80%', marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} 
            placeholder='Tên tài khoản'
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <input
            type='text'
            style={{ height: 35, width: '80%', marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} 
            placeholder='Email'
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type='password'
            style={{ height: 35, width: '80%', marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }} 
            placeholder='Mật khẩu'
            onChange={(event) => {
              setPass(event.target.value);
            }}
          />
          <Button onClick={LoginEmail} style={{ height: 35, fontWeight: 'bold', color: 'white', backgroundColor: '#6BC8FF', width: '80%', marginBottom: 5, borderRadius: 10, borderColor: '#6BC8FF' }}>
            Đăng ký
          </Button>
        </Col>
      </Row>
    </div>
  )
}
