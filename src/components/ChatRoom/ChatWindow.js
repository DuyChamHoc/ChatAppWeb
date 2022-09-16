import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { UserAddOutlined } from '@ant-design/icons'
import Message from './Message';
import { AppContext } from '../Context/AppProvider';
import { addDocument } from '../../service';
import { AuthContext } from '../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';
import { storage } from '../../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid"
import { useReactMediaRecorder } from 'react-media-recorder';
import MessImage from './MessImage';
import MessVideo from './MessVideo';
import MessFile from './MessFile';
import { async } from '@firebase/util';
import MessAudio from './MessAudio';
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;
const FormStyled1 = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  .input{
    weight:200px;
  }

`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext)
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm()
  const [load, setload] = useState(1)
  const [imageUpload, setImageUpload] = useState(null)
  const [check, setcheck] = useState(0)
  const { user: {
    uid, photoURL, displayName
  } } = useContext(AuthContext)
  const handleInputChange = (e) => {
    setcheck(1)
    setInputValue(e.target.value)
  }

  const handleOnSubmit = async () => {
    if (check == 1) {
      if (inputValue != "") {
        addDocument('messages', {
          text: inputValue,
          uid,
          photoURL,
          roomId: selectedRoom.id,
          displayName,
          type: 'text'
        });
        setload(Math.random())
        form.resetFields(['message'])
      }
    }
    else {
      if (check == 2) {
        if (imageUpload.type.slice(0, 5) == 'image') {
          const fileName = imageUpload.name + v4();
          const imageref = ref(storage, fileName)
          uploadBytes(imageref, imageUpload).then(() => {
            addDocument('messages', {
              text: fileName,
              uid,
              photoURL,
              roomId: selectedRoom.id,
              displayName,
              type: 'image'
            });
            setload(Math.random())
            setImageUpload(null)
          })
        }
        else {
          if (imageUpload.type.slice(0, 5) == 'video') {
            const fileName = imageUpload.name + v4();
            const imageref = ref(storage, fileName)
            uploadBytes(imageref, imageUpload).then(() => {
              addDocument('messages', {
                text: fileName,
                uid,
                photoURL,
                roomId: selectedRoom.id,
                displayName,
                type: 'video'
              });
              setload(Math.random())
              setImageUpload(null)
            })
          }
          else {
            if (imageUpload.type.slice(0, 5) == 'audio') {
              const fileName = imageUpload.name + v4();
              const imageref = ref(storage, fileName)
              uploadBytes(imageref, imageUpload).then(() => {
                addDocument('messages', {
                  text: fileName,
                  uid,
                  photoURL,
                  roomId: selectedRoom.id,
                  displayName,
                  type: 'audio'
                });
                setload(Math.random())
                setImageUpload(null)
              })
            }
            else {
              const fileName = imageUpload.name;
              const imageref = ref(storage, fileName)
              uploadBytes(imageref, imageUpload).then(() => {
                addDocument('messages', {
                  text: fileName,
                  uid,
                  photoURL,
                  roomId: selectedRoom.id,
                  displayName,
                  type: 'file'
                });
                setload(Math.random())
                setImageUpload(null)
              })
            }
          }
        }
      }
    }
  }
  const condition = useMemo(() => ({
    fieldName: 'roomId',
    operator: '==',
    compareValue: selectedRoom.id
  }), [selectedRoom.id, load])
  const messages = useFirestore('messages', condition)

  const enter = () => {
    startRecording()
  }
  const cancel = async () => { 
    setcheck(2)
    stopRecording()
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    setImageUpload(new File([audioBlob], 'voice.wav', { type: 'audio/wav' }));
  }
  return (
    <WrapperStyled>
      {
        selectedRoom.id ? (
          <>
            <HeaderStyled>
              <div className='header_info'>
                <p className='header_title'>{selectedRoom.name}</p>
                <span className='header_description'>{selectedRoom.description}</span>
              </div>
              <ButtonGroupStyled>
                <Button icon={<UserAddOutlined />} type='text' onClick={() => setIsInviteMemberVisible(true)}>
                  Mời
                </Button>
                <Avatar.Group size='small' maxCount={2}>
                  {
                    members.map(member =>
                      <Tooltip title={member.displayName} key={member.id}>
                        <Avatar src={member.photoURL}>{member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase}</Avatar>
                      </Tooltip>)
                  }
                </Avatar.Group>
              </ButtonGroupStyled>
            </HeaderStyled>
            <ContentStyled>
              <MessageListStyled>
                {
                  messages.map((mes) =>
                    mes.type == 'text' ?
                      <Message
                        key={mes.id}
                        text={mes.text}
                        photoURL={mes.photoURL}
                        displayName={mes.displayName}
                        createdAt={mes.createdAt}
                      /> :
                      <>{
                        mes.type == 'image' ?
                          <MessImage
                            key={mes.id}
                            text={mes.text}
                            photoURL={mes.photoURL}
                            displayName={mes.displayName}
                            createdAt={mes.createdAt}
                          /> :
                          <>
                            {mes.type == 'video' ?
                              <MessVideo
                                key={mes.id}
                                text={mes.text}
                                photoURL={mes.photoURL}
                                displayName={mes.displayName}
                                createdAt={mes.createdAt}
                              /> :
                              <>
                                {
                                  mes.type == 'audio' ?
                                    <MessAudio
                                      key={mes.id}
                                      text={mes.text}
                                      photoURL={mes.photoURL}
                                      displayName={mes.displayName}
                                      createdAt={mes.createdAt}
                                    /> :
                                    <MessFile
                                      key={mes.id}
                                      text={mes.text}
                                      photoURL={mes.photoURL}
                                      displayName={mes.displayName}
                                      createdAt={mes.createdAt}
                                    />
                                }
                              </>
                            }
                          </>
                      }
                      </>
                  )
                }
              </MessageListStyled>
              <FormStyled form={form}>
                <Form.Item name="message">
                  <Input
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                    placeholder='Nhập tin nhắn'
                    bordered={false}
                    autoComplete="off"
                  />
                </Form.Item>
                <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
              </FormStyled>
              <FormStyled1 form={form}>
                <Input
                  className='input'
                  type='file'
                  name='name'
                  onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                    setcheck(2)
                  }}
                />
                <Button onPointerEnter={enter} onPointerLeave={cancel}>
                  Voice
                </Button>
              </FormStyled1>
            </ContentStyled>
          </>) : <Alert message="Hãy chọn phòng" type='info' showIcon style={{ margin: 5 }} closable />
      }

    </WrapperStyled>
  )
}
