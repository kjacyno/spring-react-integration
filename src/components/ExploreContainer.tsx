import React, {useEffect, useRef, useState} from 'react';
import './ExploreContainer.css';
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonTitle,
    IonToolbar
} from "@ionic/react";

interface ContainerProps {
    id: number;
    name: string;
    email: string;
    dob: string;
    age: number;
}

const ExploreContainer = () => {
    const inputName = useRef<HTMLIonInputElement>(null);
    const inputEmail = useRef<HTMLIonInputElement>(null);
    const modal = useRef<HTMLIonModalElement>(null);

    const [students, setStudents] = useState<ContainerProps[]>([]);
    const [studentToEdit, setStudentToEdit] = useState<ContainerProps>({
        age: 0, dob: "", email: "", id: 0, name: ""
    })
    const [open, setOpen] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/student')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:8080/api/v1/student/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const updatedStudents = students.filter(item => item.id !== id)
        setStudents(updatedStudents)
    }
    const handleEdit = async (id: number) => {
        const name = inputName.current?.value
        const email = inputEmail.current?.value
        try {
            const res = await fetch(`http://localhost:8080/api/v1/student/${id}`)
            if (res) {
                const studentData = await res.json()
                const updatedStudent = {
                    ...studentData,
                    email: email ? email : studentData.email,
                    name: name ? name : studentData.name
                }
                console.log(updatedStudent)
                await fetch(`http://localhost:8080/api/v1/student/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedStudent)
                })
            }
        } catch (error) {
            console.error('error', error)
            throw error
        }
    }

    async function confirm(id: number) {
        await handleEdit(id)
        fetch('http://localhost:8080/api/v1/student')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching data:', error));
        setOpen(false)
    }

    return (
        <><IonList>
            <IonButton expand="block" onClick={()=>setOpenForm(true)}>Add</IonButton>

            {students.map(student => (

                <IonItem key={student.id}><IonLabel>{student.id}</IonLabel>
                    <IonLabel>{student.name}</IonLabel>
                    <IonLabel>{student.dob}</IonLabel>
                    <IonLabel>{student.email}</IonLabel>
                    <IonLabel>{student.age}</IonLabel>
                    <IonButton expand="block" onClick={() => handleDelete(student.id)}>Delete</IonButton>
                    <IonButton expand="block" onClick={() => {
                        setStudentToEdit(student);
                        setOpen(true)
                    }}>Edit</IonButton>
                </IonItem>
            ))}
        </IonList><IonModal ref={modal} isOpen={open}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => {
                            modal.current?.dismiss();
                            setOpen(false)
                        }}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Edit student details</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => confirm(studentToEdit.id)}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput
                        label="Edit student name"
                        labelPlacement="stacked"
                        ref={inputName}
                        type="text"
                        placeholder={`${studentToEdit.name}`}/>
                </IonItem>
                <IonItem>
                    <IonInput
                        label="Edit student email"
                        labelPlacement="stacked"
                        ref={inputEmail}
                        type="text"
                        placeholder={`${studentToEdit.email}`}/>
                </IonItem>
            </IonContent>
        </IonModal>
            <IonModal isOpen={openForm}>
        <IonList>
            <IonItem>
                <IonInput label="Name"></IonInput>
            </IonItem><IonItem>
                <IonInput label="Date of birth">
                    <IonDatetime/>
                </IonInput>
            </IonItem><IonItem>
                <IonInput label="Email"></IonInput>
            </IonItem>
        </IonList>
            </IonModal>
        </>
    );
};

export default ExploreContainer;
