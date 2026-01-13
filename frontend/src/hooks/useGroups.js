import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import groupApi from '../api/groupApi';

export const useGroups = (params) => {
    return useQuery({
        queryKey: ['groups', params],
        queryFn: () => groupApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useGroup = (id) => {
    return useQuery({
        queryKey: ['groups', id],
        queryFn: () => groupApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: groupApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => groupApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: groupApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
        },
    });
};
