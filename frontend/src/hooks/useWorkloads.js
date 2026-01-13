import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import workloadApi from '../api/workloadApi';
import { toast } from 'react-toastify';
import { handleError } from '../services/errorHandler';

export const useWorkloads = (params) => {
    return useQuery({
        queryKey: ['workloads', params],
        queryFn: () => workloadApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useCreateWorkload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: workloadApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Workload created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create workload')
    });
};

export const useCreateBatchWorkload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: workloadApi.createBatch,
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Batch workloads created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create batch workloads')
    });
};

export const useUpdateWorkload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => workloadApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Workload updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update workload')
    });
};

export const useUpdateWorkloadGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: workloadApi.updateGroup,
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Workload Group updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update workload group')
    });
};

export const useDeleteWorkload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: workloadApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Workload deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete workload')
    });
};

export const useDeleteWorkloadGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: workloadApi.deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries(['workloads']);
            toast.success('Workload group deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete workload group')
    });
};
