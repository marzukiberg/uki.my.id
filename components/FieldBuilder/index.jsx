import React from "react";
import { useFormik } from "formik";
import Dropzone from "../atoms/Dropzone";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";

const FieldBuilder = ({
  fields,
  initialData = {},
  onChange,
  withFormik = false,
  validationSchema,
  onSubmit,
  onClose,
  showButtons = false,
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  // Always call useFormik at the top level for conditional usage
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: async (
      values,
      { setSubmitting, validateForm, setTouched, setErrors }
    ) => {
      // Validate the form manually
      const validationErrors = await validateForm();

      // If there are validation errors, mark all fields as touched and set errors to show them
      if (Object.keys(validationErrors).length > 0) {
        const touchedFields = {};
        fields.forEach((field) => {
          touchedFields[field.name] = true;
        });
        setTouched(touchedFields);
        setErrors(validationErrors); // Explicitly set errors to ensure they persist
        setSubmitting(false);
        return;
      }

      // If validation passes, call the onSubmit callback
      if (onSubmit) {
        try {
          await onSubmit(values);
        } finally {
          setSubmitting(false);
        }
      } else {
        setSubmitting(false);
      }
    },
  });

  const InnerFormContent = ({
    values,
    handleChange,
    setFieldValue,
    setTouched,
    errors = {},
    touched = {},
    formik: formikInstance,
  }) => {
    // If not using Formik, we need a local state for formData and validation
    const [localFormData, setLocalFormData] = React.useState(initialData);
    const [localErrors, setLocalErrors] = React.useState({});
    const [localTouched, setLocalTouched] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Manual validation function for non-Formik mode
    const validateField = React.useCallback(
      async (name, value) => {
        if (!validationSchema || withFormik) return;

        try {
          const fieldSchema = Yup.reach(validationSchema, name);
          await fieldSchema.validate(value);
          setLocalErrors((prev) => ({ ...prev, [name]: undefined }));
        } catch (error) {
          setLocalErrors((prev) => ({ ...prev, [name]: error.message }));
        }
      },
      []
    );

    // Manual form validation for save
    const validateForm = React.useCallback(async () => {
      if (!validationSchema || withFormik) return {};

      try {
        await validationSchema.validate(localFormData, { abortEarly: false });
        setLocalErrors({});
        return {};
      } catch (error) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setLocalErrors(validationErrors);

        // Mark all fields as touched to show errors
        const touchedFields = {};
        fields.forEach((field) => {
          touchedFields[field.name] = true;
        });
        setLocalTouched(touchedFields);

        return validationErrors;
      }
    }, [localFormData]);

    // Handle manual save with validation
    const handleManualSave = React.useCallback(async () => {
      const validationErrors = await validateForm();

      if (Object.keys(validationErrors).length === 0) {
        if (onSubmit) {
          setIsSubmitting(true);
          try {
            await onSubmit(localFormData);
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    }, [validateForm, localFormData]);

    // Use local state's handleChange if Formik is not used
    const handleLocalChange = (e) => {
      const { name, value, type, files } = e.target;
      let newValue = value;

      if (type === "file") {
        newValue = files[0]; // Take the first file
      }

      setLocalFormData((prevData) => {
        const updatedData = { ...prevData, [name]: newValue };
        if (onChange) {
          onChange(updatedData);
        }
        return updatedData;
      });

      // Validate field if validation schema exists
      if (validationSchema && !withFormik) {
        validateField(name, newValue);
      }
    };

    const currentHandleChange = withFormik ? handleChange : handleLocalChange;
    const currentSetFieldValue = withFormik
      ? setFieldValue
      : (name, value) => handleLocalChange({ target: { name, value } });
    const currentFormData = withFormik ? values : localFormData;
    const currentErrors = withFormik ? errors : localErrors;
    const currentTouched = withFormik ? touched : localTouched;

    return (
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.name || index} className="flex flex-col">
            {field.label && (
              <label
                htmlFor={field.name}
                className="mb-1 text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
            )}
            {field.type === "text" && (
              <input
                type="text"
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                {...(withFormik
                  ? {
                    value: values[field.name] || "",
                    onBlur: () =>
                      setTouched({ ...touched, [field.name]: true }),
                  }
                  : {
                    defaultValue:
                      currentFormData[field.name] || field.defaultValue || "",
                  })}
                onChange={currentHandleChange}
                className={`rounded-md border p-2 focus:border-blue-500 focus:ring-blue-500 ${currentErrors[field.name] && currentTouched[field.name]
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
              />
            )}
            {field.type === "dropzone" && (
              <Dropzone
                field={field}
                formData={withFormik ? values : localFormData}
                setFieldValue={
                  withFormik ? setFieldValue : currentSetFieldValue
                }
                setTouched={withFormik ? setTouched : null}
                onChange={onChange}
                errors={errors}
                touched={touched}
              />
            )}
            {/* Error message for all field types */}
            {currentErrors[field.name] && currentTouched[field.name] && (
              <span className="mt-1 text-xs text-red-500">
                {currentErrors[field.name]}
              </span>
            )}
            {/* Add more field types as needed */}
          </div>
        ))}

        {/* Action Buttons */}
        {showButtons && (
          <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {cancelButtonText}
              </button>
            )}
            {(onSubmit || withFormik) && (
              <button
                type={withFormik ? "submit" : "button"}
                onClick={withFormik ? undefined : handleManualSave}
                disabled={isSubmitting || (withFormik && formik.isSubmitting)}
                className="flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {(isSubmitting || (withFormik && formik.isSubmitting)) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {saveButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (withFormik) {
    return (
      <form onSubmit={formik.handleSubmit}>
        <InnerFormContent
          values={formik.values}
          handleChange={formik.handleChange}
          setFieldValue={formik.setFieldValue}
          setTouched={formik.setTouched}
          errors={formik.errors}
          touched={formik.touched}
          formik={formik}
        />
      </form>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <InnerFormContent />
    </form>
  );
};

export default FieldBuilder;
