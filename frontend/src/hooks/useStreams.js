import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import streamApi from '../api/streamApi';

export const useStreams = (params) => {
    return useQuery({
        queryKey: ['streams', params],
        queryFn: () => streamApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useStream = (id) => {
    return useQuery({
        queryKey: ['streams', id],
        queryFn: () => streamApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateStream = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: streamApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['streams']);
        },
    });
};

export const useUpdateStream = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => streamApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['streams']);
        },
    });
};

export const useDeleteStream = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: streamApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['streams']);
        },
    });
};
