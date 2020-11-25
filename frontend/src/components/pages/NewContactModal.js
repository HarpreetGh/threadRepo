import React, {useRef} from 'react'
import {Modal, Form, Button} from 'react-bootstrap'
import { useContacts } from '../../context/ContactsProvider'

export default function NewContactModal({closeModal}) {
    const idRef = useRef()
    const nameRef = useRef()
    const {createContact} = useContacts()

    function handleSubmit(e)  {
        e.preventDefault()
    
        createContact(idRef.current.value, idRef.current.value )
        closeModal()
    }
    
    return (
        <>
        <Modal.Header style={{ zIndex:1}}  closeButton>Create Contact </Modal.Header>
        <Modal.Body >
        <Form onSubmit = {handleSubmit}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type = "text" ref = {idRef} required />
                </Form.Group>
             
                <Button type ='submit'>Create</Button>
            </Form>
        </Modal.Body>
        </>
    )
}