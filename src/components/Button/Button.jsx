const Button = ({ variant = "primary", startAdornment, children, ...props }) => {
    const baseStyles =
      "h-[56px] px-[20px] rounded-lg font-semibold focus:outline-none transition inline-flex items-center justify-center whitespace-nowrap w-auto gap-2";
  
    const variantStyles = {
      primary: "bg-[#4416A8] text-white hover:bg-[#6945B9]",
      outlined: "bg-white border border-[#4416A8] text-[#4416A8] hover:bg-violet-100",
    };
  
    return (
      <button className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
        {startAdornment && <span className="w-5 h-5">{startAdornment}</span>}
        {children}
      </button>
    );
  };
  
  export default Button;
  