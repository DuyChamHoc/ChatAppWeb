import React, { createContext, useMemo, useContext, useState } from 'react'
import { AuthContext } from './AuthProvider';
import useFirestore from '../../hooks/useFirestore';
export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState('')
    const { user: { uid } } = useContext(AuthContext)
    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [isAddRoomVisible, uid])
    const rooms = useFirestore('rooms', roomsCondition);

    const selectedRoom = useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    );


    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members,
        }
    }, [selectedRoom.members,isInviteMemberVisible])
    const members = useFirestore('users', usersCondition)
    return (
        <AppContext.Provider value={{
            rooms,
            members,
            selectedRoom,
            isAddRoomVisible,
            setIsAddRoomVisible,
            selectedRoomId,
            setSelectedRoomId,
            isInviteMemberVisible,
            setIsInviteMemberVisible,
        }}>
            {children}
        </AppContext.Provider>
    )
}
