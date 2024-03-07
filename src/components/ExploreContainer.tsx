import React, {useEffect, useRef, useState} from 'react';
import './ExploreContainer.css';
import {

    IonButton,
    IonButtons,
    IonContent, IonDatetime, IonDatetimeButton,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal, IonPopover,
    IonTitle,
    IonToolbar
} from "@ionic/react";

type ContainerProps = {
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
    const datetime = useRef<null | HTMLIonDatetimeElement>(null);
    const popover = useRef<HTMLIonPopoverElement>(null)

    const [students, setStudents] = useState<ContainerProps[]>([]);
    const [student, setStudent] = useState<ContainerProps>({
        age: 0, dob: "", email: "", id: 0, name: ""
    });
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);

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
        setStudent({age: 0, dob: "", email: "", id: 0, name: ""})
    }

    async function confirmEdit(id: number) {
        await handleEdit(id)
        fetch('http://localhost:8080/api/v1/student')
            .then(response => response.json())
            .then(data => setStudents(data))
            .catch(error => console.error('Error fetching data:', error));
        setOpen(false)
    }

    const confirmClick = () => {
        datetime.current?.confirm();
        popover.current?.dismiss();
    };
    const confirmForm = async (student: ContainerProps) => {
        await fetch('http://localhost:8080/api/v1/student', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        })
        console.log(student)
        modal.current?.dismiss();

    }
    return (
        <><IonList>
            <IonButton expand="full" onClick={() => setOpenForm(true)}>Add</IonButton>

            {students.map(student => (

                <IonItem key={student.id}><IonLabel>{student.id}</IonLabel>
                    <IonLabel>{student.name}</IonLabel>
                    <IonLabel>{student.dob}</IonLabel>
                    <IonLabel>{student.email}</IonLabel>
                    <IonLabel>{student.age}</IonLabel>
                    <IonButton expand="full" onClick={() => handleDelete(student.id)}>Delete</IonButton>
                    <IonButton expand="full" onClick={() => {
                        setStudent(student);
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
                            setStudent({age: 0, dob: "", email: "", id: 0, name: ""})
                            setOpen(false)
                        }}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Edit student details</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => confirmEdit(student.id)}>
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
                        placeholder={`${student.name}`}/>
                </IonItem>
                <IonItem>
                    <IonInput
                        label="Edit student email"
                        labelPlacement="stacked"
                        ref={inputEmail}
                        type="text"
                        placeholder={`${student.email}`}/>
                </IonItem>
            </IonContent>
        </IonModal>
            <IonModal isOpen={openForm} ref={modal}>
                <IonList>
                    <IonItem>
                        <IonInput label="Name" placeholder="the name of the new student" onIonInput={(e) => setStudent({
                            ...student,
                            name: e.detail.value as string
                        })}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Date of birth</IonLabel>
                        <IonDatetimeButton datetime="dob"></IonDatetimeButton>
                    </IonItem>
                    <IonPopover keepContentsMounted={true} ref={popover}>
                        <IonDatetime id="dob" presentation="date" onIonChange={(e) => setStudent({
                            ...student,
                            dob: e.detail.value as string
                        })} ref={datetime}>
                            <IonButtons slot="buttons">
                                <IonButton slot="end" onClick={confirmClick} color="primary">confirm</IonButton>
                            </IonButtons>
                        </IonDatetime>
                    </IonPopover>
                    <IonItem>
                        <IonInput label="Email" placeholder="the email of the new student"
                                  onIonInput={(e) => setStudent({
                                      ...student,
                                      email: e.detail.value as string
                                  })}></IonInput>
                    </IonItem>
                    <IonButtons style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <IonButton onClick={() => {
                            modal.current?.dismiss();
                            setOpenForm(false)
                        }}>Cancel</IonButton>

                        <IonButton strong={true} onClick={() => confirmForm(student)}>
                            Confirm
                        </IonButton></IonButtons>
                </IonList>

            </IonModal>
        </>
    )
        ;
};

export default ExploreContainer;
