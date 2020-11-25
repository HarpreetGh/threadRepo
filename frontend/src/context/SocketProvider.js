import React, {useContext, useEffect, useState} from 'react'
import {ListGroup} from 'react-bootstrap'
import io from 'socket.io-client'
const SocketContext = React.createContext()
const userId = localStorage.getItem('username') 

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({children}) {
    const [socket, setSocket] = useState()
    //const [connectedUsers, setConnectedUsers] = useState([])

    useEffect(() => {
        const newSocket = io('http://localhost:5000',
        { query: {userId}})    
        //connectedUsers.push(userId) show users online ?   
        setSocket(newSocket)

        return () => newSocket.close()
    }, [userId])    


    return (
        <SocketContext.Provider value = {socket}>
            {children} 
            {/*Online Users:  {connectedUsers.map((users, index) =>(
                <ListGroup.Item key = {index}>
                    {users}
                </ListGroup.Item>
            ))*/} 
        </SocketContext.Provider> 
    )
}