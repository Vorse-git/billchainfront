// src/components/FormElements/CustomInput.jsx
import React from 'react'; // No es necesario useState si usamos pseudo-clases
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'; // Icono para error

const CustomInputSimple = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  className = '',      // Para clases externas
  readOnly = false,    // <-- Nueva prop
  disabled = false,    // <-- Nueva prop
  error = null,        // <-- Nueva prop (mensaje de error o null)
  placeholder = "Insert", // <-- Usar prop para placeholder
  ...props           // <-- Resto de props para el input
}) => {

  // IDs para accesibilidad
  const inputId = id || `input-${React.useId()}`;
  const errorId = error ? `${inputId}-error` : undefined;

  // --- Construcción dinámica de clases con Tailwind ---

  // Clases base (siempre aplicadas)
  const baseClasses = `
     relative block w-full h-12 px-3 py-2 border rounded-md 
      flex items-center justify-between border-gray-300
      text-sm transition duration-150 ease-in-out
  `;

  // Clases de estado (se aplican condicionalmente)
  const stateClasses = `
    ${error
      ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' // Estado de error
      : 'border-gray-200 focus:ring-purple-600 focus:border-purple-600' // Estado normal y focus
    }
    ${readOnly || disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300 focus:ring-gray-300 focus:border-gray-300' // ReadOnly o Disabled (override focus)
      : 'hover:border-gray-400 hover:shadow-md focus:outline-none' // Hover y focus outline (solo si no es readOnly/disabled)
    }
    ${disabled ? 'opacity-70' : ''} // Opacidad extra si está disabled
  `;

  // Combinar clases
  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.replace(/\s+/g, ' ').trim();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md"> {/* Contenedor para icono */}
        <input
          type={type}
          id={inputId}
          value={value}
          onChange={(e) => !readOnly && !disabled && onChange(e.target.value)} // Evita cambio si está bloqueado
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className={combinedClasses} // Aplica clases combinadas
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props} // Pasa otras props (inputMode, step, etc.)
        />
        {/* Icono de Error (se muestra si hay error) */}
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {/* Mensaje de Error (se muestra si hay error) */}
      {error && (
        <p className="mt-1 text-xs text-red-600" id={errorId}>
          {error} {/* Muestra el mensaje de error */}
        </p>
      )}
    </div>
  );
};

export default CustomInputSimple;