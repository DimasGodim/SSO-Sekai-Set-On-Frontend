import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: ValidationErrors;
  isValid: boolean;
  setValue: (field: keyof T, value: string) => void;
  setValues: (newValues: Partial<T>) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  resetErrors: () => void;
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: ValidationRules
): UseFormValidationReturn<T> {
  const [values, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const validateField = useCallback((field: keyof T) => {
    const value = values[field];
    const rule = rules[field as string];
    
    if (!rule) return;
    
    let error: string | null = null;
    
    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      error = `${String(field)} is required`;
    }
    
    // Min length validation
    if (!error && rule.minLength && value.length < rule.minLength) {
      error = `${String(field)} must be at least ${rule.minLength} characters`;
    }
    
    // Max length validation
    if (!error && rule.maxLength && value.length > rule.maxLength) {
      error = `${String(field)} must be no more than ${rule.maxLength} characters`;
    }
    
    // Pattern validation
    if (!error && rule.pattern && !rule.pattern.test(value)) {
      error = `${String(field)} format is invalid`;
    }
    
    // Custom validation
    if (!error && rule.validate) {
      error = rule.validate(value);
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  }, [values, rules]);
  
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isFormValid = true;
    
    Object.keys(rules).forEach(field => {
      const value = values[field as keyof T];
      const rule = rules[field];
      let error: string | null = null;
      
      // Required validation
      if (rule.required && (!value || value.trim() === '')) {
        error = `${field} is required`;
        isFormValid = false;
      }
      
      // Min length validation
      if (!error && rule.minLength && value && value.length < rule.minLength) {
        error = `${field} must be at least ${rule.minLength} characters`;
        isFormValid = false;
      }
      
      // Max length validation
      if (!error && rule.maxLength && value && value.length > rule.maxLength) {
        error = `${field} must be no more than ${rule.maxLength} characters`;
        isFormValid = false;
      }
      
      // Pattern validation
      if (!error && rule.pattern && value && !rule.pattern.test(value)) {
        error = `${field} format is invalid`;
        isFormValid = false;
      }
      
      // Custom validation
      if (!error && rule.validate && value) {
        error = rule.validate(value);
        if (error) isFormValid = false;
      }
      
      newErrors[field] = error || '';
    });
    
    setErrors(newErrors);
    return isFormValid;
  }, [values, rules]);
  
  const setValue = useCallback((field: keyof T, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues(prev => ({ ...prev, ...newValues }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);
  
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const isValid = Object.values(errors).every(error => !error);
  
  return {
    values,
    errors,
    isValid,
    setValue,
    setValues,
    validateField,
    validateForm,
    resetForm,
    resetErrors,
  };
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
  },
  required: {
    required: true,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  nickname: {
    required: true,
    minLength: 2,
    maxLength: 30,
  },
} as const;
