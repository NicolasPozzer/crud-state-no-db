import { Auto } from "@/lib/types";
import { create } from "zustand";

// Define la interfaz del estado
interface AutoState {
    autos: Auto[];
    autoInput: string;
    selectedAutoId: number | null; // Para manejar el auto seleccionado al editar
    setAutoInput: (input: string) => void;
    addAuto: () => void;
    selectAutoForEdit: (id: number) => void; // Selecciona el auto para editar
    editAuto: () => void; // Edita el auto seleccionado
    deleteAuto: (id: number) => void; // Elimina un auto por ID
}

// Crea el store de Zustand
export const useAutoState = create<AutoState>((set) => ({
    autos: [],
    autoInput: "",
    selectedAutoId: null,

    // Actualiza el valor del input
    setAutoInput: (input) => set({ autoInput: input }),

    // Agrega un nuevo auto
    addAuto: () => {
        set((state) => {
            if (state.autoInput.trim() === "") return state;

            const newAuto: Auto = {
                id: state.autos.length + 1,
                marca: state.autoInput,
            };

            return {
                autos: [...state.autos, newAuto],
                autoInput: "",
            };
        });
    },

    // Selecciona un auto para editar
    selectAutoForEdit: (id) => {
        set((state) => {
            const autoToEdit = state.autos.find((auto) => auto.id === id);
            return {
                selectedAutoId: id,
                autoInput: autoToEdit ? autoToEdit.marca : "",
            };
        });
    },

    // Edita el auto seleccionado
    editAuto: () => {
        set((state) => {
            if (state.selectedAutoId === null || state.autoInput.trim() === "") return state;

            const updatedAutos = state.autos.map((auto) =>
                auto.id === state.selectedAutoId ? { ...auto, marca: state.autoInput } : auto
            );

            return {
                autos: updatedAutos,
                selectedAutoId: null,
                autoInput: "",
            };
        });
    },

    // Elimina un auto por ID
    deleteAuto: (id) => {
        set((state) => ({
            autos: state.autos.filter((auto) => auto.id !== id),
        }));
    },
}));
