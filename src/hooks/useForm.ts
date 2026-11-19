import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {}, initFormValidations = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [formValidation, setFormValidation] = useState({});
    const [firstValidation, setFirstValidation] = useState(true);
    useEffect(() => {
        createValidators();
    },[formState]);

    const onInputChange = ({ target }: any) => {
        if(target.type == "checkbox"){
            const { name, checked } = target;
            setFormState({
                ...formState,
                [ name ]: checked
            });
        }else{
            const { name, value } = target;
            setFormState({
                ...formState,
                [ name ]: value
            });
        }
    }

    const isFormValid = useMemo(()=>{
        for(const formValue of Object.keys(formValidation))
            if(formValidation[formValue]==null) return false;
        return true;
    },[formValidation])

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = () => {
        const formCheckedValues = {};
        for(const formField of Object.keys(initFormValidations)){
            const {validation,msgError = 'Este campo es requerido.'} = initFormValidations[formField];
            formCheckedValues[`${formField}Valid`] = validation(formState[formField]) || firstValidation ? null : msgError;
        }
        setFirstValidation(false);
        setFormValidation(formCheckedValues);
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        setFormState,
        ...formValidation,
        isFormValid
    }
}