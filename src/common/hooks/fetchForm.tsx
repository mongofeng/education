import * as React from "react";
import { DetailFun } from 'src/types/api';
const { useState, useEffect } = React;

const initLoading: boolean = false
const initisEdit: boolean = false
export default function <T>(initForm: T | null, fetchFun: DetailFun<T>, id?: string) {
    const [form, setForm] = useState(initForm);
    const [loading, setLoading] = useState(initLoading);
    const [isEdit, setIsEdit] = useState(initisEdit);


    const fetchDetail = async () => {
        if (!id) { return }
        const { data: { data } } = await fetchFun(id);
        setIsEdit(true)
        setForm(data)
    }


    useEffect(() => {
        fetchDetail();
        console.log('useEffect详情钩子')
    }, []);

    return {
        isEdit,
        loading,
        form,
        setLoading
    }
}