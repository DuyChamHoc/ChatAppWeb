import { Avatar, Typography } from 'antd'
import { formatRelative } from 'date-fns/esm';
import React, { useEffect, useState } from 'react'
import { storage } from '../../firebase';
import styled from 'styled-components'
import { getDownloadURL, ref } from 'firebase/storage';
const WrapperStyled = styled.div`
margin-bottom: 10px;

.author{
    margin-left:5px;
    font-weight:bold;
}

.date{
    margin-left:10px;
    font-size:11px;
    color:#a7a7a7;
}

.content{
    margin-left:30px;
    height:150px;
    weigh:150px,
}
`;
function formatDate(seconds) {
    let formattedDate = '';
    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate
}
export default function MessVideo({ text, displayName, createdAt, photoURL }) {
    const [getimage, setimage] = useState(null)
    useEffect(() => {
        const starsRef = ref(storage, text);
        getDownloadURL(starsRef)
            .then((url) => {
                setimage(url)
                // console.log(getimage)
            })
    }, [])
    return (
        <WrapperStyled>
            <div>
                <Avatar size='small' src={photoURL}>
                    {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography.Text className='author'>{displayName}</Typography.Text>
                <Typography.Text className='date'>{formatDate(createdAt?.seconds)}</Typography.Text>
            </div>
            <div>
                <video controls className='content' src={getimage} />
            </div>
        </WrapperStyled>
    )
}
