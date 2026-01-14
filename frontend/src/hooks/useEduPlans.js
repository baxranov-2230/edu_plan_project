import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eduPlanApi from '../api/eduPlanApi';

export const useEduPlans = (params) => {
    return useQuery({
        queryKey: ['edu-plans', params],
        queryFn: () => eduPlanApi.getAll(params),
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateEduPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => eduPlanApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edu-plans'] });
        },
    });
};

export const useUpdateEduPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => eduPlanApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edu-plans'] });
        },
    });
};

export const useDeleteEduPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eduPlanApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edu-plans'] });
        },
    });
};
