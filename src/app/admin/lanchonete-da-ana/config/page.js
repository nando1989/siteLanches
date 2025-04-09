"use client";

import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../../../../firebaseConfig";

import './style.css';
import MenuLateral from "@/components/MenuLateral/menuLateral";
import { usePathname } from "next/navigation";

export default function AtualizarInfoForm() {
    const pathname = usePathname();
    const nomeLanchonete = pathname.split("/")[2];

    const [infoData, setInfoData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState("");
    const [editedValue, setEditedValue] = useState("");

    // Carrega os dados
    useEffect(() => {
        const infoRef = ref(database, `${nomeLanchonete}/info`);
        onValue(infoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setInfoData(data);
            }
        });console.log(infoRef)
    }, [nomeLanchonete]); // <- Agora sim!
    

    const openModal = (field, currentValue) => {
        setFieldToEdit(field);
        setEditedValue(currentValue);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            await update(ref(database, `${nomeLanchonete}/info`), {
                [fieldToEdit]: editedValue,
            });
            setShowModal(false);
        } catch (err) {
            console.error("Erro ao atualizar:", err);
            alert("Erro ao salvar");
        }
    };

    return (
        <div className="container-config">
            <MenuLateral />

            <div className="container-form">
                <div className="container-title-config">
                    <h2>Informações do Site</h2>
                </div>

                <div className="info-list">
                    {Object.entries(infoData).map(([key, value]) => (
                        <div key={key} className="info-item">
                            <strong>{key}:</strong> {value}
                            <button className="edit-btn" onClick={() => openModal(key, value)}>Editar</button>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <input
                                placeholder="Novo valor"
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                            />
                            <div className="modal-buttons">
                                <button className="modal-btn-salvar" onClick={handleSave}>Salvar</button>
                                <button className="modal-btn-cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
