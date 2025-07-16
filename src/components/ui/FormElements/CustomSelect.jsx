// src/components/FormElements/CustomSelectSimple.jsx (Corrected)
import React, { useState, useRef, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CustomSelectSimple = ({
  label,
  options = [],
  onChange,
  value,
  id,
  className = '',
  readOnly = false,
  disabled = false,
  error = null,
  placeholder = "Select",
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // IDs
  const selectId = id || `select-${React.useId()}`;
  const errorId = error ? `${selectId}-error` : undefined;

  // Click Outside Handler (simplified useEffect)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el ref existe y el click fue FUERA del elemento ref, cierra el dropdown
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    // Añade el listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);
    // Limpia el listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // <- Dependencia vacía, el listener vive mientras el componente exista


  // --- Clases para el Div Principal ---
  const getDivClasses = () => {
    let classes = `
      relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
    `;

    if (disabled || readOnly) {
      classes += ' bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500';
    } else {
      classes += ' bg-white cursor-pointer hover:border-gray-400 hover:shadow-md';
      if (error) {
        classes += ' border-red-500'; // Borde rojo si hay error
      } else if (open) {
        classes += ' ring-1 ring-purple-600 border-purple-600'; // Estilo "focus" si está abierto
      } else {
        classes += ' border-gray-200'; // Borde normal
      }
    }
    classes += ` ${className}`; // Añade clases externas
    return classes.replace(/\s+/g, ' ').trim();
  };


  // --- Clases para el Texto del Valor ---
  const getValueTextClasses = () => {
    let classes = 'text-sm truncate pr-2';
    if (readOnly || disabled) {
      classes += ' text-gray-500';
    } else if (value) {
      classes += ' text-gray-900';
    } else {
      classes += ' text-gray-400'; // Placeholder color
    }
     if (error) {
         // Podrías querer un color diferente si hay error, aunque el borde ya lo indica
         // classes += ' text-red-900'; // Opcional
     }
    return classes;
  };

  // --- Clases para Iconos ---
   const getIconClasses = () => {
      let classes = 'h-5 w-5';
      if (readOnly || disabled) {
          classes += ' text-gray-400';
      } else {
          classes += ' text-gray-500';
      }
      return classes;
   }


  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        id={selectId}
        onClick={() => {
           // Solo permite abrir/cerrar si NO está readOnly o disabled
           if (!readOnly && !disabled) {
               setOpen(!open);
           }
        }}
        className={getDivClasses()} // Llama a la función para obtener clases
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={!!error}
        aria-describedby={errorId}
        tabIndex={disabled ? -1 : 0} // Foco solo si no está disabled
         onKeyDown={(e) => { // Abrir/Cerrar con teclado
            if (!readOnly && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setOpen(!open);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        }}
        {...props}
      >
        {/* Valor o Placeholder */}
        <span className={getValueTextClasses()}>
          {value ? options.find((option) => option.value === value)?.label : placeholder}
        </span>

        {/* Iconos a la derecha */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"> {/* pointer-events-none aquí para que el click pase al div */}
           {error && (
             <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-1" aria-hidden="true" />
           )}
           <ChevronDownIcon
             className={`${getIconClasses()} transform transition-transform ${open ? 'rotate-180' : ''}`}
             aria-hidden="true"
           />
        </div>
      </div>

      {/* Lista de Opciones (Dropdown) */}
      {/* La condición es más simple: solo depende de 'open' (el click ya está bloqueado si es readOnly/disabled) */}
      {open && (
        <ul
          className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto w-full"
          role="listbox"
          aria-labelledby={selectId}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                // Verificación redundante pero segura: solo cambia si no está bloqueado
                if (!readOnly && !disabled) {
                    onChange(option.value);
                    setOpen(false);
                }
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

       {/* Mensaje de Error */}
       {error && (
        <p className="mt-1 text-xs text-red-600" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelectSimple;