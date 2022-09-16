import React, { useContext, useState, useMemo, useEffect } from 'react'
import { Form, Modal, Select, Spin, Avatar } from 'antd'
import { AppContext } from '../Context/AppProvider'
import { debounce } from 'lodash'
import { db } from '../../firebase'
import { collection, getDocs, query, where, orderBy, doc, limit, updateDoc } from "firebase/firestore";

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
}) {

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {
        return () => {
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    const museums = query(collection(db, 'users'), orderBy("displayName"), where('keywords', 'array-contains', search), limit(20));
    return (await getDocs(museums)).docs.map(doc => ({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL
    })).filter(opt => !curMembers.includes(opt.value));
}

export default function InviteMemberModal() {
    const {
        setIsAddRoomVisible,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoomId,
        selectedRoom }
        = useContext(AppContext)
    const [form] = Form.useForm();
    const [value, setValue] = useState([]);

    const handleOK = async () => {
        setIsAddRoomVisible(true)
        form.resetFields();
        setValue([]);
        const roomRef = doc(db, "rooms", selectedRoomId)
        await updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map(val => val.value)]
        })
        setIsInviteMemberVisible(false)
        setIsAddRoomVisible(false)
    }
    const handCancel = () => {
        form.resetFields();
        setValue([]);
        setIsInviteMemberVisible(false)
    }
    return (
        <div>
            <Modal
                title="Mời thêm thành viên"
                open={isInviteMemberVisible}
                onOk={handleOK}
                onCancel={handCancel}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode="multiple"
                        name='search-user'
                        label="Tên các thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}
