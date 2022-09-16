import { Avatar, Button, Modal, Typography } from 'antd'
import React, {  useContext, useState } from 'react'
import styled from 'styled-components'
import { auth,  storage } from '../../firebase'
import { updateProfile } from "firebase/auth";
import { AuthContext } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom'
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
const WrapperStyled = styled.div`
display: flex;
justify-content: space-betwwen;
padding: 12px 16px;
border-bottom: 1px solid rgba(82, 38, 83);

.username{
    color: white;
    margin-left: 10px;
    margin-right: 80px;
}
`

const ModalStyled = styled.div`
.view{
    margin-left: 10px;
}
.view1{
    margin-top: 10px;
}
`
export default function UserInfo() {
    const navigate = useNavigate();
    const [getimage, setimage] = useState(null)
    const [getname, setname] = useState("")
    const data = useContext(AuthContext)
    const { isUpdateVisible, setIsUpdateVisible } = useContext(AuthContext)
    const handleOK = () => {
        const fileName = getimage.name + v4();
        const imageref = ref(storage, fileName)
        uploadBytes(imageref, getimage).then(() => {
            getDownloadURL(imageref)
                .then((url) => {
                    updateProfile(auth.currentUser, {
                        displayName: getname, photoURL: url
                    }).then(() => {
                        console.log("update success")
                        setIsUpdateVisible(false)
                        navigate('/');
                    }).catch((error) => {
                        console.log("update error")
                        setIsUpdateVisible(false)
                    });
                })
        })
    }
    const handCancel = () => {
        setIsUpdateVisible(false)
    }
    const logout=()=>{
        navigate('/login')
        auth.signOut()
    }
    return (
        <WrapperStyled>
            <div>
                <Avatar onClick={() => { setIsUpdateVisible(true) }} src={data.user.photoURL}>{data.user.photoURL ? '' : data.user.displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className='username'>{data.user.displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() =>logout()}>Đăng xuất</Button>
            <Modal
                title="Cập nhập thông tin"
                open={isUpdateVisible}
                onOk={handleOK}
                onCancel={handCancel}
            >
                <ModalStyled>
                    <div>
                        <label>Chọn ảnh: </label>
                        <input
                            className='view'
                            type='file'
                            onChange={(event) => {
                                setimage(event.target.files[0]);
                            }}
                        />
                    </div>
                    <div className='view1'>
                        <label>Tên tài khoản: </label>
                        <input
                            className='view'
                            onChange={(event) => {
                                setname(event.target.value);
                            }}
                        />
                    </div>
                </ModalStyled>
            </Modal>
        </WrapperStyled>
    )
}
