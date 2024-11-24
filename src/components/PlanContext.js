import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const [plans, setPlans] = useState([]); // 저장된 일정 상태

    // 컴포넌트가 마운트될 때 localStorage에서 저장된 일정을 불러오기
    useEffect(() => {
        const savedPlans = JSON.parse(localStorage.getItem('plans')) || [];
        setPlans(savedPlans);
    }, []);

    // plans가 변경될 때마다 localStorage에 저장하기
    useEffect(() => {
        localStorage.setItem('plans', JSON.stringify(plans));
    }, [plans]);

    const addPlan = (planName, items = []) => {
        if (!plans.some(plan => plan.name === planName)) {
            setPlans([...plans, { name: planName, items }]); // 각 일정에 이름과 항목 배열 추가
        }
    };

    const addItemToPlan = (planName, item) => {
        setPlans(plans.map(plan => 
            plan.name === planName ? { ...plan, items: [...plan.items, item] } : plan
        ));
    };

    return (
        <PlanContext.Provider value={{ plans, setPlans, addPlan, addItemToPlan }}>
            {children}
        </PlanContext.Provider>
    );
};
