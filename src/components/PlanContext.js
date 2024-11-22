import React, { createContext, useState } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const [plans, setPlans] = useState([]); // 저장된 일정 상태

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
