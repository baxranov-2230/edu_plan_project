import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subjectApi from '../api/subjectApi';

export const useSubjects = (params) => {
    return useQuery({
        queryKey: ['subjects', params],
        queryFn: () => subjectApi.getAll(params),
        keepPreviousData: true,
    });
};

export const useSubject = (id) => {
    return useQuery({
        queryKey: ['subjects', id],
        queryFn: () => subjectApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => subjectApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });
};
