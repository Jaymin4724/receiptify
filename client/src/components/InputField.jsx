function InputField({ label, name, type = "text", value, onChange, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="label text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="input input-bordered"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export default InputField;
