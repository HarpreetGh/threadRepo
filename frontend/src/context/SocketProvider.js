import React, {useContext, useEffect, useState} from 'react'
import io from 'socket.io-client'
const SocketContext = React.createContext()
const userId = localStorage.getItem('id')

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({children}) {
    const [socket, setSocket] = useState()
    

    useEffect(() => {
        const newSocket = io('http://localhost:5000',
        { query: {userId}})
        
        setSocket(newSocket)

        return () => newSocket.close()
    }, [userId])


    return (
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider> 
    )
}