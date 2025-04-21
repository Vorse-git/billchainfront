// src/components/FormElements/CustomDatePickerSimple.jsx (Updated States, Calendar Restored)
import React from 'react';
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/20/solid';
import "react-day-picker/dist/style.css"; // Asegúrate que este CSS se carga

const CustomDatePickerSimple = ({
  label,
  value,
  onChange,
  id,
  className = '',
  readOnly = false,
  disabled = false,
  error = null,
  placeholder = "MM/DD/AAAA",
  dateFormat = "MM/dd/yyyy", // Mantenemos el formato por si lo necesitas
  ...props
}) => {

  // IDs para accesibilidad
  const datePickerId = id || `datepicker-${React.useId()}`;
  const errorId = error ? `${datePickerId}-error` : undefined;
  const isBlocked = readOnly || disabled;

  // --- Clases para el Div Trigger (Manteniendo la lógica de estados) ---
  const getTriggerDivClasses = () => {
    let classes = `
       relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
    `;

    if (isBlocked) {
      classes += ' bg-gray-100 border-gray-300 cursor-not-allowed text-gray-500';
    } else {
      classes += ' bg-white cursor-pointer focus:outline-none';
      classes += ' hover:border-gray-400 hover:shadow-md';
      if (error) {
        classes += ' border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500';
      } else {
        // Usar focus-within para simular focus en el div cuando el botón interno tiene foco
        classes += ' border-gray-200 focus-within:ring-1 focus-within:ring-purple-600 focus-within:border-purple-600';
      }
    }
    classes += ` ${className}`;
    return classes.replace(/\s+/g, ' ').trim();
  };

  // --- Clases para el Texto del Valor/Placeholder (Manteniendo la lógica de estados) ---
  const getValueTextClasses = () => {
    let classes = 'text-sm truncate';
    if (isBlocked) {
      classes += ' text-gray-500';
    } else if (value) {
      classes += ' text-gray-900';
    } else {
      classes += ' text-gray-400';
    }
    return classes;
  };

   // --- Clases para Iconos (Manteniendo la lógica de estados) ---
   const getIconClasses = (isErrorIcon = false) => {
      let classes = 'h-5 w-5';
      if (isErrorIcon) {
          classes += ' text-red-500';
      } else if (isBlocked) {
          classes += ' text-gray-400';
      } else {
          classes += ' text-gray-500';
      }
      return classes;
   }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={datePickerId} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Popover placement="bottom" disabled={isBlocked}>
        <PopoverHandler>
          {/* Usar un 'div' normal como trigger si 'button' daba problemas,
             pero añadir tabIndex para foco y onKeyDown para accesibilidad */}
          <div
            id={datePickerId}
            tabIndex={isBlocked ? -1 : 0} // Permite foco si no está bloqueado
            className={getTriggerDivClasses()}
            aria-haspopup="dialog"
            aria-invalid={!!error}
            aria-describedby={errorId}
             onKeyDown={(e) => { // Permitir abrir con teclado si tiene foco
                if (!isBlocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    // Necesitamos una forma de abrir el popover programáticamente
                    // o simular un click aquí si MT lo permite.
                    // Por ahora, esto solo previene la acción por defecto.
                    // El click con ratón sí funciona.
                }
            }}
            {...props}
          >
            {/* Contenido interno del trigger */}
            <div className="flex items-center gap-2 overflow-hidden pointer-events-none"> {/* pointer-events-none para que el click pase al div padre */}
              <CalendarIcon className={getIconClasses()} aria-hidden="true"/>
              <span className={getValueTextClasses()}>
                {value ? format(value, dateFormat) : placeholder}
              </span>
            </div>
             {/* Icono de error (si aplica) */}
             {error && !isBlocked && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ExclamationCircleIcon className={getIconClasses(true)} aria-hidden="true" />
                </div>
             )}
          </div>
        </PopoverHandler>
        {/* --- CONTENIDO DEL POPOVER Y DAYPICKER RESTAURADO --- */}
        <PopoverContent className="z-[9999] p-4 bg-white shadow-lg rounded-2xl overflow-visible w-auto">
          <DayPicker
            mode="single"
            selected={value}
            // Asegurarse que onChange solo se llama si no está bloqueado
            onSelect={(selectedDate) => !isBlocked && onChange(selectedDate)}
            showOutsideDays
            className="w-full custom-calendar" // Mantenemos la clase para los estilos JSX
            // Componentes de icono restaurados a la versión original
            components={{
              IconLeft: (props) => (
                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
              ),
              IconRight: (props) => (
                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
              ),
            }}
          />
        </PopoverContent>
        {/* ------------------------------------------------- */}
      </Popover>
      {/* Mensaje de Error (se muestra si error existe y no está bloqueado) */}
      {error && !isBlocked && (
        <p className="text-red-600 text-xs mt-1" id={errorId}>
            {error}
        </p>
      )}

      {/* --- ESTILOS JSX RESTAURADOS --- */}
      <style jsx>{`
        .custom-calendar .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_outside) { /* Evitar hover en días no interactivos */
          background-color: #f3e8ff; /* Un violeta más claro para hover */
          border-radius: 8px;
        }
        .custom-calendar .rdp-day_selected {
          background-color: #4416A8 !important; /* Tu violeta principal */
          color: white !important;
          border-radius: 8px; /* Hacerlo consistente */
        }
         /* Opcional: Mejorar visibilidad del día actual */
        .custom-calendar .rdp-day_today {
             font-weight: bold;
             color: #4416A8;
        }
        /* Ajustar tamaño/padding si es necesario */
        .custom-calendar .rdp-caption_label {
             font-size: 0.875rem; /* text-sm */
             font-weight: 500; /* medium */
        }
        .custom-calendar .rdp-head_cell {
             font-size: 0.75rem; /* text-xs */
             color: #6b7280; /* gray-500 */
        }
      `}</style>
      {/* ---------------------------- */}
    </div>
  );
};

export default CustomDatePickerSimple;