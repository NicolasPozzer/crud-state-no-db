"use client";
import { useAutoState } from "@/lib/store"; // Asegúrate de que la ruta sea correcta
import React from "react";

export default function AutoPage() {
    const autos = useAutoState((state) => state.autos);
    const autoInput = useAutoState((state) => state.autoInput);
    const selectedAutoId = useAutoState((state) => state.selectedAutoId);

    const setAutoInput = useAutoState((state) => state.setAutoInput);
    const addAuto = useAutoState((state) => state.addAuto);
    const editAuto = useAutoState((state) => state.editAuto);
    const deleteAuto = useAutoState((state) => state.deleteAuto);
    const selectAutoForEdit = useAutoState((state) => state.selectAutoForEdit);

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Lista de Autos</h2>

            <ul className="space-y-4 mb-6">
                {autos.map((auto) => (
                    <li
                        key={auto.id}
                        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md"
                    >
            <span>
              <strong>{auto.id}:</strong> {auto.marca}
            </span>
                        <div className="flex space-x-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                onClick={() => selectAutoForEdit(auto.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                onClick={() => deleteAuto(auto.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mb-4">
                <input
                    type="text"
                    value={autoInput}
                    onChange={(e) => setAutoInput(e.target.value)}
                    placeholder="Escribe la marca del auto"
                    className="w-full p-2 border rounded-md shadow-sm mb-4"
                />
                {selectedAutoId ? (
                    <button
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                        onClick={editAuto}
                    >
                        Actualizar Auto
                    </button>
                ) : (
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                        onClick={addAuto}
                    >
                        Agregar Auto
                    </button>
                )}
            </div>
        </div>
    );
}
