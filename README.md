# Proyecto CRUD de Autos con Zustand y Tailwind CSS

Este proyecto es una aplicación sencilla de gestión de autos donde se pueden **agregar**, **editar** y **eliminar** autos. Se utiliza **Zustand** para la gestión del estado y **Tailwind CSS** para el diseño de la interfaz de usuario.

## Tecnologías utilizadas

- **Zustand**: Para la gestión del estado global.
- **Tailwind CSS**: Para los estilos de la interfaz.
- **Next.js**: Como framework para React.
- **TypeScript**: Para tipar las variables, funciones y componentes.

## Instalación y configuración

### Paso 1: Clonar el repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/NicolasPozzer/crud-state-no-db.git
cd crud-state-no-db
```

### Paso 2: Instalar dependencias

Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

### Paso 3: Configuración de Zustand y Tailwind CSS

#### Instalar Zustand

Para manejar el estado global de la aplicación, instalamos **Zustand**:

```bash
npm install zustand
```

#### Instalar y configurar Tailwind CSS

Para utilizar **Tailwind CSS** en el proyecto, seguimos los siguientes pasos:

1. Instalamos Tailwind y las dependencias necesarias:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init
    ```

2. Configuramos el archivo `tailwind.config.js`:

    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

3. Añadimos las directivas de Tailwind al archivo `globals.css`:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

### Paso 4: Estructura del proyecto

La estructura del proyecto está organizada de la siguiente manera:

```
/lib
    /store
        index.ts      # Estado global usando Zustand
    /types
        index.ts      # Definición de tipos en TypeScript
/app
    /pages
        page.tsx      # Página principal del CRUD de autos
  /styles
    globals.css   # Estilos globales, incluyendo Tailwind CSS
```

---

## Implementación del Store con Zustand

El estado global se maneja con **Zustand**. Creamos un store para gestionar las operaciones CRUD de los autos.

### `lib/store/index.ts`

```ts
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

  setAutoInput: (input) => set({ autoInput: input }),

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

  selectAutoForEdit: (id) => {
    set((state) => {
      const autoToEdit = state.autos.find((auto) => auto.id === id);
      return {
        selectedAutoId: id,
        autoInput: autoToEdit ? autoToEdit.marca : "",
      };
    });
  },

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

  deleteAuto: (id) => {
    set((state) => ({
      autos: state.autos.filter((auto) => auto.id !== id),
    }));
  },
}));
```

### `types/index.ts`

Creamos el tipo de `Auto` que usaremos en el proyecto:

```ts
export type Auto = {
  id: number;
  marca: string;
};
```

---

## Página principal

La página principal es donde gestionamos la visualización y edición de los autos, utilizando el store de Zustand para actualizar el estado.

### `autos/page.tsx`

```tsx
"use client";
import { useAutoState } from "@/lib/store";
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
```

---

## Cómo ejecutar el proyecto

1. Clona el repositorio y navega a la carpeta del proyecto.
2. Instala las dependencias con `npm install`.
3. Ejecuta el proyecto con:

    ```bash
    npm run dev
    ```

4. Accede a la aplicación en tu navegador en `http://localhost:3000`.

---

## Conclusión

Este proyecto te brinda una base sólida para entender cómo implementar un CRUD utilizando **Zustand** para la gestión del estado global y **Tailwind CSS** para estilizar la interfaz de usuario.# crud-state-no-db
